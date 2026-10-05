import logging
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.models.message import Message, MessageStatus
from database.repositories.message_repository import MessageRepository
from messaging.providers import get_whatsapp_provider
from workflows.events import AutomationEventSchema

logger = logging.getLogger(__name__)


class RetryWorkflow:
    """Handles automatic and manual retries of failed messages."""

    def __init__(self, db: Session):
        self.db = db
        self.message_repo = MessageRepository(db)
        self.provider = get_whatsapp_provider()

    def handle_retry_event(self, event: AutomationEventSchema, db: Session) -> Dict[str, Any]:
        """Triggered upon `message.retry` event."""
        message_id = event.payload.get("message_id")
        return self.retry_message(message_id)

    def retry_message(self, message_id: str) -> Dict[str, Any]:
        """Retries a specific message if under maximum retries."""
        msg = self.message_repo.get_by_id(message_id)
        if not msg:
            return {"error": "Message not found"}

        if msg.retry_count >= msg.max_retries:
            return {"error": f"Message exceeded max retries ({msg.max_retries})"}

        msg.retry_count += 1
        msg.status = MessageStatus.QUEUED.value
        self.message_repo.update(msg)

        try:
            metadata = msg.get_metadata()
            if msg.message_type == "template" and msg.template_name:
                variables = metadata.get("variables", {})
                res = self.provider.send_template(
                    phone_number=msg.phone_number,
                    template_name=msg.template_name,
                    variables=variables,
                    cafe_id=msg.cafe_id,
                    metadata=metadata
                )
            else:
                res = self.provider.send_message(
                    phone_number=msg.phone_number,
                    content=msg.content,
                    cafe_id=msg.cafe_id,
                    metadata=metadata
                )

            if res.success:
                msg.status = res.status
                msg.provider_message_id = res.provider_message_id
                msg.sent_time = datetime.utcnow()
                msg.error_information = None
            else:
                msg.status = MessageStatus.FAILED.value
                msg.error_information = res.error_message or "Retry delivery failed"
        except Exception as e:
            logger.error(f"Error while retrying message {message_id}: {e}")
            msg.status = MessageStatus.FAILED.value
            msg.error_information = str(e)

        self.message_repo.update(msg)
        return {"message_id": msg.id, "status": msg.status, "retry_count": msg.retry_count}

    def retry_all_failed(self, cafe_id: str) -> List[Dict[str, Any]]:
        """Retries all failed messages eligible for retry for a given cafe."""
        failed_messages = self.message_repo.get_failed_messages_for_retry(cafe_id)
        results = []
        for msg in failed_messages:
            res = self.retry_message(msg.id)
            results.append(res)
        return results

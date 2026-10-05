import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.models.message import Message, MessageStatus, MessageDirection, MessageType
from database.repositories.message_repository import MessageRepository
from database.repositories.customer_repository import CustomerRepository
from database.repositories.template_repository import TemplateRepository
from messaging.sender import MessageSender
from messaging.templates.renderer import TemplateRenderer
from scheduler import get_scheduler
from workflows.system.retry_workflows import RetryWorkflow

logger = logging.getLogger(__name__)


class NotificationService:
    """Service providing message transmission, future scheduling, status tracking, and retries."""

    def __init__(self, db: Session):
        self.db = db
        self.message_repo = MessageRepository(db)
        self.customer_repo = CustomerRepository(db)
        self.template_repo = TemplateRepository(db)
        self.sender = MessageSender(db)
        self.scheduler = get_scheduler()

    def send_message(
        self,
        cafe_id: str,
        phone_number: str,
        content: str,
        customer_id: Optional[str] = None,
        category: str = "GENERAL"
    ) -> Message:
        """Sends an immediate WhatsApp text message."""
        return self.sender.send_text_message(
            cafe_id=cafe_id,
            phone_number=phone_number,
            content=content,
            customer_id=customer_id,
            category=category
        )

    def send_template(
        self,
        cafe_id: str,
        phone_number: str,
        template_name: str,
        variables: Dict[str, Any],
        customer_id: Optional[str] = None,
        category: str = "GENERAL"
    ) -> Message:
        """Sends an immediate WhatsApp template message."""
        template = self.template_repo.get_by_name(cafe_id, template_name)
        if not template:
            raise ValueError(f"Template '{template_name}' not found for cafe {cafe_id}")

        rendered = TemplateRenderer.render(template.content, variables)
        return self.sender.send_template_message(
            cafe_id=cafe_id,
            phone_number=phone_number,
            template_name=template_name,
            rendered_content=rendered,
            variables=variables,
            template_id=template.id,
            customer_id=customer_id,
            category=category or template.category
        )

    def schedule_message(
        self,
        cafe_id: str,
        phone_number: str,
        content: str,
        scheduled_time: datetime,
        template_name: Optional[str] = None,
        variables: Optional[Dict[str, Any]] = None,
        customer_id: Optional[str] = None,
        category: str = "GENERAL"
    ) -> Message:
        """Schedules a text or template message to be sent at `scheduled_time`."""
        cafe_id = cafe_id or settings.DEFAULT_CAFE_ID
        rendered_content = content

        if template_name:
            template = self.template_repo.get_by_name(cafe_id, template_name)
            if template:
                rendered_content = TemplateRenderer.render(template.content, variables or {})

        msg = Message(
            cafe_id=cafe_id,
            customer_id=customer_id,
            phone_number=phone_number.strip(),
            direction=MessageDirection.OUTGOING.value,
            message_type=MessageType.TEMPLATE.value if template_name else MessageType.TEXT.value,
            template_name=template_name,
            content=rendered_content,
            status=MessageStatus.SCHEDULED.value,
            scheduled_time=scheduled_time
        )
        if variables:
            msg.set_metadata({"variables": variables, "category": category})

        self.message_repo.add(msg)

        # Register in background scheduler
        self.scheduler.schedule_job(
            cafe_id=cafe_id,
            job_type="send_message",
            run_at=scheduled_time,
            payload={"message_id": msg.id, "category": category},
            target_id=msg.id
        )

        return msg

    def cancel_message(self, message_id: str) -> bool:
        """Cancels a scheduled or queued message."""
        msg = self.message_repo.get_by_id(message_id)
        if not msg:
            return False

        if msg.status in (MessageStatus.SCHEDULED.value, MessageStatus.QUEUED.value):
            self.scheduler.cancel_jobs_for_target(message_id)
            msg.status = MessageStatus.CANCELLED.value
            self.message_repo.update(msg)
            return True
        return False

    def retry_message(self, message_id: str) -> Dict[str, Any]:
        """Manually retries a failed message."""
        retry_workflow = RetryWorkflow(self.db)
        return retry_workflow.retry_message(message_id)

    def get_message(self, message_id: str) -> Optional[Message]:
        return self.message_repo.get_by_id(message_id)

    def list_messages(
        self,
        cafe_id: str,
        status: Optional[str] = None,
        phone: Optional[str] = None,
        customer_id: Optional[str] = None,
        direction: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Message]:
        return self.message_repo.list_messages(
            cafe_id=cafe_id,
            status=status,
            phone=phone,
            customer_id=customer_id,
            direction=direction,
            limit=limit,
            offset=offset
        )

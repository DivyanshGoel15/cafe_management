import logging
from typing import Dict, Any
from sqlalchemy.orm import Session
from workflows.events import AutomationEventSchema
from messaging.receiver import MessageReceiver

logger = logging.getLogger(__name__)


class CustomerReplyWorkflow:
    """Handles incoming customer messages and reply interactions."""

    def __init__(self, db: Session):
        self.db = db
        self.receiver = MessageReceiver(db)

    def handle_incoming_reply(self, event: AutomationEventSchema, db: Session) -> Dict[str, Any]:
        payload = event.payload
        phone = payload.get("phone") or payload.get("phone_number")
        content = payload.get("content") or payload.get("message")
        cafe_id = event.cafe_id

        return self.receiver.handle_customer_message(
            cafe_id=cafe_id,
            phone_number=phone,
            content=content,
            provider_message_id=payload.get("provider_message_id")
        )

import logging
from typing import Dict, Any, Callable
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

# Global registry of job handlers: job_type -> callable(db: Session, payload: dict, target_id: str)
JOB_HANDLERS: Dict[str, Callable[[Session, Dict[str, Any], str], Any]] = {}


def register_job_handler(job_type: str):
    """Decorator to register a function as a scheduled job handler."""
    def decorator(fn: Callable[[Session, Dict[str, Any], str], Any]):
        JOB_HANDLERS[job_type] = fn
        return fn
    return decorator


@register_job_handler("send_message")
def handle_send_scheduled_message(db: Session, payload: dict, target_id: str):
    """Executes a previously scheduled one-off text or template message."""
    from messaging.sender import MessageSender
    from database.repositories.message_repository import MessageRepository
    from database.models.message import MessageStatus

    message_repo = MessageRepository(db)
    message_id = target_id or payload.get("message_id")
    msg = message_repo.get_by_id(message_id)

    if not msg:
        logger.warning(f"Scheduled message {message_id} not found in database.")
        return

    if msg.status == MessageStatus.CANCELLED.value:
        logger.info(f"Scheduled message {message_id} was cancelled, skipping execution.")
        return

    sender = MessageSender(db)
    if msg.message_type == "template" and msg.template_name:
        sender.send_template_message(
            cafe_id=msg.cafe_id,
            phone_number=msg.phone_number,
            template_name=msg.template_name,
            rendered_content=msg.content,
            variables=msg.get_metadata().get("variables", {}),
            template_id=msg.template_id,
            customer_id=msg.customer_id,
            category=payload.get("category", "GENERAL")
        )
    else:
        sender.send_text_message(
            cafe_id=msg.cafe_id,
            phone_number=msg.phone_number,
            content=msg.content,
            customer_id=msg.customer_id,
            category=payload.get("category", "GENERAL")
        )


@register_job_handler("send_reminder")
def handle_send_booking_reminder(db: Session, payload: dict, target_id: str):
    """Executes a scheduled booking reminder (e.g. 24h or 2h before)."""
    from workflows.booking.booking_workflows import BookingWorkflow

    workflow = BookingWorkflow(db)
    workflow.execute_reminder(
        booking_id=target_id,
        reminder_type=payload.get("reminder_type", "24h"),
        payload=payload
    )


@register_job_handler("run_campaign")
def handle_run_campaign(db: Session, payload: dict, target_id: str):
    """Executes a scheduled broadcast marketing campaign."""
    from workflows.marketing.campaign_workflows import CampaignWorkflow

    workflow = CampaignWorkflow(db)
    campaign_id = target_id or payload.get("campaign_id")
    workflow.execute_campaign(campaign_id)


@register_job_handler("retry_failed_message")
def handle_retry_failed_message(db: Session, payload: dict, target_id: str):
    """Retries sending a previously failed message."""
    from workflows.system.retry_workflows import RetryWorkflow

    workflow = RetryWorkflow(db)
    workflow.retry_message(message_id=target_id)

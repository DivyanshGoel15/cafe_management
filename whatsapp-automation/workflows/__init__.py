from workflows.engine import AutomationEngine, get_automation_engine
from workflows.events import (
    AutomationEventSchema,
    EVENT_BOOKING_CREATED,
    EVENT_BOOKING_UPDATED,
    EVENT_BOOKING_CANCELLED,
    EVENT_BOOKING_REMINDER,
    EVENT_BOOKING_NOSHOW,
    EVENT_ORDER_CREATED,
    EVENT_ORDER_CONFIRMED,
    EVENT_ORDER_PREPARING,
    EVENT_ORDER_READY,
    EVENT_ORDER_COMPLETED,
    EVENT_ORDER_CANCELLED,
    EVENT_CAMPAIGN_EXECUTE,
    EVENT_MESSAGE_RETRY,
)
from workflows.booking.booking_workflows import BookingWorkflow
from workflows.orders.order_workflows import OrderWorkflow
from workflows.marketing.campaign_workflows import CampaignWorkflow
from workflows.customer.reply_workflows import CustomerReplyWorkflow
from workflows.system.retry_workflows import RetryWorkflow


def register_all_workflows(engine: AutomationEngine):
    """Wires up all built-in event handlers to the automation engine."""

    # Booking workflows
    engine.subscribe(
        EVENT_BOOKING_CREATED,
        lambda event, db: BookingWorkflow(db).handle_booking_created(event, db)
    )
    engine.subscribe(
        EVENT_BOOKING_UPDATED,
        lambda event, db: BookingWorkflow(db).handle_booking_updated(event, db)
    )
    engine.subscribe(
        EVENT_BOOKING_CANCELLED,
        lambda event, db: BookingWorkflow(db).handle_booking_cancelled(event, db)
    )
    engine.subscribe(
        EVENT_BOOKING_NOSHOW,
        lambda event, db: BookingWorkflow(db).handle_booking_noshow(event, db)
    )

    # Order workflows
    order_events = [
        EVENT_ORDER_CREATED,
        EVENT_ORDER_CONFIRMED,
        EVENT_ORDER_PREPARING,
        EVENT_ORDER_READY,
        EVENT_ORDER_COMPLETED,
        EVENT_ORDER_CANCELLED,
    ]
    for ev in order_events:
        engine.subscribe(
            ev,
            lambda event, db: OrderWorkflow(db).handle_order_event(event, db)
        )

    # Campaign workflows
    engine.subscribe(
        EVENT_CAMPAIGN_EXECUTE,
        lambda event, db: CampaignWorkflow(db).handle_campaign_execute_event(event, db)
    )

    # Customer replies
    engine.subscribe(
        "customer.reply",
        lambda event, db: CustomerReplyWorkflow(db).handle_incoming_reply(event, db)
    )

    # System retries
    engine.subscribe(
        EVENT_MESSAGE_RETRY,
        lambda event, db: RetryWorkflow(db).handle_retry_event(event, db)
    )


__all__ = [
    "AutomationEngine",
    "get_automation_engine",
    "register_all_workflows",
    "AutomationEventSchema",
]

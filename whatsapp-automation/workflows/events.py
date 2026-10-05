import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class AutomationEventSchema(BaseModel):
    """Event schema representing occurrences within the cafe ecosystem."""
    event_id: str = Field(default_factory=lambda: f"evt_{uuid.uuid4().hex[:12]}")
    event_type: str
    cafe_id: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# Standard Event Types
EVENT_BOOKING_CREATED = "booking.created"
EVENT_BOOKING_UPDATED = "booking.updated"
EVENT_BOOKING_CANCELLED = "booking.cancelled"
EVENT_BOOKING_REMINDER = "booking.reminder"
EVENT_BOOKING_NOSHOW = "booking.no_show"

EVENT_ORDER_CREATED = "order.created"
EVENT_ORDER_CONFIRMED = "order.confirmed"
EVENT_ORDER_PREPARING = "order.preparing"
EVENT_ORDER_READY = "order.ready"
EVENT_ORDER_COMPLETED = "order.completed"
EVENT_ORDER_CANCELLED = "order.cancelled"

EVENT_CUSTOMER_CREATED = "customer.created"
EVENT_CAMPAIGN_SCHEDULED = "campaign.scheduled"
EVENT_CAMPAIGN_EXECUTE = "campaign.execute"
EVENT_MESSAGE_RETRY = "message.retry"

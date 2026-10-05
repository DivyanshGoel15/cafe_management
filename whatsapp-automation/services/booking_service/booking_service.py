from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from workflows.engine import get_automation_engine
from workflows.events import (
    EVENT_BOOKING_CREATED,
    EVENT_BOOKING_UPDATED,
    EVENT_BOOKING_CANCELLED,
    EVENT_BOOKING_NOSHOW
)


class BookingAutomationService:
    """Service layer exposing booking event triggers for Cafe integration and internal workflows."""

    def __init__(self, db: Session):
        self.db = db
        self.engine = get_automation_engine()

    def trigger_booking_created(self, payload: Dict[str, Any], cafe_id: Optional[str] = None) -> Dict[str, Any]:
        return self.engine.publish_event(EVENT_BOOKING_CREATED, payload, cafe_id)

    def trigger_booking_updated(self, payload: Dict[str, Any], cafe_id: Optional[str] = None) -> Dict[str, Any]:
        return self.engine.publish_event(EVENT_BOOKING_UPDATED, payload, cafe_id)

    def trigger_booking_cancelled(self, payload: Dict[str, Any], cafe_id: Optional[str] = None) -> Dict[str, Any]:
        return self.engine.publish_event(EVENT_BOOKING_CANCELLED, payload, cafe_id)

    def trigger_booking_noshow(self, payload: Dict[str, Any], cafe_id: Optional[str] = None) -> Dict[str, Any]:
        return self.engine.publish_event(EVENT_BOOKING_NOSHOW, payload, cafe_id)

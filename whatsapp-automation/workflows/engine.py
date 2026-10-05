import logging
from typing import Dict, List, Callable, Any, Optional
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.session import get_db_context
from database.models.workflow import AutomationEvent
from workflows.events import AutomationEventSchema

logger = logging.getLogger(__name__)

EventHandler = Callable[[AutomationEventSchema, Session], Any]


class AutomationEngine:
    """
    Reusable event-driven automation engine.
    Connects incoming cafe events (e.g. booking.created, order.ready)
    to automated workflows, templates, and outbound messaging.
    """

    def __init__(self):
        self._handlers: Dict[str, List[EventHandler]] = {}

    def subscribe(self, event_type: str, handler: EventHandler):
        """Register a workflow handler for a specific event type."""
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
        logger.info(f"Subscribed handler '{handler.__name__}' to event '{event_type}'")

    def publish_event(
        self,
        event_type: str,
        payload: Dict[str, Any],
        cafe_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Dispatches an event to all subscribed workflow handlers.
        Persists the event in the database for auditability.
        """
        cafe_id = cafe_id or payload.get("cafe_id") or settings.DEFAULT_CAFE_ID
        event = AutomationEventSchema(
            event_type=event_type,
            cafe_id=cafe_id,
            payload=payload
        )

        handlers = self._handlers.get(event_type, [])
        logger.info(f"Publishing event '{event_type}' to {len(handlers)} handler(s)")

        results = []
        overall_status = "PROCESSED"
        err_messages = []

        with get_db_context() as db:
            # Audit log record
            db_event = AutomationEvent(
                id=event.event_id,
                cafe_id=cafe_id,
                event_type=event_type,
                status="PENDING"
            )
            db_event.set_payload(payload)
            db.add(db_event)
            db.commit()

            for handler in handlers:
                try:
                    res = handler(event, db)
                    results.append({"handler": handler.__name__, "success": True, "result": res})
                except Exception as e:
                    logger.error(f"Error executing handler {handler.__name__} on event {event_type}: {e}", exc_info=True)
                    overall_status = "FAILED"
                    err_messages.append(f"{handler.__name__}: {str(e)}")
                    results.append({"handler": handler.__name__, "success": False, "error": str(e)})

            # Update event status
            db_event.status = overall_status
            if err_messages:
                db_event.error_message = "; ".join(err_messages)
            db.commit()

        return {
            "event_id": event.event_id,
            "event_type": event_type,
            "status": overall_status,
            "handlers_executed": len(handlers),
            "results": results
        }


_engine_instance = None


def get_automation_engine() -> AutomationEngine:
    """Returns the singleton AutomationEngine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = AutomationEngine()
    return _engine_instance

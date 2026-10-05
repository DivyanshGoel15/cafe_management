from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.session import get_db
from database.models.workflow import AutomationEvent
from workflows.engine import get_automation_engine

router = APIRouter(prefix="/workflows", tags=["Workflows & Events"])


class PublishEventRequest(BaseModel):
    event_type: str = Field(..., description="e.g. booking.created, order.ready, campaign.execute")
    payload: Dict[str, Any] = Field(default_factory=dict)
    cafe_id: Optional[str] = None


@router.post("/events/publish")
def publish_automation_event(req: PublishEventRequest):
    """Directly dispatches an event into the automation engine."""
    engine = get_automation_engine()
    cafe_id = req.cafe_id or settings.DEFAULT_CAFE_ID
    return engine.publish_event(
        event_type=req.event_type,
        payload=req.payload,
        cafe_id=cafe_id
    )


@router.get("/events")
def list_event_history(
    cafe_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieve event dispatch audit log."""
    target_cafe = cafe_id or settings.DEFAULT_CAFE_ID
    events = db.query(AutomationEvent).filter(
        AutomationEvent.cafe_id == target_cafe
    ).order_by(AutomationEvent.created_at.desc()).limit(limit).all()
    return [e.to_dict() for e in events]

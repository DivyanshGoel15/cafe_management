import json
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from database.models.base import Base


class AutomationEvent(Base):
    """Audit log of all incoming automation events dispatched across the system."""
    __tablename__ = "automation_events"

    id = Column(String(64), primary_key=True, default=lambda: f"evt_{uuid.uuid4().hex[:12]}")
    cafe_id = Column(String(64), nullable=False, index=True)
    event_type = Column(String(64), nullable=False, index=True)
    payload_json = Column(Text, default="{}", nullable=False)
    status = Column(String(32), default="PENDING", nullable=False, index=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def get_payload(self) -> dict:
        try:
            return json.loads(self.payload_json) if self.payload_json else {}
        except Exception:
            return {}

    def set_payload(self, data: dict):
        self.payload_json = json.dumps(data)

    def to_dict(self):
        return {
            "id": self.id,
            "cafe_id": self.cafe_id,
            "event_type": self.event_type,
            "payload": self.get_payload(),
            "status": self.status,
            "error_message": self.error_message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

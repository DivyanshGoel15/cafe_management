import enum
import json
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text
from database.models.base import Base, TimestampMixin


class CampaignStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    PROCESSING = "PROCESSING"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class AudienceFilter(str, enum.Enum):
    ALL = "ALL"
    NEW = "NEW"
    RETURNING = "RETURNING"
    INACTIVE = "INACTIVE"
    HIGH_VALUE = "HIGH_VALUE"
    CUSTOM = "CUSTOM"


class Campaign(Base, TimestampMixin):
    """Represents a WhatsApp broadcast marketing campaign."""
    __tablename__ = "campaigns"

    id = Column(String(64), primary_key=True, default=lambda: f"camp_{uuid.uuid4().hex[:12]}")
    cafe_id = Column(String(64), nullable=False, index=True)
    name = Column(String(128), nullable=False)

    template_id = Column(String(64), nullable=False)
    template_name = Column(String(128), nullable=True)

    audience_filter = Column(String(32), default=AudienceFilter.ALL.value, nullable=False)
    audience_criteria_json = Column(Text, default="{}", nullable=False)

    status = Column(String(32), default=CampaignStatus.DRAFT.value, nullable=False, index=True)
    scheduled_time = Column(DateTime, nullable=True, index=True)
    completed_time = Column(DateTime, nullable=True)

    # Performance Analytics
    total_target_count = Column(Integer, default=0, nullable=False)
    sent_count = Column(Integer, default=0, nullable=False)
    delivered_count = Column(Integer, default=0, nullable=False)
    failed_count = Column(Integer, default=0, nullable=False)
    opt_out_count = Column(Integer, default=0, nullable=False)

    def get_criteria(self) -> dict:
        try:
            return json.loads(self.audience_criteria_json) if self.audience_criteria_json else {}
        except Exception:
            return {}

    def set_criteria(self, criteria: dict):
        self.audience_criteria_json = json.dumps(criteria)

    def to_dict(self):
        delivery_rate = round((self.delivered_count / self.sent_count * 100), 2) if self.sent_count > 0 else 0.0
        return {
            "id": self.id,
            "cafe_id": self.cafe_id,
            "name": self.name,
            "template_id": self.template_id,
            "template_name": self.template_name,
            "audience_filter": self.audience_filter,
            "audience_criteria": self.get_criteria(),
            "status": self.status,
            "scheduled_time": self.scheduled_time.isoformat() if self.scheduled_time else None,
            "completed_time": self.completed_time.isoformat() if self.completed_time else None,
            "total_target_count": self.total_target_count,
            "sent_count": self.sent_count,
            "delivered_count": self.delivered_count,
            "failed_count": self.failed_count,
            "opt_out_count": self.opt_out_count,
            "delivery_rate": delivery_rate,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

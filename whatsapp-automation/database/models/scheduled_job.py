import enum
import json
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text
from database.models.base import Base, TimestampMixin


class JobStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class ScheduledJob(Base, TimestampMixin):
    """Stores background scheduled tasks such as delayed reminders, scheduled messages, and campaigns."""
    __tablename__ = "scheduled_jobs"

    id = Column(String(64), primary_key=True, default=lambda: f"job_{uuid.uuid4().hex[:12]}")
    cafe_id = Column(String(64), nullable=False, index=True)
    job_type = Column(String(64), nullable=False, index=True)
    target_id = Column(String(64), nullable=True, index=True)

    run_at = Column(DateTime, nullable=False, index=True)
    status = Column(String(32), default=JobStatus.PENDING.value, nullable=False, index=True)

    payload_json = Column(Text, default="{}", nullable=False)
    retry_count = Column(Integer, default=0, nullable=False)
    max_retries = Column(Integer, default=3, nullable=False)
    last_error = Column(Text, nullable=True)

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
            "job_type": self.job_type,
            "target_id": self.target_id,
            "run_at": self.run_at.isoformat() if self.run_at else None,
            "status": self.status,
            "payload": self.get_payload(),
            "retry_count": self.retry_count,
            "max_retries": self.max_retries,
            "last_error": self.last_error,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from database.models.base import Base, TimestampMixin


class OptOutRecord(Base, TimestampMixin):
    """Tracks customer opt-out and opt-in status to prevent unwanted marketing messages."""
    __tablename__ = "opt_out_records"

    id = Column(String(64), primary_key=True, default=lambda: f"opt_{uuid.uuid4().hex[:12]}")
    cafe_id = Column(String(64), nullable=False, index=True)
    customer_id = Column(String(64), nullable=True, index=True)
    phone_number = Column(String(32), nullable=False, index=True)

    reason = Column(String(128), default="STOP_KEYWORD", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False, index=True)  # True = opted out, False = opted back in

    opted_out_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    opted_in_at = Column(DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "cafe_id": self.cafe_id,
            "customer_id": self.customer_id,
            "phone_number": self.phone_number,
            "reason": self.reason,
            "is_active": self.is_active,
            "opted_out_at": self.opted_out_at.isoformat() if self.opted_out_at else None,
            "opted_in_at": self.opted_in_at.isoformat() if self.opted_in_at else None,
        }

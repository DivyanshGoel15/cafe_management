import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, Text
from database.models.base import Base, TimestampMixin


class Customer(Base, TimestampMixin):
    """Represents a cafe customer in the WhatsApp automation database."""
    __tablename__ = "customers"

    id = Column(String(64), primary_key=True, default=lambda: f"cust_{uuid.uuid4().hex[:12]}")
    cafe_id = Column(String(64), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    phone = Column(String(32), nullable=False, index=True)
    email = Column(String(128), nullable=True)

    # Opt-out and contact safeguards
    is_opted_out = Column(Boolean, default=False, nullable=False, index=True)
    do_not_contact = Column(Boolean, default=False, nullable=False)

    # Segmentation & metadata
    tags = Column(String(256), default="", nullable=False)  # comma-separated e.g. "new,vip"
    total_orders = Column(Integer, default=0, nullable=False)
    total_spent = Column(Float, default=0.0, nullable=False)
    last_visit_at = Column(DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "cafe_id": self.cafe_id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "is_opted_out": self.is_opted_out,
            "do_not_contact": self.do_not_contact,
            "tags": [t.strip() for t in self.tags.split(",") if t.strip()] if self.tags else [],
            "total_orders": self.total_orders,
            "total_spent": self.total_spent,
            "last_visit_at": self.last_visit_at.isoformat() if self.last_visit_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

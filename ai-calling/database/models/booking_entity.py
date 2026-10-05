from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base


class TableModel(Base):
    __tablename__ = "tables"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    location = Column(String(50), default="indoor")  # indoor, window, patio, private
    is_active = Column(Boolean, default=True)


class BookingModel(Base):
    __tablename__ = "bookings"

    id = Column(String(50), primary_key=True)
    customer_id = Column(String(50), ForeignKey("customers.id"), nullable=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(30), nullable=False, index=True)
    booking_date = Column(String(20), nullable=False, index=True)  # YYYY-MM-DD
    booking_time = Column(String(20), nullable=False)  # HH:MM
    guests_count = Column(Integer, nullable=False)
    table_id = Column(String(50), ForeignKey("tables.id"), nullable=True)
    special_requests = Column(Text, nullable=True)
    status = Column(String(30), default="confirmed")  # confirmed, modified, cancelled
    cancellation_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    table = relationship("TableModel", lazy="joined")

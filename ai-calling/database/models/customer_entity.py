from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from .base import Base


class CustomerModel(Base):
    __tablename__ = "customers"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=False, unique=True, index=True)
    email = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

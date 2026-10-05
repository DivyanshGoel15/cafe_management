from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Text
from .base import Base


class AgentModel(Base):
    __tablename__ = "agents"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), default="Host & Reservation Specialist")
    cafe_name = Column(String(100), default="Bella Vista Bistro")
    system_prompt = Column(Text, nullable=False)
    tone = Column(String(50), default="natural, professional, friendly, concise")
    language = Column(String(20), default="en-US")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base


class CallModel(Base):
    __tablename__ = "calls"

    id = Column(String(50), primary_key=True)
    caller_number = Column(String(30), nullable=False, index=True)
    customer_id = Column(String(50), ForeignKey("customers.id"), nullable=True)
    agent_id = Column(String(50), nullable=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration = Column(Integer, default=0)  # in seconds
    direction = Column(String(20), default="incoming")  # incoming, outgoing
    status = Column(String(30), default="Ringing")  # Ringing, Connected, In Progress, Completed, Failed, Escalated
    purpose = Column(String(100), default="General Inquiry")
    outcome = Column(String(100), default="Pending")
    booking_id = Column(String(50), ForeignKey("bookings.id"), nullable=True)
    ai_summary = Column(Text, nullable=True)
    escalation_status = Column(String(30), default="None")  # None, Requested, Transferred, Failed
    created_at = Column(DateTime, default=datetime.utcnow)

    transcripts = relationship("CallTranscriptModel", back_populates="call", cascade="all, delete-orphan", order_by="CallTranscriptModel.timestamp")


class CallTranscriptModel(Base):
    __tablename__ = "call_transcripts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    call_id = Column(String(50), ForeignKey("calls.id"), nullable=False, index=True)
    speaker = Column(String(20), nullable=False)  # customer, ai, system
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    call = relationship("CallModel", back_populates="transcripts")

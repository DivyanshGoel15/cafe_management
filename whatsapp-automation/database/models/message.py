import enum
import json
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Enum
from database.models.base import Base


class MessageDirection(str, enum.Enum):
    INCOMING = "INCOMING"
    OUTGOING = "OUTGOING"


class MessageStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    QUEUED = "QUEUED"
    SENT = "SENT"
    DELIVERED = "DELIVERED"
    READ = "READ"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class MessageType(str, enum.Enum):
    TEXT = "text"
    TEMPLATE = "template"
    INTERACTIVE = "interactive"
    SYSTEM = "system"


class Message(Base):
    """WhatsApp message model storing inbound and outbound communication history."""
    __tablename__ = "messages"

    id = Column(String(64), primary_key=True, default=lambda: f"msg_{uuid.uuid4().hex[:12]}")
    cafe_id = Column(String(64), nullable=False, index=True)
    customer_id = Column(String(64), nullable=True, index=True)
    phone_number = Column(String(32), nullable=False, index=True)

    direction = Column(String(16), default=MessageDirection.OUTGOING.value, nullable=False, index=True)
    message_type = Column(String(16), default=MessageType.TEXT.value, nullable=False)
    category = Column(String(32), default="GENERAL", nullable=False, index=True)
    template_name = Column(String(128), nullable=True)
    template_id = Column(String(64), nullable=True)

    content = Column(Text, nullable=False)
    status = Column(String(16), default=MessageStatus.QUEUED.value, nullable=False, index=True)

    # Provider and tracing
    provider_message_id = Column(String(128), nullable=True)
    metadata_json = Column(Text, default="{}", nullable=False)

    # Lifecycle Timestamps
    created_time = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    scheduled_time = Column(DateTime, nullable=True, index=True)
    sent_time = Column(DateTime, nullable=True)
    delivered_time = Column(DateTime, nullable=True)
    read_time = Column(DateTime, nullable=True)

    # Failure tracking & retry
    error_information = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)
    max_retries = Column(Integer, default=3, nullable=False)

    def get_metadata(self) -> dict:
        try:
            return json.loads(self.metadata_json) if self.metadata_json else {}
        except Exception:
            return {}

    def set_metadata(self, data: dict):
        self.metadata_json = json.dumps(data)

    def to_dict(self):
        return {
            "id": self.id,
            "cafe_id": self.cafe_id,
            "customer_id": self.customer_id,
            "phone_number": self.phone_number,
            "direction": self.direction,
            "message_type": self.message_type,
            "category": self.category,
            "template_name": self.template_name,
            "template_id": self.template_id,
            "content": self.content,
            "status": self.status,
            "provider_message_id": self.provider_message_id,
            "metadata": self.get_metadata(),
            "created_time": self.created_time.isoformat() if self.created_time else None,
            "scheduled_time": self.scheduled_time.isoformat() if self.scheduled_time else None,
            "sent_time": self.sent_time.isoformat() if self.sent_time else None,
            "delivered_time": self.delivered_time.isoformat() if self.delivered_time else None,
            "read_time": self.read_time.isoformat() if self.read_time else None,
            "error_information": self.error_information,
            "retry_count": self.retry_count,
            "max_retries": self.max_retries,
        }

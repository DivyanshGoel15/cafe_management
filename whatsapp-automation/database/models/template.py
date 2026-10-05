import enum
import json
import uuid
from sqlalchemy import Column, String, Boolean, Text
from database.models.base import Base, TimestampMixin


class TemplateCategory(str, enum.Enum):
    BOOKING = "BOOKING"
    ORDERS = "ORDERS"
    MARKETING = "MARKETING"
    CUSTOMER = "CUSTOMER"
    GENERAL = "GENERAL"


class MessageTemplate(Base, TimestampMixin):
    """WhatsApp message template definition supporting variable substitutions."""
    __tablename__ = "message_templates"

    id = Column(String(64), primary_key=True, default=lambda: f"tmpl_{uuid.uuid4().hex[:12]}")
    cafe_id = Column(String(64), nullable=False, index=True)
    name = Column(String(128), nullable=False, index=True)
    category = Column(String(32), default=TemplateCategory.GENERAL.value, nullable=False, index=True)

    content = Column(Text, nullable=False)
    variables_json = Column(Text, default="[]", nullable=False)
    language = Column(String(16), default="en", nullable=False)
    is_enabled = Column(Boolean, default=True, nullable=False, index=True)
    description = Column(String(256), nullable=True)

    def get_variables(self) -> list:
        try:
            return json.loads(self.variables_json) if self.variables_json else []
        except Exception:
            return []

    def set_variables(self, vars_list: list):
        self.variables_json = json.dumps(list(vars_list))

    def to_dict(self):
        return {
            "id": self.id,
            "cafe_id": self.cafe_id,
            "name": self.name,
            "category": self.category,
            "content": self.content,
            "variables": self.get_variables(),
            "language": self.language,
            "is_enabled": self.is_enabled,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

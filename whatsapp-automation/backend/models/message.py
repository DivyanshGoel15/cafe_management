from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class SendMessageRequest(BaseModel):
    cafe_id: Optional[str] = None
    phone_number: str = Field(..., description="Recipient phone number with country code")
    content: Optional[str] = Field(None, description="Freeform text content")
    template_name: Optional[str] = Field(None, description="Name of template to send")
    variables: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Variables for template")
    customer_id: Optional[str] = None
    category: str = Field("GENERAL", description="BOOKING, ORDERS, MARKETING, CUSTOMER, GENERAL")


class ScheduleMessageRequest(BaseModel):
    cafe_id: Optional[str] = None
    phone_number: str = Field(..., description="Recipient phone number with country code")
    scheduled_time: datetime = Field(..., description="UTC ISO-8601 datetime to dispatch message")
    content: Optional[str] = None
    template_name: Optional[str] = None
    variables: Optional[Dict[str, Any]] = Field(default_factory=dict)
    customer_id: Optional[str] = None
    category: str = "GENERAL"


class MessageResponse(BaseModel):
    id: str
    cafe_id: str
    customer_id: Optional[str] = None
    phone_number: str
    direction: str
    message_type: str
    category: str = "GENERAL"
    template_name: Optional[str] = None
    template_id: Optional[str] = None
    content: str
    status: str
    provider_message_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_time: Optional[str] = None
    scheduled_time: Optional[str] = None
    sent_time: Optional[str] = None
    delivered_time: Optional[str] = None
    read_time: Optional[str] = None
    error_information: Optional[str] = None
    retry_count: int = 0
    max_retries: int = 3

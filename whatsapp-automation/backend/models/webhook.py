from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict


class WebhookBookingPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    booking_id: str
    customer_phone: str = Field(..., alias="phone")
    customer_name: Optional[str] = "Valued Guest"
    date: Optional[str] = "Today"
    time: Optional[str] = "7:00 PM"
    guests: Optional[int] = 2
    cafe_id: Optional[str] = None
    cafe_name: Optional[str] = None
    reservation_datetime: Optional[str] = None


class WebhookOrderPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    order_id: str
    customer_phone: str = Field(..., alias="phone")
    customer_name: Optional[str] = "Valued Customer"
    total_amount: Optional[str] = "0.00"
    status: Optional[str] = "CONFIRMED"
    cafe_id: Optional[str] = None
    cafe_name: Optional[str] = None
    items: Optional[List[str]] = Field(default_factory=list)


class WebhookIncomingPayload(BaseModel):
    phone_number: Optional[str] = None
    message: Optional[str] = None
    content: Optional[str] = None
    cafe_id: Optional[str] = None
    entry: Optional[List[Dict[str, Any]]] = None  # Meta Cloud API compatibility

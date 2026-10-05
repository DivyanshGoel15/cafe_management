from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class TableResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    capacity: int
    location: str
    is_active: bool = True


class AvailabilityRequest(BaseModel):
    date: str = Field(..., description="Date in YYYY-MM-DD format", json_schema_extra={"example": "2026-09-29"})
    time: str = Field(..., description="Time in HH:MM format", json_schema_extra={"example": "19:30"})
    party_size: int = Field(..., ge=1, le=20, description="Number of guests", json_schema_extra={"example": 4})


class AvailabilityResponse(BaseModel):
    is_available: bool
    date: str
    time: str
    party_size: int
    available_tables: List[TableResponse] = []
    message: str


class BookingCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    customer_name: str = Field(default="Guest", min_length=2)
    customer_phone: Optional[str] = None
    phone_number: Optional[str] = None
    booking_date: Optional[str] = None
    booking_time: Optional[str] = None
    reservation_time: Optional[str] = None
    guests_count: Optional[int] = None
    party_size: Optional[int] = None
    table_id: Optional[str] = None
    special_requests: Optional[str] = None


class BookingUpdateRequest(BaseModel):
    booking_id: Optional[str] = None
    new_date: Optional[str] = None
    new_time: Optional[str] = None
    new_guests_count: Optional[int] = None
    special_requests: Optional[str] = None


class BookingCancelRequest(BaseModel):
    booking_id: str
    reason: Optional[str] = "Customer requested cancellation"


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    customer_name: str
    customer_phone: str
    booking_date: str
    booking_time: str
    guests_count: int
    table_id: Optional[str] = None
    table_name: Optional[str] = None
    special_requests: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

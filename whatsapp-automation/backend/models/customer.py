from typing import Optional, List
from pydantic import BaseModel, Field


class CustomerCreateRequest(BaseModel):
    cafe_id: Optional[str] = None
    name: str = Field(..., description="Customer full name")
    phone: str = Field(..., description="E.164 phone number")
    email: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)


class OptOutRequest(BaseModel):
    cafe_id: Optional[str] = None
    reason: Optional[str] = "MANUAL_REQUEST"


class CustomerResponse(BaseModel):
    id: str
    cafe_id: str
    name: str
    phone: str
    email: Optional[str] = None
    is_opted_out: bool
    do_not_contact: bool
    tags: List[str]
    total_orders: int
    total_spent: float
    last_visit_at: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

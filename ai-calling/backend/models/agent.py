from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class AgentCreateRequest(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Bella - AI Host"})
    role: str = Field(default="Reservation Specialist", json_schema_extra={"example": "Reservation Specialist"})
    cafe_name: str = Field(default="Bella Vista Bistro", json_schema_extra={"example": "Bella Vista Bistro"})
    system_prompt: str = Field(..., json_schema_extra={"example": "You are the AI host..."})
    tone: Optional[str] = "natural, professional, friendly, concise"
    language: Optional[str] = "en-US"
    is_active: Optional[bool] = True


class AgentUpdateRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    cafe_name: Optional[str] = None
    system_prompt: Optional[str] = None
    tone: Optional[str] = None
    language: Optional[str] = None
    is_active: Optional[bool] = None


class AgentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    role: str
    cafe_name: str
    system_prompt: str
    tone: str
    language: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

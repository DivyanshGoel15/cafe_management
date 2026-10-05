from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class TemplateCreateRequest(BaseModel):
    cafe_id: Optional[str] = None
    name: str = Field(..., description="Unique template name (e.g. booking_confirmation)")
    content: str = Field(..., description="Template body containing {{variable_name}} placeholders")
    category: str = Field("GENERAL", description="BOOKING, ORDERS, MARKETING, CUSTOMER, GENERAL")
    language: str = Field("en", description="Template language code")
    description: Optional[str] = None


class TemplateUpdateRequest(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    is_enabled: Optional[bool] = None
    description: Optional[str] = None


class TemplatePreviewRequest(BaseModel):
    content: str = Field(..., description="Template content with variables")
    variables: Dict[str, Any] = Field(default_factory=dict, description="Sample values to substitute")


class TemplateResponse(BaseModel):
    id: str
    cafe_id: str
    name: str
    category: str
    content: str
    variables: List[str]
    language: str
    is_enabled: bool
    description: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

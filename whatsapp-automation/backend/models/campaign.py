from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class CampaignCreateRequest(BaseModel):
    cafe_id: Optional[str] = None
    name: str = Field(..., description="Campaign name (e.g. Weekend Coffee Roast Discount)")
    template_id: str = Field(..., description="ID or name of the template to broadcast")
    audience_filter: str = Field("ALL", description="ALL, NEW, RETURNING, INACTIVE, HIGH_VALUE, CUSTOM")
    audience_criteria: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Filter criteria & template vars")
    scheduled_time: Optional[datetime] = None


class CampaignUpdateRequest(BaseModel):
    name: Optional[str] = None
    template_id: Optional[str] = None
    audience_filter: Optional[str] = None
    audience_criteria: Optional[Dict[str, Any]] = None
    scheduled_time: Optional[datetime] = None


class CampaignResponse(BaseModel):
    id: str
    cafe_id: str
    name: str
    template_id: str
    template_name: Optional[str] = None
    audience_filter: str
    audience_criteria: Dict[str, Any]
    status: str
    scheduled_time: Optional[str] = None
    completed_time: Optional[str] = None
    total_target_count: int = 0
    sent_count: int = 0
    delivered_count: int = 0
    failed_count: int = 0
    opt_out_count: int = 0
    delivery_rate: float = 0.0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

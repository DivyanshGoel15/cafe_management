from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.config.settings import settings
from backend.models.campaign import CampaignCreateRequest, CampaignUpdateRequest, CampaignResponse
from backend.api.dependencies import get_campaign_svc
from services.campaign_service import CampaignService

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


@router.get("", response_model=List[CampaignResponse])
def list_campaigns(
    cafe_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    service: CampaignService = Depends(get_campaign_svc)
):
    """Retrieve marketing campaigns list."""
    target_cafe = cafe_id or settings.DEFAULT_CAFE_ID
    campaigns = service.list_campaigns(target_cafe, status, limit, offset)
    return [c.to_dict() for c in campaigns]


@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(req: CampaignCreateRequest, service: CampaignService = Depends(get_campaign_svc)):
    """Create a new broadcast campaign, optionally scheduling it."""
    target_cafe = req.cafe_id or settings.DEFAULT_CAFE_ID
    campaign = service.create_campaign(
        cafe_id=target_cafe,
        name=req.name,
        template_id=req.template_id,
        audience_filter=req.audience_filter,
        audience_criteria=req.audience_criteria,
        scheduled_time=req.scheduled_time
    )
    return campaign.to_dict()


@router.get("/{id}", response_model=CampaignResponse)
def get_campaign(id: str, service: CampaignService = Depends(get_campaign_svc)):
    """Retrieve a campaign by ID."""
    campaign = service.get_campaign(id)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return campaign.to_dict()


@router.put("/{id}", response_model=CampaignResponse)
def update_campaign(id: str, req: CampaignUpdateRequest, service: CampaignService = Depends(get_campaign_svc)):
    """Update campaign configuration."""
    campaign = service.update_campaign(
        campaign_id=id,
        name=req.name,
        template_id=req.template_id,
        audience_filter=req.audience_filter,
        audience_criteria=req.audience_criteria,
        scheduled_time=req.scheduled_time
    )
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return campaign.to_dict()


@router.delete("/{id}")
def delete_campaign(id: str, service: CampaignService = Depends(get_campaign_svc)):
    """Delete a campaign and cancel any scheduled runs."""
    success = service.delete_campaign(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return {"status": "success", "campaign_id": id, "deleted": True}


@router.post("/{id}/execute")
def execute_campaign_now(id: str, service: CampaignService = Depends(get_campaign_svc)):
    """Execute marketing campaign immediately."""
    result = service.execute_now(id)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result


@router.post("/{id}/pause", response_model=CampaignResponse)
def pause_campaign(id: str, service: CampaignService = Depends(get_campaign_svc)):
    """Pause a scheduled campaign."""
    campaign = service.pause_campaign(id)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found or cannot be paused")
    return campaign.to_dict()


@router.get("/{id}/statistics")
def get_campaign_stats(id: str, service: CampaignService = Depends(get_campaign_svc)):
    """Retrieve delivery and opt-out statistics for a specific campaign."""
    campaign = service.get_campaign(id)
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return {
        "campaign_id": campaign.id,
        "name": campaign.name,
        "status": campaign.status,
        "total_targets": campaign.total_target_count,
        "sent_count": campaign.sent_count,
        "delivered_count": campaign.delivered_count,
        "failed_count": campaign.failed_count,
        "opt_out_count": campaign.opt_out_count,
        "delivery_rate": round((campaign.delivered_count / campaign.sent_count * 100), 2) if campaign.sent_count > 0 else 0.0
    }

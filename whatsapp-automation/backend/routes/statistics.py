from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.config.settings import settings
from backend.models.statistics import StatisticsResponse
from database.session import get_db
from database.repositories.message_repository import MessageRepository
from database.repositories.opt_out_repository import OptOutRepository
from database.repositories.campaign_repository import CampaignRepository
from database.models.campaign import CampaignStatus

router = APIRouter(prefix="/statistics", tags=["Statistics"])


@router.get("", response_model=StatisticsResponse)
def get_automation_statistics(
    cafe_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieve full analytics on message delivery, active campaigns, opt-outs, and delivery rate."""
    target_cafe = cafe_id or settings.DEFAULT_CAFE_ID
    msg_repo = MessageRepository(db)
    opt_repo = OptOutRepository(db)
    camp_repo = CampaignRepository(db)

    status_counts = msg_repo.count_by_status(target_cafe)
    replies_count = msg_repo.count_replies(target_cafe)
    opt_outs_count = opt_repo.count_active_opt_outs(target_cafe)

    all_campaigns = camp_repo.list_campaigns(target_cafe, limit=1000)
    total_campaigns = len(all_campaigns)
    active_campaigns = sum(
        1 for c in all_campaigns if c.status in (CampaignStatus.SCHEDULED.value, CampaignStatus.PROCESSING.value)
    )

    sent = status_counts.get("SENT", 0) + status_counts.get("DELIVERED", 0) + status_counts.get("READ", 0)
    delivered = status_counts.get("DELIVERED", 0) + status_counts.get("READ", 0)
    read_cnt = status_counts.get("READ", 0)
    failed = status_counts.get("FAILED", 0)
    scheduled = status_counts.get("SCHEDULED", 0)
    queued = status_counts.get("QUEUED", 0)

    delivery_rate = round((delivered / sent * 100), 2) if sent > 0 else 0.0

    return StatisticsResponse(
        cafe_id=target_cafe,
        messages_sent=sent,
        messages_delivered=delivered,
        messages_read=read_cnt,
        messages_failed=failed,
        messages_scheduled=scheduled,
        messages_queued=queued,
        customer_replies=replies_count,
        active_opt_outs=opt_outs_count,
        total_campaigns=total_campaigns,
        active_campaigns=active_campaigns,
        delivery_rate_percentage=delivery_rate,
        breakdown_by_status=status_counts
    )

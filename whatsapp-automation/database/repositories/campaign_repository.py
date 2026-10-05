from typing import Optional, List
from sqlalchemy.orm import Session
from database.models.campaign import Campaign, CampaignStatus
from database.repositories.base import BaseRepository


class CampaignRepository(BaseRepository[Campaign]):
    def __init__(self, db: Session):
        super().__init__(db, Campaign)

    def list_campaigns(
        self,
        cafe_id: str,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Campaign]:
        query = self.db.query(Campaign).filter(Campaign.cafe_id == cafe_id)
        if status:
            query = query.filter(Campaign.status == status.upper())
        return query.order_by(Campaign.created_at.desc()).offset(offset).limit(limit).all()

    def update_status(self, campaign_id: str, status: CampaignStatus | str) -> Optional[Campaign]:
        campaign = self.get_by_id(campaign_id)
        if campaign:
            status_str = status.value if hasattr(status, "value") else str(status)
            campaign.status = status_str
            self.update(campaign)
        return campaign

    def increment_stats(
        self,
        campaign_id: str,
        sent: int = 0,
        delivered: int = 0,
        failed: int = 0,
        opt_out: int = 0
    ) -> Optional[Campaign]:
        campaign = self.get_by_id(campaign_id)
        if campaign:
            campaign.sent_count += sent
            campaign.delivered_count += delivered
            campaign.failed_count += failed
            campaign.opt_out_count += opt_out
            self.update(campaign)
        return campaign

import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.models.campaign import Campaign, CampaignStatus, AudienceFilter
from database.repositories.campaign_repository import CampaignRepository
from database.repositories.template_repository import TemplateRepository
from scheduler import get_scheduler
from workflows.marketing.campaign_workflows import CampaignWorkflow

logger = logging.getLogger(__name__)


class CampaignService:
    """Service managing marketing campaigns, audience targeting, and scheduling."""

    def __init__(self, db: Session):
        self.db = db
        self.campaign_repo = CampaignRepository(db)
        self.template_repo = TemplateRepository(db)
        self.scheduler = get_scheduler()

    def create_campaign(
        self,
        cafe_id: str,
        name: str,
        template_id: str,
        audience_filter: str = "ALL",
        audience_criteria: Optional[Dict[str, Any]] = None,
        scheduled_time: Optional[datetime] = None
    ) -> Campaign:
        cafe_id = cafe_id or settings.DEFAULT_CAFE_ID
        template = self.template_repo.get_by_id(template_id)
        if not template:
            template = self.template_repo.get_by_name(cafe_id, template_id)

        template_name = template.name if template else template_id
        actual_template_id = template.id if template else template_id

        initial_status = CampaignStatus.SCHEDULED.value if scheduled_time else CampaignStatus.DRAFT.value

        campaign = Campaign(
            cafe_id=cafe_id,
            name=name.strip(),
            template_id=actual_template_id,
            template_name=template_name,
            audience_filter=audience_filter.upper(),
            status=initial_status,
            scheduled_time=scheduled_time
        )
        if audience_criteria:
            campaign.set_criteria(audience_criteria)

        self.campaign_repo.add(campaign)

        # If scheduled time is provided, schedule a background job
        if scheduled_time:
            self.scheduler.schedule_job(
                cafe_id=cafe_id,
                job_type="run_campaign",
                run_at=scheduled_time,
                payload={"campaign_id": campaign.id, "cafe_id": cafe_id},
                target_id=campaign.id
            )

        return campaign

    def get_campaign(self, campaign_id: str) -> Optional[Campaign]:
        return self.campaign_repo.get_by_id(campaign_id)

    def list_campaigns(self, cafe_id: str, status: Optional[str] = None, limit: int = 50, offset: int = 0) -> List[Campaign]:
        return self.campaign_repo.list_campaigns(cafe_id, status, limit, offset)

    def update_campaign(
        self,
        campaign_id: str,
        name: Optional[str] = None,
        template_id: Optional[str] = None,
        audience_filter: Optional[str] = None,
        audience_criteria: Optional[Dict[str, Any]] = None,
        scheduled_time: Optional[datetime] = None
    ) -> Optional[Campaign]:
        campaign = self.campaign_repo.get_by_id(campaign_id)
        if not campaign:
            return None

        if name:
            campaign.name = name.strip()
        if template_id:
            campaign.template_id = template_id
            tmpl = self.template_repo.get_by_id(template_id)
            if tmpl:
                campaign.template_name = tmpl.name
        if audience_filter:
            campaign.audience_filter = audience_filter.upper()
        if audience_criteria is not None:
            campaign.set_criteria(audience_criteria)
        if scheduled_time is not None:
            campaign.scheduled_time = scheduled_time
            # Reschedule job
            self.scheduler.cancel_jobs_for_target(campaign.id)
            self.scheduler.schedule_job(
                cafe_id=campaign.cafe_id,
                job_type="run_campaign",
                run_at=scheduled_time,
                payload={"campaign_id": campaign.id, "cafe_id": campaign.cafe_id},
                target_id=campaign.id
            )
            campaign.status = CampaignStatus.SCHEDULED.value

        self.campaign_repo.update(campaign)
        return campaign

    def pause_campaign(self, campaign_id: str) -> Optional[Campaign]:
        campaign = self.campaign_repo.get_by_id(campaign_id)
        if campaign and campaign.status in (CampaignStatus.SCHEDULED.value, CampaignStatus.PROCESSING.value):
            self.scheduler.cancel_jobs_for_target(campaign.id)
            campaign.status = CampaignStatus.PAUSED.value
            self.campaign_repo.update(campaign)
        return campaign

    def cancel_campaign(self, campaign_id: str) -> Optional[Campaign]:
        campaign = self.campaign_repo.get_by_id(campaign_id)
        if campaign:
            self.scheduler.cancel_jobs_for_target(campaign.id)
            campaign.status = CampaignStatus.CANCELLED.value
            self.campaign_repo.update(campaign)
        return campaign

    def execute_now(self, campaign_id: str) -> Dict[str, Any]:
        """Triggers campaign broadcast immediately."""
        workflow = CampaignWorkflow(self.db)
        return workflow.execute_campaign(campaign_id)

    def delete_campaign(self, campaign_id: str) -> bool:
        self.scheduler.cancel_jobs_for_target(campaign_id)
        return self.campaign_repo.delete(campaign_id)

import logging
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.models.campaign import Campaign, CampaignStatus
from database.repositories.campaign_repository import CampaignRepository
from database.repositories.customer_repository import CustomerRepository
from database.repositories.template_repository import TemplateRepository
from database.repositories.opt_out_repository import OptOutRepository
from messaging.sender import MessageSender, OptOutRestrictedError, DoNotContactError
from messaging.templates.renderer import TemplateRenderer
from workflows.events import AutomationEventSchema

logger = logging.getLogger(__name__)


class CampaignWorkflow:
    """
    Manages broadcast marketing campaign execution, audience segmentation,
    and compliance safeguards (opt-outs and rate limits).
    """

    def __init__(self, db: Session):
        self.db = db
        self.campaign_repo = CampaignRepository(db)
        self.customer_repo = CustomerRepository(db)
        self.template_repo = TemplateRepository(db)
        self.opt_out_repo = OptOutRepository(db)
        self.sender = MessageSender(db)

    def handle_campaign_execute_event(self, event: AutomationEventSchema, db: Session) -> Dict[str, Any]:
        """Triggered upon `campaign.execute` event."""
        campaign_id = event.payload.get("campaign_id")
        return self.execute_campaign(campaign_id)

    def execute_campaign(self, campaign_id: str) -> Dict[str, Any]:
        """Runs the campaign broadcast to all eligible target customers."""
        campaign = self.campaign_repo.get_by_id(campaign_id)
        if not campaign:
            logger.error(f"Campaign {campaign_id} not found.")
            return {"error": "Campaign not found"}

        if campaign.status in (CampaignStatus.COMPLETED.value, CampaignStatus.CANCELLED.value):
            logger.warning(f"Campaign {campaign_id} is already in state {campaign.status}. Skipping.")
            return {"status": campaign.status, "message": "Campaign already finished or cancelled"}

        # 1. Update status to PROCESSING
        self.campaign_repo.update_status(campaign_id, CampaignStatus.PROCESSING.value)

        # 2. Retrieve template
        template = self.template_repo.get_by_id(campaign.template_id)
        if not template:
            template = self.template_repo.get_by_name(campaign.cafe_id, campaign.template_name or "")

        if not template:
            err = f"Template not found for campaign {campaign_id}"
            logger.error(err)
            self.campaign_repo.update_status(campaign_id, CampaignStatus.CANCELLED.value)
            return {"error": err}

        # 3. Determine Audience
        criteria = campaign.get_criteria()
        target_customers = self.customer_repo.get_audience_for_filter(
            cafe_id=campaign.cafe_id,
            filter_type=campaign.audience_filter,
            criteria=criteria
        )

        campaign.total_target_count = len(target_customers)
        self.campaign_repo.update(campaign)

        sent_count = 0
        delivered_count = 0
        failed_count = 0
        opt_out_count = 0

        cafe_name = settings.DEFAULT_CAFE_NAME

        for cust in target_customers:
            # Re-verify opt-out safeguards immediately before dispatching
            if cust.is_opted_out or cust.do_not_contact or self.opt_out_repo.is_opted_out(campaign.cafe_id, cust.phone):
                opt_out_count += 1
                continue

            variables = {
                "customer_name": cust.name,
                "cafe_name": cafe_name,
                "promo_code": criteria.get("promo_code", "SPECIAL10"),
                "discount": criteria.get("discount", "15%"),
                **criteria
            }
            rendered = TemplateRenderer.render(template.content, variables)

            try:
                msg = self.sender.send_template_message(
                    cafe_id=campaign.cafe_id,
                    phone_number=cust.phone,
                    template_name=template.name,
                    rendered_content=rendered,
                    variables=variables,
                    template_id=template.id,
                    customer_id=cust.id,
                    category="MARKETING",
                    metadata={"campaign_id": campaign.id, "campaign_name": campaign.name}
                )
                if msg.status in ("SENT", "DELIVERED", "READ"):
                    sent_count += 1
                    if msg.status in ("DELIVERED", "READ"):
                        delivered_count += 1
                else:
                    failed_count += 1
            except (OptOutRestrictedError, DoNotContactError):
                opt_out_count += 1
            except Exception as e:
                logger.error(f"Failed to send campaign message to {cust.phone}: {e}")
                failed_count += 1

        # 4. Finalize campaign stats & status
        campaign.sent_count = sent_count
        campaign.delivered_count = delivered_count
        campaign.failed_count = failed_count
        campaign.opt_out_count = opt_out_count
        campaign.status = CampaignStatus.COMPLETED.value
        campaign.completed_time = datetime.utcnow()
        self.campaign_repo.update(campaign)

        return {
            "campaign_id": campaign.id,
            "status": campaign.status,
            "total_targets": len(target_customers),
            "sent_count": sent_count,
            "delivered_count": delivered_count,
            "failed_count": failed_count,
            "opt_out_count": opt_out_count
        }

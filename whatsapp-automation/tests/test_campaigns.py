from datetime import datetime, timedelta
from services.campaign_service import CampaignService
from database.models.campaign import CampaignStatus
from database.repositories.customer_repository import CustomerRepository
from database.repositories.opt_out_repository import OptOutRepository


def test_campaign_creation_and_scheduling(db_session):
    service = CampaignService(db_session)
    future_time = datetime.utcnow() + timedelta(days=1)

    campaign = service.create_campaign(
        cafe_id="test_cafe_001",
        name="Spring Roast Launch",
        template_id="marketing_weekend_special",
        audience_filter="ALL",
        scheduled_time=future_time
    )
    assert campaign.id is not None
    assert campaign.status == CampaignStatus.SCHEDULED.value

    # Pause
    paused = service.pause_campaign(campaign.id)
    assert paused.status == CampaignStatus.PAUSED.value

    # Cancel
    cancelled = service.cancel_campaign(campaign.id)
    assert cancelled.status == CampaignStatus.CANCELLED.value


def test_campaign_execution_with_safeguards(db_session, mock_provider):
    service = CampaignService(db_session)
    opt_repo = OptOutRepository(db_session)
    cust_repo = CustomerRepository(db_session)

    # Opt out one customer intentionally
    opt_repo.record_opt_out("test_cafe_001", "+15551112233", reason="TEST_STOP")
    cust = cust_repo.get_by_phone("test_cafe_001", "+15551112233")
    cust_repo.update_opt_out(cust.id, True)

    campaign = service.create_campaign(
        cafe_id="test_cafe_001",
        name="VIP Tasting Event",
        template_id="marketing_weekend_special",
        audience_filter="ALL",
        audience_criteria={"promo_code": "TASTE20", "discount": "20%"}
    )

    # Execute
    res = service.execute_now(campaign.id)
    assert res["status"] == CampaignStatus.COMPLETED.value
    assert res["sent_count"] > 0
    # Customer Alice (+15551112233) should be counted in opt_out_count
    assert res["opt_out_count"] >= 1

    # Verify campaign record in DB
    refreshed = service.get_campaign(campaign.id)
    assert refreshed.status == CampaignStatus.COMPLETED.value
    assert refreshed.sent_count == res["sent_count"]
    assert refreshed.opt_out_count >= 1

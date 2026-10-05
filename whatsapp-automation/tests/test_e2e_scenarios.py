import pytest
from datetime import datetime, timedelta

from backend.config.settings import settings
from workflows.booking.booking_workflows import BookingWorkflow
from workflows.orders.order_workflows import OrderWorkflow
from workflows.events import AutomationEventSchema
from services.campaign_service import CampaignService
from messaging.receiver import MessageReceiver
from messaging.sender import MessageSender, OptOutRestrictedError
from database.repositories.message_repository import MessageRepository
from database.repositories.job_repository import JobRepository
from database.repositories.customer_repository import CustomerRepository
from database.repositories.opt_out_repository import OptOutRepository
from database.models.scheduled_job import JobStatus


def test_complete_realistic_customer_lifecycle_scenario(db_session, mock_provider):
    """
    Validates the end-to-end flow:
    1. Customer books a table.
    2. Confirmation is sent.
    3. Reminder is scheduled.
    4. Customer cancels.
    5. Reminder is cancelled.
    6. Customer places an order.
    7. Order status changes.
    8. Appropriate WhatsApp messages are triggered.
    9. Marketing campaign is scheduled.
    10. Customer replies STOP.
    11. Marketing messages stop for that customer.
    """
    cafe_id = "test_cafe_001"
    customer_phone = "+15559876543"
    customer_name = "Jane Miller"

    booking_workflow = BookingWorkflow(db_session)
    order_workflow = OrderWorkflow(db_session)
    campaign_service = CampaignService(db_session)
    receiver = MessageReceiver(db_session)
    sender = MessageSender(db_session)

    msg_repo = MessageRepository(db_session)
    job_repo = JobRepository(db_session)
    cust_repo = CustomerRepository(db_session)
    opt_repo = OptOutRepository(db_session)

    # ---------------------------------------------------------
    # STEP 1 & 2 & 3: Customer books a table -> Confirmation sent -> Reminder scheduled
    # ---------------------------------------------------------
    booking_id = "bkg_e2e_101"
    booking_event = AutomationEventSchema(
        event_type="booking.created",
        cafe_id=cafe_id,
        payload={
            "booking_id": booking_id,
            "customer_phone": customer_phone,
            "customer_name": customer_name,
            "date": "2026-10-20",
            "time": "19:00",
            "guests": 2,
            "reservation_datetime": (datetime.utcnow() + timedelta(days=3)).isoformat()
        }
    )
    bkg_res = booking_workflow.handle_booking_created(booking_event, db_session)

    # Step 2 verification: confirmation sent
    conf_msg = msg_repo.get_by_id(bkg_res["confirmation_message_id"])
    assert conf_msg is not None
    assert "confirmed" in conf_msg.content.lower()

    # Step 3 verification: reminder scheduled
    scheduled_jobs = job_repo.db.query(job_repo.model).filter(job_repo.model.target_id == booking_id).all()
    assert len(scheduled_jobs) > 0
    assert any(j.status == JobStatus.PENDING.value for j in scheduled_jobs)

    # ---------------------------------------------------------
    # STEP 4 & 5: Customer cancels -> Reminder is cancelled
    # ---------------------------------------------------------
    cancel_event = AutomationEventSchema(
        event_type="booking.cancelled",
        cafe_id=cafe_id,
        payload={
            "booking_id": booking_id,
            "customer_phone": customer_phone,
            "customer_name": customer_name,
            "date": "2026-10-20",
            "time": "19:00"
        }
    )
    cancel_res = booking_workflow.handle_booking_cancelled(cancel_event, db_session)
    assert cancel_res["cancelled_jobs_count"] >= 1

    # Verify reminder job status is now CANCELLED
    for j in scheduled_jobs:
        refreshed_job = job_repo.get_by_id(j.id)
        assert refreshed_job.status == JobStatus.CANCELLED.value

    # ---------------------------------------------------------
    # STEP 6, 7 & 8: Customer places order -> Status changes -> Messages triggered
    # ---------------------------------------------------------
    order_id = "ORD-E2E-77"
    statuses = ["order.created", "order.confirmed", "order.preparing", "order.ready", "order.completed"]

    for st in statuses:
        ev = AutomationEventSchema(
            event_type=st,
            cafe_id=cafe_id,
            payload={
                "order_id": order_id,
                "customer_phone": customer_phone,
                "customer_name": customer_name,
                "total_amount": "32.00"
            }
        )
        res = order_workflow.handle_order_event(ev, db_session)
        assert res["order_id"] == order_id
        assert res["message_id"] is not None

        # Verify message created and sent
        order_msg = msg_repo.get_by_id(res["message_id"])
        assert order_msg is not None
        assert order_id in order_msg.content

    # ---------------------------------------------------------
    # STEP 9: Marketing campaign is created and scheduled
    # ---------------------------------------------------------
    camp = campaign_service.create_campaign(
        cafe_id=cafe_id,
        name="Autumn Harvest Special",
        template_id="marketing_weekend_special",
        audience_filter="ALL",
        audience_criteria={"promo_code": "HARVEST", "discount": "15%"},
        scheduled_time=datetime.utcnow() + timedelta(days=1)
    )
    assert camp.id is not None
    assert camp.status == "SCHEDULED"

    # ---------------------------------------------------------
    # STEP 10: Customer replies STOP
    # ---------------------------------------------------------
    reply_res = receiver.handle_customer_message(
        cafe_id=cafe_id,
        phone_number=customer_phone,
        content="STOP"
    )
    assert reply_res["status"] == "opted_out"
    assert opt_repo.is_opted_out(cafe_id, customer_phone) is True

    # ---------------------------------------------------------
    # STEP 11: Marketing messages stop for that customer
    # ---------------------------------------------------------
    # Attempting to send marketing message directly raises OptOutRestrictedError
    with pytest.raises(OptOutRestrictedError):
        sender.send_text_message(
            cafe_id=cafe_id,
            phone_number=customer_phone,
            content="Get 50% off right now!",
            category="MARKETING"
        )

    # When campaign executes, this customer is bypassed/skipped by safeguard
    camp_run = campaign_service.execute_now(camp.id)
    assert camp_run["opt_out_count"] >= 1

    # But transactional messages (e.g. order update) STILL work!
    tx_msg = sender.send_text_message(
        cafe_id=cafe_id,
        phone_number=customer_phone,
        content="Your coffee order is ready for pickup!",
        category="ORDERS"
    )
    assert tx_msg.status in ("SENT", "DELIVERED", "READ")

from datetime import datetime, timedelta
from workflows.booking.booking_workflows import BookingWorkflow
from workflows.events import AutomationEventSchema
from database.repositories.job_repository import JobRepository
from database.repositories.message_repository import MessageRepository
from database.models.scheduled_job import JobStatus


def test_booking_created_workflow(db_session, mock_provider):
    workflow = BookingWorkflow(db_session)
    booking_dt = (datetime.utcnow() + timedelta(days=2)).isoformat()

    event = AutomationEventSchema(
        event_type="booking.created",
        cafe_id="test_cafe_001",
        payload={
            "booking_id": "bkg_1001",
            "customer_name": "Alice Walker",
            "customer_phone": "+15551112233",
            "date": "2026-10-10",
            "time": "19:00",
            "guests": 4,
            "reservation_datetime": booking_dt
        }
    )

    result = workflow.handle_booking_created(event, db_session)
    assert result["booking_id"] == "bkg_1001"
    assert result["confirmation_message_id"] is not None

    # Verify confirmation message was recorded
    msg_repo = MessageRepository(db_session)
    msg = msg_repo.get_by_id(result["confirmation_message_id"])
    assert msg is not None
    assert "Alice Walker" in msg.content
    assert "bkg_1001" in msg.get_metadata().get("booking_id")

    # Verify reminder job was scheduled
    job_repo = JobRepository(db_session)
    jobs = job_repo.db.query(job_repo.model).filter(job_repo.model.target_id == "bkg_1001").all()
    assert len(jobs) > 0


def test_booking_cancelled_cancels_reminders(db_session, mock_provider):
    workflow = BookingWorkflow(db_session)
    job_repo = JobRepository(db_session)

    # 1. Schedule a reminder job for booking bkg_1002
    job_repo.create_job(
        cafe_id="test_cafe_001",
        job_type="send_reminder",
        run_at=datetime.utcnow() + timedelta(hours=24),
        payload={"booking_id": "bkg_1002"},
        target_id="bkg_1002"
    )

    # 2. Fire cancellation event
    cancel_event = AutomationEventSchema(
        event_type="booking.cancelled",
        cafe_id="test_cafe_001",
        payload={
            "booking_id": "bkg_1002",
            "customer_name": "Alice Walker",
            "customer_phone": "+15551112233",
            "date": "2026-10-10",
            "time": "19:00"
        }
    )
    res = workflow.handle_booking_cancelled(cancel_event, db_session)
    assert res["cancelled_jobs_count"] >= 1

    # Verify reminder is CANCELLED
    jobs = job_repo.db.query(job_repo.model).filter(job_repo.model.target_id == "bkg_1002").all()
    for j in jobs:
        assert j.status == JobStatus.CANCELLED.value


def test_booking_updated_workflow(db_session, mock_provider):
    workflow = BookingWorkflow(db_session)
    event = AutomationEventSchema(
        event_type="booking.updated",
        cafe_id="test_cafe_001",
        payload={
            "booking_id": "bkg_1003",
            "customer_name": "Alice Walker",
            "customer_phone": "+15551112233",
            "date": "2026-10-12",
            "time": "20:00",
            "guests": 6
        }
    )
    result = workflow.handle_booking_updated(event, db_session)
    assert result["booking_id"] == "bkg_1003"
    assert result["message_id"] is not None


def test_booking_noshow_workflow(db_session, mock_provider):
    workflow = BookingWorkflow(db_session)
    event = AutomationEventSchema(
        event_type="booking.no_show",
        cafe_id="test_cafe_001",
        payload={
            "booking_id": "bkg_1004",
            "customer_name": "Alice Walker",
            "customer_phone": "+15551112233"
        }
    )
    result = workflow.handle_booking_noshow(event, db_session)
    assert result["message_id"] is not None

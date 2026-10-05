from datetime import datetime, timedelta
from scheduler import get_scheduler
from database.repositories.job_repository import JobRepository
from database.models.scheduled_job import JobStatus


def test_schedule_and_run_pending_job(db_session, mock_provider):
    scheduler = get_scheduler()
    repo = JobRepository(db_session)

    # Schedule a job with a past run_at to test execution
    past_time = datetime.utcnow() - timedelta(minutes=1)
    job = repo.create_job(
        cafe_id="test_cafe_001",
        job_type="send_message",
        run_at=past_time,
        payload={"message_id": "non_existent_msg_id"},
        target_id="target_123"
    )
    assert job.status == JobStatus.PENDING.value

    # Process pending
    processed = scheduler.run_pending(db=db_session)
    assert processed >= 1

    db_session.expire_all()
    updated_job = repo.get_by_id(job.id)
    assert updated_job.status in (JobStatus.COMPLETED.value, JobStatus.FAILED.value)


def test_cancel_jobs_by_target(db_session):
    scheduler = get_scheduler()
    repo = JobRepository(db_session)
    target_id = "booking_cancel_test"
    future_time = datetime.utcnow() + timedelta(hours=5)

    repo.create_job(
        cafe_id="test_cafe_001",
        job_type="send_reminder",
        run_at=future_time,
        payload={"test": 1},
        target_id=target_id
    )
    repo.create_job(
        cafe_id="test_cafe_001",
        job_type="send_reminder",
        run_at=future_time,
        payload={"test": 2},
        target_id=target_id
    )

    count = scheduler.cancel_jobs_for_target(target_id, db=db_session)
    assert count == 2

    db_session.expire_all()

    pending = repo.get_pending_jobs(before_time=future_time + timedelta(hours=1))
    target_pending = [j for j in pending if j.target_id == target_id]
    assert len(target_pending) == 0

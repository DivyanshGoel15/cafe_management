from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from database.models.scheduled_job import ScheduledJob, JobStatus
from database.repositories.base import BaseRepository


class JobRepository(BaseRepository[ScheduledJob]):
    def __init__(self, db: Session):
        super().__init__(db, ScheduledJob)

    def create_job(
        self,
        cafe_id: str,
        job_type: str,
        run_at: datetime,
        payload: dict,
        target_id: Optional[str] = None
    ) -> ScheduledJob:
        job = ScheduledJob(
            cafe_id=cafe_id,
            job_type=job_type,
            run_at=run_at,
            target_id=target_id,
            status=JobStatus.PENDING.value
        )
        job.set_payload(payload)
        return self.add(job)

    def get_pending_jobs(self, before_time: Optional[datetime] = None, limit: int = 50) -> List[ScheduledJob]:
        cutoff = before_time or datetime.utcnow()
        return self.db.query(ScheduledJob).filter(
            ScheduledJob.status == JobStatus.PENDING.value,
            ScheduledJob.run_at <= cutoff
        ).order_by(ScheduledJob.run_at.asc()).limit(limit).all()

    def cancel_jobs_by_target(self, target_id: str) -> int:
        jobs = self.db.query(ScheduledJob).filter(
            ScheduledJob.target_id == target_id,
            ScheduledJob.status == JobStatus.PENDING.value
        ).all()
        for job in jobs:
            job.status = JobStatus.CANCELLED.value
        self.db.commit()
        return len(jobs)

    def update_status(self, job_id: str, status: JobStatus | str, error: Optional[str] = None) -> Optional[ScheduledJob]:
        job = self.get_by_id(job_id)
        if job:
            status_str = status.value if hasattr(status, "value") else str(status)
            job.status = status_str
            if error:
                job.last_error = error
            self.update(job)
        return job

    def increment_retry(self, job_id: str, error: Optional[str] = None) -> Optional[ScheduledJob]:
        job = self.get_by_id(job_id)
        if job:
            job.retry_count += 1
            job.last_error = error
            if job.retry_count >= job.max_retries:
                job.status = JobStatus.FAILED.value
            else:
                job.status = JobStatus.PENDING.value
            self.update(job)
        return job

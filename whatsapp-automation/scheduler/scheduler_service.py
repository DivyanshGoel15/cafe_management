import time
import threading
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session

from database.session import SessionLocal, get_db_context
from database.models.scheduled_job import ScheduledJob, JobStatus
from database.repositories.job_repository import JobRepository
from scheduler.job_handlers import JOB_HANDLERS

logger = logging.getLogger(__name__)


class SchedulerService:
    """
    Lightweight, production-ready in-process scheduler service.
    Persists jobs to the database and processes pending jobs either in a background daemon thread
    or synchronously on-demand via `run_pending()` (ideal for testing and deterministic execution).
    """

    def __init__(self):
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._lock = threading.Lock()
        self._interval = 1.0  # seconds between poll ticks

    def schedule_job(
        self,
        cafe_id: str,
        job_type: str,
        run_at: datetime,
        payload: Dict[str, Any],
        target_id: Optional[str] = None,
        db: Optional[Session] = None
    ) -> ScheduledJob:
        """Schedules a new job to run at `run_at`."""
        if db is not None:
            repo = JobRepository(db)
            job = repo.create_job(cafe_id=cafe_id, job_type=job_type, run_at=run_at, payload=payload, target_id=target_id)
            logger.info(f"Scheduled job {job.id} [{job_type}] for target {target_id} at {run_at.isoformat()}")
            return job

        with get_db_context() as db_ctx:
            repo = JobRepository(db_ctx)
            job = repo.create_job(cafe_id=cafe_id, job_type=job_type, run_at=run_at, payload=payload, target_id=target_id)
            logger.info(f"Scheduled job {job.id} [{job_type}] for target {target_id} at {run_at.isoformat()}")
            return job

    def cancel_jobs_for_target(self, target_id: str, db: Optional[Session] = None) -> int:
        """Cancels all pending scheduled jobs associated with a given target ID (e.g. booking ID)."""
        if db is not None:
            repo = JobRepository(db)
            count = repo.cancel_jobs_by_target(target_id)
            logger.info(f"Cancelled {count} pending jobs for target {target_id}")
            return count

        with get_db_context() as db_ctx:
            repo = JobRepository(db_ctx)
            count = repo.cancel_jobs_by_target(target_id)
            logger.info(f"Cancelled {count} pending jobs for target {target_id}")
            return count

    def cancel_job(self, job_id: str, db: Optional[Session] = None) -> bool:
        """Cancels a specific scheduled job by ID."""
        if db is not None:
            repo = JobRepository(db)
            job = repo.get_by_id(job_id)
            if job and job.status == JobStatus.PENDING.value:
                repo.update_status(job_id, JobStatus.CANCELLED.value)
                logger.info(f"Cancelled job {job_id}")
                return True
            return False

        with get_db_context() as db_ctx:
            repo = JobRepository(db_ctx)
            job = repo.get_by_id(job_id)
            if job and job.status == JobStatus.PENDING.value:
                repo.update_status(job_id, JobStatus.CANCELLED.value)
                logger.info(f"Cancelled job {job_id}")
                return True
            return False

    def run_pending(self, before_time: Optional[datetime] = None, db: Optional[Session] = None) -> int:
        """
        Executes all pending jobs whose scheduled time is past.
        Returns the number of jobs processed.
        """
        cutoff = before_time or datetime.utcnow()

        def _execute_with_session(session: Session) -> int:
            repo = JobRepository(session)
            pending_jobs = repo.get_pending_jobs(before_time=cutoff)
            processed_count = 0

            for job in pending_jobs:
                job_id = job.id
                job_type = job.job_type
                payload = job.get_payload()
                target_id = job.target_id

                repo.update_status(job_id, JobStatus.PROCESSING.value)
                handler = JOB_HANDLERS.get(job_type)
                if not handler:
                    err = f"No handler registered for job type '{job_type}'"
                    logger.error(err)
                    repo.update_status(job_id, JobStatus.FAILED.value, error=err)
                    continue

                try:
                    logger.info(f"Executing scheduled job {job_id} ({job_type})")
                    handler(session, payload, target_id)
                    repo.update_status(job_id, JobStatus.COMPLETED.value)
                    processed_count += 1
                except Exception as e:
                    logger.error(f"Error executing job {job_id}: {e}", exc_info=True)
                    repo.increment_retry(job_id, error=str(e))
            return processed_count

        if db is not None:
            return _execute_with_session(db)

        with get_db_context() as db_ctx:
            return _execute_with_session(db_ctx)

    def _worker_loop(self):
        """Background thread worker loop."""
        while self._running:
            try:
                self.run_pending()
            except Exception as e:
                logger.error(f"Error in scheduler worker tick: {e}")
            time.sleep(self._interval)

    def start(self, interval_seconds: float = 1.0):
        """Starts the scheduler background daemon thread."""
        with self._lock:
            if not self._running:
                self._interval = interval_seconds
                self._running = True
                self._thread = threading.Thread(target=self._worker_loop, daemon=True, name="whatsapp-scheduler")
                self._thread.start()
                logger.info("Scheduler service started in background thread.")

    def stop(self):
        """Stops the scheduler worker."""
        with self._lock:
            if self._running:
                self._running = False
                if self._thread and self._thread.is_alive():
                    self._thread.join(timeout=2.0)
                logger.info("Scheduler service stopped.")


_scheduler_instance = None


def get_scheduler() -> SchedulerService:
    """Returns the singleton SchedulerService instance."""
    global _scheduler_instance
    if _scheduler_instance is None:
        _scheduler_instance = SchedulerService()
    return _scheduler_instance

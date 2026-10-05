from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.models.call_entity import CallModel, CallTranscriptModel
from .base import BaseRepository


class CallRepository(BaseRepository[CallModel]):
    def __init__(self, session: Session):
        super().__init__(CallModel, session)

    def get_calls(
        self,
        status: Optional[str] = None,
        direction: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[CallModel]:
        query = self.session.query(CallModel)
        if status:
            query = query.filter(CallModel.status.ilike(status))
        if direction:
            query = query.filter(CallModel.direction.ilike(direction))
        return query.order_by(CallModel.start_time.desc()).offset(offset).limit(limit).all()

    def get_call_with_transcripts(self, call_id: str) -> Optional[CallModel]:
        return self.session.query(CallModel).filter(CallModel.id == call_id).first()

    def add_transcript(self, call_id: str, speaker: str, message: str) -> CallTranscriptModel:
        transcript = CallTranscriptModel(
            call_id=call_id,
            speaker=speaker,
            message=message,
            timestamp=datetime.utcnow(),
        )
        self.session.add(transcript)
        self.session.commit()
        self.session.refresh(transcript)
        return transcript

    def get_transcripts(self, call_id: str) -> List[CallTranscriptModel]:
        return (
            self.session.query(CallTranscriptModel)
            .filter(CallTranscriptModel.call_id == call_id)
            .order_by(CallTranscriptModel.timestamp.asc())
            .all()
        )

    def get_statistics(self) -> Dict[str, Any]:
        total_calls = self.session.query(CallModel).count()
        completed_calls = self.session.query(CallModel).filter(CallModel.status == "Completed").count()
        escalated_calls = self.session.query(CallModel).filter(
            (CallModel.status == "Escalated") | (CallModel.escalation_status.in_(["Requested", "Transferred"]))
        ).count()
        failed_calls = self.session.query(CallModel).filter(CallModel.status == "Failed").count()
        in_progress_calls = self.session.query(CallModel).filter(CallModel.status.in_(["In Progress", "Ringing", "Connected"])).count()

        avg_duration = self.session.query(func.avg(CallModel.duration)).filter(CallModel.status == "Completed").scalar() or 0.0

        bookings_created = self.session.query(CallModel).filter(CallModel.booking_id.isnot(None)).count()

        return {
            "total_calls": total_calls,
            "completed_calls": completed_calls,
            "escalated_calls": escalated_calls,
            "failed_calls": failed_calls,
            "in_progress_calls": in_progress_calls,
            "average_duration_seconds": round(float(avg_duration), 1),
            "bookings_created": bookings_created,
            "escalation_rate_percent": round((escalated_calls / total_calls * 100), 1) if total_calls > 0 else 0.0,
            "completion_rate_percent": round((completed_calls / total_calls * 100), 1) if total_calls > 0 else 0.0,
        }

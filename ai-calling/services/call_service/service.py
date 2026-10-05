import uuid
from datetime import datetime
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from database.repositories.call_repository import CallRepository
from database.repositories.customer_repository import CustomerRepository
from database.models.call_entity import CallModel, CallTranscriptModel
from backend.models.common import CallStatus, CallDirection, Speaker, EscalationStatus


class CallService:
    def __init__(self, session: Session):
        self.session = session
        self.call_repo = CallRepository(session)
        self.customer_repo = CustomerRepository(session)

    def start_call(
        self,
        caller_number: str,
        direction: str = "incoming",
        agent_id: str = "agent-bella-01",
        purpose: str = "General Inquiry / Reservation",
        customer_name: Optional[str] = None,
        call_id: Optional[str] = None,
    ) -> CallModel:
        """Initialize a new phone call record with Ringing/Connected status."""
        c_id = call_id or f"call-{uuid.uuid4().hex[:10]}"

        # Look up or attach customer
        customer = self.customer_repo.get_by_phone(caller_number)
        customer_id = customer.id if customer else None

        new_call = CallModel(
            id=c_id,
            caller_number=caller_number,
            customer_id=customer_id,
            agent_id=agent_id,
            start_time=datetime.utcnow(),
            direction=direction,
            status=CallStatus.CONNECTED.value,
            purpose=purpose,
            outcome="In Progress",
            escalation_status=EscalationStatus.NONE.value,
        )
        return self.call_repo.create(new_call)

    def record_transcript(self, call_id: str, speaker: str, message: str) -> CallTranscriptModel:
        """Save a speaker turn in the structured call transcript."""
        return self.call_repo.add_transcript(call_id=call_id, speaker=speaker, message=message)

    def get_transcripts(self, call_id: str) -> List[CallTranscriptModel]:
        return self.call_repo.get_transcripts(call_id)

    def update_status(self, call_id: str, status: str) -> Optional[CallModel]:
        call = self.call_repo.get_by_id(call_id)
        if call:
            call.status = status
            self.session.commit()
            self.session.refresh(call)
        return call

    def link_booking(self, call_id: str, booking_id: str) -> Optional[CallModel]:
        call = self.call_repo.get_by_id(call_id)
        if call:
            call.booking_id = booking_id
            call.outcome = "Booking Confirmed"
            self.session.commit()
            self.session.refresh(call)
        return call

    def generate_summary(self, transcripts: List[CallTranscriptModel]) -> str:
        """Produce a structured concise summary from call dialogue turns."""
        if not transcripts:
            return "Call completed with no dialogue recorded."

        text_lines = [f"{t.speaker.upper()}: {t.message}" for t in transcripts]
        full_text = " ".join([t.message.lower() for t in transcripts])

        # Heuristic detection for summary
        if "cancel" in full_text:
            return "Customer called regarding booking cancellation."
        elif "modify" in full_text or "change" in full_text:
            return "Customer called to modify an existing reservation."
        elif "confirm" in full_text or "booked" in full_text or "bkg-" in full_text:
            return "Customer inquired and successfully confirmed a table reservation."
        elif "menu" in full_text or "vegetarian" in full_text or "vegan" in full_text:
            return "Customer inquired about menu options and dietary accommodations."
        elif "hour" in full_text or "open" in full_text or "location" in full_text:
            return "Customer inquired about cafe location and operating hours."
        elif "transfer" in full_text or "manager" in full_text:
            return "Customer requested assistance and was transferred to human manager."
        else:
            first_user = next((t.message for t in transcripts if t.speaker == "customer"), "General inquiry")
            return f"Inquiry about: {first_user[:80]}"

    def end_call(
        self,
        call_id: str,
        outcome: Optional[str] = None,
        booking_id: Optional[str] = None,
        summary: Optional[str] = None,
        status: str = "Completed",
    ) -> Optional[CallModel]:
        """Finalize call, calculate duration, and generate summary."""
        call = self.call_repo.get_by_id(call_id)
        if not call:
            return None

        end_time = datetime.utcnow()
        call.end_time = end_time
        if call.start_time:
            delta = (end_time - call.start_time).total_seconds()
            call.duration = max(0, int(delta))

        call.status = status

        if booking_id:
            call.booking_id = booking_id

        if outcome:
            call.outcome = outcome
        elif not call.outcome or call.outcome == "In Progress":
            call.outcome = "Resolved"

        # Generate summary if not provided
        transcripts = self.get_transcripts(call_id)
        call.ai_summary = summary or self.generate_summary(transcripts)

        self.session.commit()
        self.session.refresh(call)
        return call

    def get_call(self, call_id: str) -> Optional[CallModel]:
        return self.call_repo.get_by_id(call_id)

    def get_calls(self, status: Optional[str] = None, direction: Optional[str] = None, limit: int = 50, offset: int = 0) -> List[CallModel]:
        return self.call_repo.get_calls(status=status, direction=direction, limit=limit, offset=offset)

    def get_statistics(self) -> Dict[str, Any]:
        return self.call_repo.get_statistics()

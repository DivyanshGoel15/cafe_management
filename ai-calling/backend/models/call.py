from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from .common import CallStatus, CallDirection, Speaker, EscalationStatus


class TranscriptEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    speaker: Speaker
    message: str
    timestamp: datetime


class CallResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    caller_number: str
    customer_id: Optional[str] = None
    agent_id: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    duration: int
    direction: CallDirection
    status: CallStatus
    purpose: str
    outcome: str
    booking_id: Optional[str] = None
    ai_summary: Optional[str] = None
    escalation_status: EscalationStatus
    created_at: datetime


class CallWithTranscriptResponse(CallResponse):
    transcripts: List[TranscriptEntry] = []


class CallListResponse(BaseModel):
    total: int
    calls: List[CallResponse]


class CallTranscriptResponse(BaseModel):
    call_id: str
    transcripts: List[TranscriptEntry]
    summary: Optional[str] = None


class CallStatisticsResponse(BaseModel):
    total_calls: int
    completed_calls: int
    escalated_calls: int
    failed_calls: int
    in_progress_calls: int
    average_duration_seconds: float
    bookings_created: int
    escalation_rate_percent: float
    completion_rate_percent: float


class OutboundCallRequest(BaseModel):
    phone_number: str = Field(..., json_schema_extra={"example": "+15559876543"})
    agent_id: Optional[str] = Field("agent-bella-01", json_schema_extra={"example": "agent-bella-01"})
    purpose: Optional[str] = Field("Reservation Confirmation", json_schema_extra={"example": "Reservation Confirmation"})
    customer_name: Optional[str] = Field(None, json_schema_extra={"example": "David Miller"})
    initial_prompt: Optional[str] = None


class OutboundCallResponse(BaseModel):
    call_id: str
    phone_number: str
    status: CallStatus
    message: str


# Webhook Payloads
class TelephonyWebhookPayload(BaseModel):
    call_sid: str = Field(..., description="Provider call identifier (e.g. Twilio CallSid or MockCallId)")
    from_number: str = Field(..., description="Customer caller number")
    to_number: str = Field(..., description="Cafe receiving number")
    direction: Optional[str] = "incoming"
    extra_data: Optional[Dict[str, Any]] = None


class CallStatusWebhookPayload(BaseModel):
    call_sid: str
    call_status: str
    duration: Optional[int] = 0
    sequence_number: Optional[int] = None


class AudioWebhookPayload(BaseModel):
    call_id: str
    audio_base64: Optional[str] = None
    audio_format: Optional[str] = "wav"
    customer_text: Optional[str] = None

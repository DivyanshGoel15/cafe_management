from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models.call_entity import CallModel
from services.call_service import CallService
from voice.gateway import VoiceGateway
from backend.models.call import (
    CallResponse,
    CallWithTranscriptResponse,
    CallListResponse,
    CallTranscriptResponse,
    CallStatisticsResponse,
    OutboundCallRequest,
    OutboundCallResponse,
    TranscriptEntry,
)
from backend.services.logging_service import StructuredLogger

router = APIRouter(tags=["Calls"])
voice_gateway = VoiceGateway()


@router.get("/calls", response_model=CallListResponse)
def list_calls(
    status: Optional[str] = Query(None, description="Filter by status (Ringing, Connected, In Progress, Completed, Failed, Escalated)"),
    direction: Optional[str] = Query(None, description="Filter by direction (incoming, outgoing)"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Retrieve call history with optional status/direction filtering and pagination."""
    call_service = CallService(db)
    calls = call_service.get_calls(status=status, direction=direction, limit=limit, offset=offset)
    total = len(calls)
    return CallListResponse(
        total=total,
        calls=[CallResponse.model_validate(c) for c in calls],
    )


@router.get("/calls/{call_id}", response_model=CallWithTranscriptResponse)
def get_call_by_id(call_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed information and full transcript history for a specific call."""
    call_service = CallService(db)
    call = call_service.get_call(call_id)
    if not call:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Call '{call_id}' not found.")

    transcripts = call_service.get_transcripts(call_id)
    return CallWithTranscriptResponse(
        id=call.id,
        caller_number=call.caller_number,
        customer_id=call.customer_id,
        agent_id=call.agent_id,
        start_time=call.start_time,
        end_time=call.end_time,
        duration=call.duration,
        direction=call.direction,
        status=call.status,
        purpose=call.purpose,
        outcome=call.outcome,
        booking_id=call.booking_id,
        ai_summary=call.ai_summary,
        escalation_status=call.escalation_status,
        created_at=call.created_at,
        transcripts=[TranscriptEntry.model_validate(t) for t in transcripts],
    )


@router.get("/call-transcripts/{call_id}", response_model=CallTranscriptResponse)
def get_call_transcripts(call_id: str, db: Session = Depends(get_db)):
    """Retrieve structured turn-by-turn dialogue transcript and AI summary for a call."""
    call_service = CallService(db)
    call = call_service.get_call(call_id)
    if not call:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Call '{call_id}' not found.")

    transcripts = call_service.get_transcripts(call_id)
    return CallTranscriptResponse(
        call_id=call.id,
        transcripts=[TranscriptEntry.model_validate(t) for t in transcripts],
        summary=call.ai_summary,
    )


@router.get("/call-statistics", response_model=CallStatisticsResponse)
def get_call_statistics(db: Session = Depends(get_db)):
    """Compute aggregate call performance metrics and booking conversion rates."""
    call_service = CallService(db)
    stats = call_service.get_statistics()
    return CallStatisticsResponse(**stats)


@router.post("/calls/outbound", response_model=OutboundCallResponse, status_code=status.HTTP_201_CREATED)
def trigger_outbound_call(payload: OutboundCallRequest, db: Session = Depends(get_db)):
    """
    Trigger an outbound call using the configured TelephonyProvider.
    Initializes AI agent conversation and dials destination phone number.
    """
    StructuredLogger.log_event(
        event_type="OUTGOING_CALL",
        message=f"Initiating outbound call to {payload.phone_number}",
        data={"phone": payload.phone_number, "agent_id": payload.agent_id, "purpose": payload.purpose},
    )

    result = voice_gateway.initiate_outbound_call(
        phone_number=payload.phone_number,
        agent_id=payload.agent_id or "agent-bella-01",
        purpose=payload.purpose or "Reservation Notification",
        customer_name=payload.customer_name,
        initial_prompt=payload.initial_prompt,
        session=db,
    )

    return OutboundCallResponse(
        call_id=result["call_id"],
        phone_number=result["phone_number"],
        status=result["status"],
        message=f"Outbound call initiated successfully. Call ID: {result['call_id']}.",
    )

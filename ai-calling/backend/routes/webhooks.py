from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session
from database.connection import get_db
from voice.gateway import VoiceGateway
from services.call_service import CallService
from voice.audio import AudioProcessor
from backend.models.call import (
    TelephonyWebhookPayload,
    CallStatusWebhookPayload,
    AudioWebhookPayload,
)
from backend.services.logging_service import StructuredLogger

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])
voice_gateway = VoiceGateway()


@router.post("/telephony")
async def telephony_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook called by Telephony provider (Twilio or simulated carrier) on incoming customer call.
    Returns TwiML / response instructions for the provider.
    """
    # Parse form data (Twilio sends application/x-www-form-urlencoded) or JSON
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        body = await request.json()
        call_sid = body.get("call_sid") or body.get("CallSid") or "mock-call-sid"
        from_number = body.get("from_number") or body.get("From") or "+15551234567"
        to_number = body.get("to_number") or body.get("To") or "+15550001111"
    else:
        form = await request.form()
        call_sid = form.get("CallSid") or "mock-call-sid"
        from_number = form.get("From") or "+15551234567"
        to_number = form.get("To") or "+15550001111"

    StructuredLogger.log_event(
        event_type="INCOMING_CALL",
        message=f"Incoming call webhook received for Call SID {call_sid} from {from_number}",
        call_id=call_sid,
        data={"from": from_number, "to": to_number},
    )

    result = voice_gateway.handle_incoming_call(
        call_sid=call_sid,
        from_number=from_number,
        to_number=to_number,
        session=db,
    )

    # Return standard TwiML XML if Twilio requested it, or JSON
    if "xml" in request.headers.get("accept", "").lower() or "application/x-www-form-urlencoded" in content_type:
        return Response(content=result["twiml"], media_type="application/xml")

    return {
        "status": "connected",
        "call_id": result["call_id"],
        "greeting": result["greeting"],
        "twiml": result["twiml"],
    }


@router.post("/call-status")
async def call_status_webhook(payload: CallStatusWebhookPayload, db: Session = Depends(get_db)):
    """Webhook notifying of call status changes (e.g., connected, completed, busy, failed)."""
    call_service = CallService(db)

    # Map provider statuses
    status_map = {
        "ringing": "Ringing",
        "in-progress": "In Progress",
        "completed": "Completed",
        "failed": "Failed",
        "busy": "Failed",
        "no-answer": "Failed",
        "canceled": "Failed",
    }
    app_status = status_map.get(payload.call_status.lower(), payload.call_status)

    StructuredLogger.log_event(
        event_type="CALL_COMPLETION" if app_status in ("Completed", "Failed") else "CALL_STATUS_UPDATE",
        message=f"Call status updated for {payload.call_sid} -> {app_status}",
        call_id=payload.call_sid,
        data={"status": app_status, "duration": payload.duration},
    )

    if app_status in ("Completed", "Failed"):
        call_service.end_call(call_id=payload.call_sid, status=app_status)
    else:
        call_service.update_status(call_id=payload.call_sid, status=app_status)

    return {"status": "received", "call_sid": payload.call_sid, "updated_status": app_status}


@router.post("/audio")
def audio_stream_webhook(payload: AudioWebhookPayload, db: Session = Depends(get_db)):
    """
    Webhook receiving audio chunks or customer speech input.
    Executes STT -> Agent -> TTS and returns audio and AI transcript.
    """
    audio_bytes = None
    if payload.audio_base64:
        try:
            audio_bytes = AudioProcessor.decode_base64_audio(payload.audio_base64)
        except Exception:
            pass

    result = voice_gateway.process_call_turn(
        call_id=payload.call_id,
        audio_bytes=audio_bytes,
        audio_format=payload.audio_format or "wav",
        direct_text=payload.customer_text,
        session=db,
    )

    StructuredLogger.log_event(
        event_type="AI_REQUEST",
        message=f"Turn processed for {payload.call_id}",
        call_id=payload.call_id,
        data={
            "customer_text": result["customer_text"],
            "ai_response": result["ai_response"],
            "escalated": result["escalated"],
        },
    )

    return {
        "status": "success",
        "call_id": result["call_id"],
        "customer_text": result["customer_text"],
        "ai_response": result["ai_response"],
        "escalated": result["escalated"],
        "escalation_reason": result["escalation_reason"],
        "booking_id": result["booking_id"],
        "tool_executions": result["tool_executions"],
    }

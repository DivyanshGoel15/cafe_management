import uuid
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.connection import get_db
from voice.gateway import VoiceGateway
from services.call_service import CallService
from services.booking_service import BookingService

router = APIRouter(prefix="/simulation", tags=["Simulation & Demo"])
voice_gateway = VoiceGateway()


class StartSimulatedCallRequest(BaseModel):
    caller_number: Optional[str] = "+15551234567"
    direction: Optional[str] = "incoming"  # incoming | outgoing
    agent_id: Optional[str] = "agent-bella-01"
    purpose: Optional[str] = "Table Reservation"
    customer_name: Optional[str] = "Sarah Connor"


class SimulatedTurnRequest(BaseModel):
    call_id: str
    customer_message: str


class EndSimulatedCallRequest(BaseModel):
    call_id: str
    outcome: Optional[str] = None


@router.post("/call/start")
def start_simulated_call(payload: StartSimulatedCallRequest, db: Session = Depends(get_db)):
    """Initialize a simulated voice call session for local development demonstration."""
    call_id = f"sim-{uuid.uuid4().hex[:8]}"

    if payload.direction == "outgoing":
        res = voice_gateway.initiate_outbound_call(
            phone_number=payload.caller_number,
            agent_id=payload.agent_id or "agent-bella-01",
            purpose=payload.purpose or "Reservation Notification",
            customer_name=payload.customer_name,
            initial_prompt=None,
            session=db,
        )
        return {
            "call_id": res["call_id"],
            "status": "Connected",
            "direction": "outgoing",
            "greeting": res["greeting"],
        }
    else:
        res = voice_gateway.handle_incoming_call(
            call_sid=call_id,
            from_number=payload.caller_number,
            to_number="+15550001111",
            session=db,
        )
        return {
            "call_id": res["call_id"],
            "status": "Connected",
            "direction": "incoming",
            "greeting": res["greeting"],
        }


@router.post("/call/step")
def simulated_call_turn(payload: SimulatedTurnRequest, db: Session = Depends(get_db)):
    """
    Send a customer statement/speech turn into the live voice agent.
    Runs STT -> Agent (with Tools) -> TTS.
    """
    turn_res = voice_gateway.process_call_turn(
        call_id=payload.call_id,
        direct_text=payload.customer_message,
        session=db,
    )
    return turn_res


@router.post("/call/end")
def end_simulated_call(payload: EndSimulatedCallRequest, db: Session = Depends(get_db)):
    """Conclude the simulated call session, calculate call duration, and generate summary."""
    call_service = CallService(db)
    call = call_service.end_call(call_id=payload.call_id, outcome=payload.outcome)
    voice_gateway.end_call(payload.call_id, session=db)
    if not call:
        raise HTTPException(status_code=404, detail="Call session not found.")
    return {
        "call_id": call.id,
        "status": call.status,
        "duration_seconds": call.duration,
        "outcome": call.outcome,
        "ai_summary": call.ai_summary,
        "booking_id": call.booking_id,
    }


@router.post("/scenarios/{scenario_name}")
def run_prebuilt_scenario(scenario_name: str, db: Session = Depends(get_db)):
    """
    Run an automated end-to-end multi-turn scenario for instant demo testing.
    Scenarios: 'booking', 'cancellation', 'faq', 'escalation'
    """
    call_id = f"demo-scen-{uuid.uuid4().hex[:6]}"
    res_start = voice_gateway.handle_incoming_call(
        call_sid=call_id,
        from_number="+15559876543",
        to_number="+15550001111",
        session=db,
    )

    steps = []
    if scenario_name == "booking":
        turns = [
            "Hi, I want to book a table for tomorrow evening.",
            "7 PM for 2 people please.",
            "Yes, my name is David Miller and that sounds great.",
        ]
    elif scenario_name == "cancellation":
        turns = [
            "I need to cancel my reservation BKG-9901.",
            "Yes, please cancel it.",
        ]
    elif scenario_name == "faq":
        turns = [
            "What are your opening hours on Friday?",
            "Do you have vegetarian pasta options?",
            "Where can I park?",
        ]
    elif scenario_name == "escalation":
        turns = [
            "I want to speak with a human manager right now.",
        ]
    else:
        raise HTTPException(status_code=400, detail=f"Unknown scenario '{scenario_name}'. Use 'booking', 'cancellation', 'faq', or 'escalation'.")

    for user_msg in turns:
        step_result = voice_gateway.process_call_turn(
            call_id=call_id,
            direct_text=user_msg,
            session=db,
        )
        steps.append(step_result)

    call_service = CallService(db)
    final_call = call_service.end_call(call_id=call_id)
    voice_gateway.end_call(call_id, session=db)

    return {
        "scenario": scenario_name,
        "call_id": call_id,
        "initial_greeting": res_start["greeting"],
        "turns": steps,
        "final_status": final_call.status if final_call else "Completed",
        "ai_summary": final_call.ai_summary if final_call else "",
        "booking_id": final_call.booking_id if final_call else None,
    }

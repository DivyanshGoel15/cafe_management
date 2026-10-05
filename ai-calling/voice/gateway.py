import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from voice.telephony import TelephonyProvider, get_telephony_provider
from voice.stt import SpeechToTextProvider, get_stt_provider
from voice.tts import TextToSpeechProvider, get_tts_provider
from llm import LLMProvider, get_llm_provider
from agents.cafe_agent import CafeVoiceAgent, AgentTurnResult
from agents.agent_manager import AgentManager
from services.call_service import CallService
from database.connection import get_db_context

logger = logging.getLogger("voice_gateway")


class VoiceGateway:
    """
    Central Voice Gateway orchestrating the pipeline:
    Phone Call -> Telephony Provider -> Voice Gateway -> STT -> AI Agent / Tools -> TTS -> Telephony Provider -> Customer
    """

    def __init__(
        self,
        telephony_provider: Optional[TelephonyProvider] = None,
        stt_provider: Optional[SpeechToTextProvider] = None,
        tts_provider: Optional[TextToSpeechProvider] = None,
        llm_provider: Optional[LLMProvider] = None,
    ):
        self.telephony = telephony_provider or get_telephony_provider()
        self.stt = stt_provider or get_stt_provider()
        self.tts = tts_provider or get_tts_provider()
        self.llm = llm_provider or get_llm_provider()

        # Cache of active in-flight agents keyed by call_id
        self.active_agents: Dict[str, CafeVoiceAgent] = {}

    def handle_incoming_call(
        self,
        call_sid: str,
        from_number: str,
        to_number: str,
        session: Session,
    ) -> Dict[str, Any]:
        """
        Handle telephony webhook for an incoming customer call.
        Registers call record, loads agent, and outputs initial greeting audio/TwiML.
        """
        call_service = CallService(session)
        agent_manager = AgentManager(session)
        default_agent = agent_manager.get_default_agent()

        call = call_service.start_call(
            call_id=call_sid,
            caller_number=from_number,
            direction="incoming",
            agent_id=default_agent.id,
            purpose="Inbound Reservation & Inquiries",
        )

        # Instantiate CafeVoiceAgent
        agent = CafeVoiceAgent(
            session=session,
            call_id=call_sid,
            llm_provider=self.llm,
            custom_system_prompt=default_agent.system_prompt,
        )
        self.active_agents[call_sid] = agent

        initial_greeting = f"Hello! Welcome to {default_agent.cafe_name}. My name is {default_agent.name}. How can I assist you with reservations or our menu today?"

        # Save initial greeting in transcript
        call_service.record_transcript(call_id=call_sid, speaker="ai", message=initial_greeting)

        # Synthesize greeting audio
        audio_bytes = self.tts.synthesize(initial_greeting)
        twiml = self.telephony.generate_twiml_or_response(spoken_text=initial_greeting)

        logger.info(f"[VOICE GATEWAY] Incoming call {call_sid} from {from_number} connected.")

        return {
            "call_id": call_sid,
            "status": "Connected",
            "greeting": initial_greeting,
            "twiml": twiml,
            "audio_size": len(audio_bytes),
        }

    def process_call_turn(
        self,
        call_id: str,
        audio_bytes: Optional[bytes] = None,
        audio_format: str = "wav",
        direct_text: Optional[str] = None,
        session: Optional[Session] = None,
    ) -> Dict[str, Any]:
        """
        Process an interactive dialogue turn:
        STT -> Agent -> Tools -> TTS -> Call record update
        """
        if session:
            return self._execute_turn(call_id, audio_bytes, audio_format, direct_text, session)
        else:
            with get_db_context() as s:
                return self._execute_turn(call_id, audio_bytes, audio_format, direct_text, s)

    def _execute_turn(
        self,
        call_id: str,
        audio_bytes: Optional[bytes],
        audio_format: str,
        direct_text: Optional[str],
        session: Session,
    ) -> Dict[str, Any]:
        call_service = CallService(session)
        call = call_service.get_call(call_id)
        if not call:
            call = call_service.start_call(caller_number="+15551234567", call_id=call_id)

        # 1. Speech-to-Text
        if direct_text:
            customer_text = direct_text
        elif audio_bytes:
            customer_text = self.stt.transcribe(audio_bytes, audio_format=audio_format)
        else:
            customer_text = "Hello, what are your opening hours?"

        # Record Customer transcript
        call_service.record_transcript(call_id=call_id, speaker="customer", message=customer_text)

        # 2. Get or initialize Agent
        agent = self.active_agents.get(call_id)
        if not agent:
            agent_manager = AgentManager(session)
            default_agent = agent_manager.get_default_agent()
            agent = CafeVoiceAgent(
                session=session,
                call_id=call_id,
                llm_provider=self.llm,
                custom_system_prompt=default_agent.system_prompt if default_agent else None,
            )
            self.active_agents[call_id] = agent

        # 3. AI Agent Turn (Evaluates text, executes tools)
        turn_result: AgentTurnResult = agent.process_utterance(customer_text)

        # Record AI transcript
        call_service.record_transcript(call_id=call_id, speaker="ai", message=turn_result.spoken_response)

        # 4. Handle Booking or Escalation state
        if turn_result.booking_id:
            call_service.link_booking(call_id, turn_result.booking_id)

        if turn_result.escalated:
            call_service.update_status(call_id, "Escalated")
            call.escalation_status = "Transferred"
            call.outcome = f"Escalated ({turn_result.escalation_reason})"
            session.commit()

        # 5. Text-to-Speech
        response_audio = self.tts.synthesize(turn_result.spoken_response)

        # Transmit audio via telephony provider
        self.telephony.send_audio(call_id, response_audio)

        return {
            "call_id": call_id,
            "customer_text": customer_text,
            "ai_response": turn_result.spoken_response,
            "escalated": turn_result.escalated,
            "escalation_reason": turn_result.escalation_reason,
            "booking_id": turn_result.booking_id,
            "tool_executions": turn_result.tool_executions,
            "audio_bytes_length": len(response_audio),
        }

    def initiate_outbound_call(
        self,
        phone_number: str,
        agent_id: str,
        purpose: str,
        customer_name: Optional[str],
        initial_prompt: Optional[str],
        session: Session,
    ) -> Dict[str, Any]:
        """Initiate an outbound call via Telephony provider and initialize agent session."""
        call_info = self.telephony.make_call(
            phone_number=phone_number,
            agent_id=agent_id,
            purpose=purpose,
        )

        call_service = CallService(session)
        call = call_service.start_call(
            call_id=call_info.call_sid,
            caller_number=phone_number,
            direction="outgoing",
            agent_id=agent_id,
            purpose=purpose,
            customer_name=customer_name,
        )

        agent_manager = AgentManager(session)
        agent_record = agent_manager.get_agent_by_id(agent_id) or agent_manager.get_default_agent()

        agent = CafeVoiceAgent(
            session=session,
            call_id=call_info.call_sid,
            llm_provider=self.llm,
            custom_system_prompt=agent_record.system_prompt if agent_record else None,
        )
        self.active_agents[call_info.call_sid] = agent

        greeting = (
            initial_prompt
            or f"Hello {customer_name or 'there'}! This is {agent_record.name} calling from {agent_record.cafe_name} regarding your {purpose.lower()}."
        )

        call_service.record_transcript(call_id=call_info.call_sid, speaker="ai", message=greeting)
        self.tts.synthesize(greeting)

        return {
            "call_id": call_info.call_sid,
            "phone_number": phone_number,
            "status": "Connected",
            "greeting": greeting,
        }

    def end_call(self, call_id: str, outcome: Optional[str] = None, session: Optional[Session] = None) -> None:
        """Hang up active call and cleanup agent session."""
        self.telephony.hangup_call(call_id)
        if call_id in self.active_agents:
            del self.active_agents[call_id]

        if session:
            call_service = CallService(session)
            call_service.end_call(call_id, outcome=outcome)
        else:
            with get_db_context() as s:
                call_service = CallService(s)
                call_service.end_call(call_id, outcome=outcome)

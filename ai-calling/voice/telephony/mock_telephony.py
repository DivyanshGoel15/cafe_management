import uuid
import logging
from typing import Dict, Optional, Any
from .base import TelephonyProvider, TelephonyCallInfo
from backend.config.settings import get_settings

logger = logging.getLogger("mock_telephony")


class MockTelephonyProvider(TelephonyProvider):
    """
    In-memory mock telephony provider for local development and testing.
    Simulates inbound and outbound calls without carrier or paid telephony subscriptions.
    """

    def __init__(self):
        self.settings = get_settings()
        self.active_calls: Dict[str, TelephonyCallInfo] = {}

    def make_call(
        self,
        phone_number: str,
        agent_id: str,
        purpose: str,
        callback_url: Optional[str] = None,
    ) -> TelephonyCallInfo:
        call_sid = f"mock-call-{uuid.uuid4().hex[:10]}"
        call_info = TelephonyCallInfo(
            call_sid=call_sid,
            from_number=self.settings.twilio_phone_number,
            to_number=phone_number,
            direction="outgoing",
            status="Connected",
            metadata={"agent_id": agent_id, "purpose": purpose, "callback_url": callback_url},
        )
        self.active_calls[call_sid] = call_info
        logger.info(
            f"[MOCK TELEPHONY] Outbound call initiated to {phone_number} (Call SID: {call_sid}) | Purpose: {purpose}"
        )
        return call_info

    def answer_call(self, call_sid: str) -> bool:
        if call_sid in self.active_calls:
            self.active_calls[call_sid].status = "Connected"
            logger.info(f"[MOCK TELEPHONY] Call answered: {call_sid}")
            return True
        # If unknown SID, register it as incoming
        self.active_calls[call_sid] = TelephonyCallInfo(
            call_sid=call_sid,
            from_number="+15551234567",
            to_number=self.settings.twilio_phone_number,
            direction="incoming",
            status="Connected",
        )
        return True

    def hangup_call(self, call_sid: str) -> bool:
        if call_sid in self.active_calls:
            self.active_calls[call_sid].status = "Completed"
            logger.info(f"[MOCK TELEPHONY] Call ended: {call_sid}")
            return True
        return False

    def send_audio(self, call_sid: str, audio_bytes: bytes) -> bool:
        logger.info(f"[MOCK TELEPHONY] Transmitted {len(audio_bytes)} audio bytes to Call SID: {call_sid}")
        return True

    def generate_twiml_or_response(
        self,
        spoken_text: Optional[str] = None,
        stream_url: Optional[str] = None,
    ) -> str:
        text = spoken_text or "Hello! Welcome to Bella Vista Bistro."
        return f'<Response><Say voice="Polly.Joanna">{text}</Say></Response>'

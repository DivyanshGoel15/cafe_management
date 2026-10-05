from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class TelephonyCallInfo(BaseModel):
    call_sid: str
    from_number: str
    to_number: str
    direction: str = "incoming"  # incoming | outgoing
    status: str = "Ringing"      # Ringing, Connected, In Progress, Completed, Failed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class TelephonyProvider(ABC):
    """Abstract interface for telephony providers (Mock, Twilio, Vonage, Plivo, Telnyx)."""

    @abstractmethod
    def make_call(
        self,
        phone_number: str,
        agent_id: str,
        purpose: str,
        callback_url: Optional[str] = None,
    ) -> TelephonyCallInfo:
        """Initiate an outbound phone call."""
        pass

    @abstractmethod
    def answer_call(self, call_sid: str) -> bool:
        """Answer an incoming phone call."""
        pass

    @abstractmethod
    def hangup_call(self, call_sid: str) -> bool:
        """Terminate an active call."""
        pass

    @abstractmethod
    def send_audio(self, call_sid: str, audio_bytes: bytes) -> bool:
        """Transmit synthesized audio stream to the customer's phone connection."""
        pass

    @abstractmethod
    def generate_twiml_or_response(
        self,
        spoken_text: Optional[str] = None,
        stream_url: Optional[str] = None,
    ) -> str:
        """Generate provider-specific markup or webhook response (e.g. TwiML)."""
        pass

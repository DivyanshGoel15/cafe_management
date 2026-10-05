import logging
import httpx
from typing import Optional
from .base import TelephonyProvider, TelephonyCallInfo
from .mock_telephony import MockTelephonyProvider
from backend.config.settings import get_settings

logger = logging.getLogger("twilio_telephony")


class TwilioTelephonyProvider(TelephonyProvider):
    """
    Twilio Telephony Provider implementation for production phone calls.
    Generates TwiML markup and triggers outbound calls via Twilio REST API.
    Falls back gracefully to MockTelephonyProvider when credentials are blank.
    """

    def __init__(
        self,
        account_sid: Optional[str] = None,
        auth_token: Optional[str] = None,
        from_number: Optional[str] = None,
    ):
        settings = get_settings()
        self.account_sid = account_sid or settings.twilio_account_sid
        self.auth_token = auth_token or settings.twilio_auth_token
        self.from_number = from_number or settings.twilio_phone_number
        self.fallback = MockTelephonyProvider()

    def make_call(
        self,
        phone_number: str,
        agent_id: str,
        purpose: str,
        callback_url: Optional[str] = None,
    ) -> TelephonyCallInfo:
        if not self.account_sid or not self.auth_token:
            logger.info("Twilio credentials not configured, delegating to MockTelephonyProvider.")
            return self.fallback.make_call(phone_number, agent_id, purpose, callback_url)

        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Calls.json"
        webhook = callback_url or "http://localhost:8000/webhooks/telephony"

        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.post(
                    url,
                    auth=(self.account_sid, self.auth_token),
                    data={
                        "To": phone_number,
                        "From": self.from_number,
                        "Url": webhook,
                    },
                )
                if res.status_code in (200, 201):
                    data = res.json()
                    return TelephonyCallInfo(
                        call_sid=data.get("sid", "twilio-call-sid"),
                        from_number=self.from_number,
                        to_number=phone_number,
                        direction="outgoing",
                        status="Connected",
                        metadata={"agent_id": agent_id, "purpose": purpose, "twilio_raw": data},
                    )
                logger.error(f"Twilio call creation failed with status {res.status_code}: {res.text}")
        except Exception as e:
            logger.error(f"Twilio API error: {e}. Falling back to mock telephony.")

        return self.fallback.make_call(phone_number, agent_id, purpose, callback_url)

    def answer_call(self, call_sid: str) -> bool:
        return True

    def hangup_call(self, call_sid: str) -> bool:
        if not self.account_sid or not self.auth_token:
            return self.fallback.hangup_call(call_sid)

        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Calls/{call_sid}.json"
        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.post(url, auth=(self.account_sid, self.auth_token), data={"Status": "completed"})
                return res.status_code == 200
        except Exception as e:
            logger.error(f"Twilio hangup error: {e}")
            return self.fallback.hangup_call(call_sid)

    def send_audio(self, call_sid: str, audio_bytes: bytes) -> bool:
        return True

    def generate_twiml_or_response(
        self,
        spoken_text: Optional[str] = None,
        stream_url: Optional[str] = None,
    ) -> str:
        text = spoken_text or "Hello, thank you for calling Bella Vista Bistro. How can I assist you today?"
        twiml = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            "<Response>\n"
            f'    <Say voice="Polly.Joanna">{text}</Say>\n'
        )
        if stream_url:
            twiml += f'    <Connect><Stream url="{stream_url}" /></Connect>\n'
        twiml += "</Response>"
        return twiml

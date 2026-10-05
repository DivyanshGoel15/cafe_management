import logging
import httpx
from typing import Dict, Any, Optional
from messaging.providers.base import WhatsAppProvider, ProviderResponse, IncomingMessagePayload

logger = logging.getLogger(__name__)


class CloudAPIWhatsAppProvider(WhatsAppProvider):
    """
    Production WhatsApp Business Cloud API provider using Meta's Graph API.
    Activated when MOCK_MODE=false and credentials are provided in .env.
    """

    BASE_URL = "https://graph.facebook.com/v18.0"

    def __init__(self, phone_number_id: str, access_token: str):
        self.phone_number_id = phone_number_id
        self.access_token = access_token
        self.endpoint = f"{self.BASE_URL}/{self.phone_number_id}/messages"

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

    def send_message(
        self,
        phone_number: str,
        content: str,
        cafe_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ProviderResponse:
        clean_phone = phone_number.replace("+", "").strip()
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": clean_phone,
            "type": "text",
            "text": {"preview_url": False, "body": content}
        }
        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.post(self.endpoint, json=payload, headers=self._headers())
                data = res.json()
                if res.is_success and "messages" in data:
                    provider_msg_id = data["messages"][0]["id"]
                    return ProviderResponse(
                        success=True,
                        provider_message_id=provider_msg_id,
                        status="SENT",
                        raw_response=data
                    )
                else:
                    err_msg = data.get("error", {}).get("message", res.text)
                    return ProviderResponse(
                        success=False,
                        status="FAILED",
                        error_message=err_msg,
                        raw_response=data
                    )
        except Exception as e:
            logger.error(f"Error calling WhatsApp Cloud API: {e}")
            return ProviderResponse(
                success=False,
                status="FAILED",
                error_message=str(e),
                raw_response={"error": str(e)}
            )

    def send_template(
        self,
        phone_number: str,
        template_name: str,
        variables: Dict[str, Any],
        language: str = "en",
        cafe_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ProviderResponse:
        clean_phone = phone_number.replace("+", "").strip()

        # Convert variables dictionary into Meta parameters list
        parameters = [{"type": "text", "text": str(v)} for v in variables.values()]

        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": clean_phone,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": language},
                "components": [
                    {
                        "type": "body",
                        "parameters": parameters
                    }
                ] if parameters else []
            }
        }

        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.post(self.endpoint, json=payload, headers=self._headers())
                data = res.json()
                if res.is_success and "messages" in data:
                    provider_msg_id = data["messages"][0]["id"]
                    return ProviderResponse(
                        success=True,
                        provider_message_id=provider_msg_id,
                        status="SENT",
                        raw_response=data
                    )
                else:
                    err_msg = data.get("error", {}).get("message", res.text)
                    return ProviderResponse(
                        success=False,
                        status="FAILED",
                        error_message=err_msg,
                        raw_response=data
                    )
        except Exception as e:
            logger.error(f"Error sending WhatsApp template: {e}")
            return ProviderResponse(
                success=False,
                status="FAILED",
                error_message=str(e),
                raw_response={"error": str(e)}
            )

    def get_message_status(self, provider_message_id: str) -> str:
        return "UNKNOWN"

    def parse_incoming_webhook(self, raw_payload: Dict[str, Any]) -> Optional[IncomingMessagePayload]:
        entry_list = raw_payload.get("entry", [])
        for entry in entry_list:
            for change in entry.get("changes", []):
                value = change.get("value", {})
                messages = value.get("messages", [])
                for msg in messages:
                    sender = msg.get("from")
                    text_body = ""
                    if msg.get("type") == "text":
                        text_body = msg.get("text", {}).get("body", "")
                    elif msg.get("type") == "button":
                        text_body = msg.get("button", {}).get("text", "")
                    elif msg.get("type") == "interactive":
                        interactive = msg.get("interactive", {})
                        if interactive.get("type") == "button_reply":
                            text_body = interactive.get("button_reply", {}).get("title", "")

                    if sender and text_body:
                        return IncomingMessagePayload(
                            phone_number=sender,
                            message_content=text_body,
                            provider_message_id=msg.get("id", ""),
                            timestamp=str(msg.get("timestamp", "")),
                            raw_payload=raw_payload
                        )
        return None

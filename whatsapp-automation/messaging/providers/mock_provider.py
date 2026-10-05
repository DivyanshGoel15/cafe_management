import uuid
from datetime import datetime
from typing import Dict, Any, Optional, List
from messaging.providers.base import WhatsAppProvider, ProviderResponse, IncomingMessagePayload


class MockWhatsAppProvider(WhatsAppProvider):
    """
    Mock implementation of WhatsAppProvider for offline development and testing.
    Records sent messages in-memory and allows simulating failures, deliveries, and incoming customer replies.
    """

    def __init__(self, auto_deliver: bool = True, auto_read: bool = True):
        self.sent_messages: List[Dict[str, Any]] = []
        self.statuses: Dict[str, str] = {}
        self.auto_deliver = auto_deliver
        self.auto_read = auto_read
        self.force_fail: bool = False
        self.fail_reason: str = "Simulated network failure"

    def set_force_fail(self, fail: bool = True, reason: str = "Simulated network failure"):
        """Enable or disable failure simulation for upcoming calls."""
        self.force_fail = fail
        self.fail_reason = reason

    def clear(self):
        """Reset mock history."""
        self.sent_messages.clear()
        self.statuses.clear()
        self.force_fail = False

    def send_message(
        self,
        phone_number: str,
        content: str,
        cafe_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ProviderResponse:
        provider_id = f"mock_msg_{uuid.uuid4().hex[:12]}"

        if self.force_fail:
            self.statuses[provider_id] = "FAILED"
            return ProviderResponse(
                success=False,
                provider_message_id=provider_id,
                status="FAILED",
                error_message=self.fail_reason,
                raw_response={"simulated": True, "error": self.fail_reason}
            )

        status = "SENT"
        if self.auto_read:
            status = "READ"
        elif self.auto_deliver:
            status = "DELIVERED"

        record = {
            "provider_message_id": provider_id,
            "phone_number": phone_number,
            "content": content,
            "type": "text",
            "cafe_id": cafe_id,
            "metadata": metadata or {},
            "status": status,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.sent_messages.append(record)
        self.statuses[provider_id] = status

        return ProviderResponse(
            success=True,
            provider_message_id=provider_id,
            status=status,
            raw_response={"simulated": True, "record": record}
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
        provider_id = f"mock_tmpl_{uuid.uuid4().hex[:12]}"

        if self.force_fail:
            self.statuses[provider_id] = "FAILED"
            return ProviderResponse(
                success=False,
                provider_message_id=provider_id,
                status="FAILED",
                error_message=self.fail_reason,
                raw_response={"simulated": True, "error": self.fail_reason}
            )

        status = "SENT"
        if self.auto_read:
            status = "READ"
        elif self.auto_deliver:
            status = "DELIVERED"

        record = {
            "provider_message_id": provider_id,
            "phone_number": phone_number,
            "template_name": template_name,
            "variables": variables,
            "language": language,
            "type": "template",
            "cafe_id": cafe_id,
            "metadata": metadata or {},
            "status": status,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.sent_messages.append(record)
        self.statuses[provider_id] = status

        return ProviderResponse(
            success=True,
            provider_message_id=provider_id,
            status=status,
            raw_response={"simulated": True, "record": record}
        )

    def get_message_status(self, provider_message_id: str) -> str:
        return self.statuses.get(provider_message_id, "UNKNOWN")

    def simulate_delivery_update(self, provider_message_id: str, new_status: str):
        """Simulate status transition like SENT -> DELIVERED -> READ."""
        if provider_message_id in self.statuses:
            self.statuses[provider_message_id] = new_status
            for msg in self.sent_messages:
                if msg["provider_message_id"] == provider_message_id:
                    msg["status"] = new_status

    def parse_incoming_webhook(self, raw_payload: Dict[str, Any]) -> Optional[IncomingMessagePayload]:
        """
        Parses either:
        1. Simulated mock format: {"phone_number": "+12345", "message": "Hi", "cafe_id": "..."}
        2. Standard Meta Cloud API format
        """
        # Format 1: Direct mock payload
        if "phone_number" in raw_payload and ("message" in raw_payload or "content" in raw_payload):
            content = raw_payload.get("message") or raw_payload.get("content", "")
            return IncomingMessagePayload(
                phone_number=str(raw_payload["phone_number"]).strip(),
                message_content=str(content).strip(),
                provider_message_id=raw_payload.get("id") or f"mock_in_{uuid.uuid4().hex[:8]}",
                timestamp=raw_payload.get("timestamp") or datetime.utcnow().isoformat(),
                raw_payload=raw_payload
            )

        # Format 2: Meta Cloud API webhook structure
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
                            provider_message_id=msg.get("id", f"meta_{uuid.uuid4().hex[:8]}"),
                            timestamp=msg.get("timestamp", datetime.utcnow().isoformat()),
                            raw_payload=raw_payload
                        )
        return None

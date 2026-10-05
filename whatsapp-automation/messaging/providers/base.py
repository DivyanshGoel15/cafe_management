from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel


class ProviderResponse(BaseModel):
    success: bool
    provider_message_id: Optional[str] = None
    status: str = "SENT"  # SENT, DELIVERED, READ, FAILED
    error_message: Optional[str] = None
    raw_response: Dict[str, Any] = {}


class IncomingMessagePayload(BaseModel):
    phone_number: str
    message_content: str
    provider_message_id: str
    timestamp: str
    raw_payload: Dict[str, Any] = {}


class WhatsAppProvider(ABC):
    """Abstract interface defining the contract for all WhatsApp messaging providers."""

    @abstractmethod
    def send_message(
        self,
        phone_number: str,
        content: str,
        cafe_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ProviderResponse:
        """Send a free-form or text message to a phone number."""
        pass

    @abstractmethod
    def send_template(
        self,
        phone_number: str,
        template_name: str,
        variables: Dict[str, Any],
        language: str = "en",
        cafe_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ProviderResponse:
        """Send an approved WhatsApp template with variable values."""
        pass

    @abstractmethod
    def get_message_status(self, provider_message_id: str) -> str:
        """Retrieve current delivery status from the provider."""
        pass

    @abstractmethod
    def parse_incoming_webhook(self, raw_payload: Dict[str, Any]) -> Optional[IncomingMessagePayload]:
        """Parse incoming webhook JSON from the provider into standard IncomingMessagePayload."""
        pass

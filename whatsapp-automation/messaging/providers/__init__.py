from backend.config.settings import settings
from messaging.providers.base import WhatsAppProvider, ProviderResponse, IncomingMessagePayload
from messaging.providers.mock_provider import MockWhatsAppProvider
from messaging.providers.cloud_api_provider import CloudAPIWhatsAppProvider

_mock_singleton = None


def get_whatsapp_provider() -> WhatsAppProvider:
    """Returns the active WhatsApp provider based on MOCK_MODE configuration."""
    global _mock_singleton
    if settings.MOCK_MODE:
        if _mock_singleton is None:
            _mock_singleton = MockWhatsAppProvider()
        return _mock_singleton
    return CloudAPIWhatsAppProvider(
        phone_number_id=settings.WHATSAPP_PHONE_NUMBER_ID,
        access_token=settings.WHATSAPP_ACCESS_TOKEN
    )


__all__ = [
    "WhatsAppProvider",
    "ProviderResponse",
    "IncomingMessagePayload",
    "MockWhatsAppProvider",
    "CloudAPIWhatsAppProvider",
    "get_whatsapp_provider",
]

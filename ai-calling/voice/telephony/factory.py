from typing import Optional
from backend.config.settings import get_settings
from .base import TelephonyProvider
from .mock_telephony import MockTelephonyProvider
from .twilio_telephony import TwilioTelephonyProvider


def get_telephony_provider(provider_name: Optional[str] = None) -> TelephonyProvider:
    """Factory to instantiate TelephonyProvider."""
    settings = get_settings()
    name = (provider_name or settings.provider_telephony).lower()

    if settings.mock_mode or name == "mock":
        return MockTelephonyProvider()

    if name in ("twilio",):
        return TwilioTelephonyProvider()

    return MockTelephonyProvider()

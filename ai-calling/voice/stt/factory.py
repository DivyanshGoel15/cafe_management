from typing import Optional
from backend.config.settings import get_settings
from .base import SpeechToTextProvider
from .mock_stt import MockSpeechToTextProvider
from .whisper_stt import WhisperSpeechToTextProvider


def get_stt_provider(provider_name: Optional[str] = None) -> SpeechToTextProvider:
    """Factory to instantiate STT provider based on configuration."""
    settings = get_settings()
    name = (provider_name or settings.provider_stt).lower()

    if settings.mock_mode or name == "mock":
        return MockSpeechToTextProvider()

    if name in ("whisper", "openai"):
        return WhisperSpeechToTextProvider()

    return MockSpeechToTextProvider()

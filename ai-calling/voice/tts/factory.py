from typing import Optional
from backend.config.settings import get_settings
from .base import TextToSpeechProvider
from .mock_tts import MockTextToSpeechProvider
from .openai_tts import OpenAITTSProvider
from .elevenlabs_tts import ElevenLabsTTSProvider


def get_tts_provider(provider_name: Optional[str] = None) -> TextToSpeechProvider:
    """Factory to instantiate TTS provider based on configuration."""
    settings = get_settings()
    name = (provider_name or settings.provider_tts).lower()

    if settings.mock_mode or name == "mock":
        return MockTextToSpeechProvider()

    if name in ("openai", "alloy"):
        return OpenAITTSProvider()

    if name in ("elevenlabs", "eleven"):
        return ElevenLabsTTSProvider()

    return MockTextToSpeechProvider()

import logging
from typing import Optional
from .base import TextToSpeechProvider
from .mock_tts import MockTextToSpeechProvider
from backend.config.settings import get_settings

logger = logging.getLogger("openai_tts")


class OpenAITTSProvider(TextToSpeechProvider):
    """OpenAI TTS Provider (e.g. tts-1 with voices like alloy, echo, fable, onyx, nova, shimmer)."""

    def __init__(self, api_key: Optional[str] = None, default_voice: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key or settings.openai_api_key
        self.default_voice = default_voice or settings.openai_tts_voice
        self.fallback = MockTextToSpeechProvider()
        self.client = None

        if self.api_key and not settings.mock_mode:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize OpenAI TTS client: {e}")

    def synthesize(self, text: str, voice_id: Optional[str] = None) -> bytes:
        if not self.client:
            return self.fallback.synthesize(text, voice_id)

        try:
            response = self.client.audio.speech.create(
                model="tts-1",
                voice=voice_id or self.default_voice,
                input=text,
            )
            return response.content
        except Exception as e:
            logger.error(f"OpenAI TTS synthesis failed: {e}. Falling back to mock TTS.")
            return self.fallback.synthesize(text, voice_id)

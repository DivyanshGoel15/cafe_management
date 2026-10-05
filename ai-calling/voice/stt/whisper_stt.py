import io
import logging
from typing import Optional
from .base import SpeechToTextProvider
from .mock_stt import MockSpeechToTextProvider
from backend.config.settings import get_settings

logger = logging.getLogger("whisper_stt")


class WhisperSpeechToTextProvider(SpeechToTextProvider):
    """
    OpenAI Whisper STT Provider.
    Falls back gracefully to MockSpeechToTextProvider if API key is not present.
    """

    def __init__(self, api_key: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key or settings.openai_api_key
        self.fallback = MockSpeechToTextProvider()
        self.client = None

        if self.api_key and not settings.mock_mode:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize Whisper STT client: {e}")

    def transcribe(self, audio_bytes: bytes, audio_format: str = "wav", language: str = "en") -> str:
        if not self.client:
            return self.fallback.transcribe(audio_bytes, audio_format, language)

        try:
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = f"audio.{audio_format}"
            transcription = self.client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=language,
            )
            return transcription.text.strip()
        except Exception as e:
            logger.error(f"Whisper transcription failed: {e}. Falling back to mock STT.")
            return self.fallback.transcribe(audio_bytes, audio_format, language)

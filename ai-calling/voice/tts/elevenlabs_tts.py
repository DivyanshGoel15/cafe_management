import logging
import httpx
from typing import Optional
from .base import TextToSpeechProvider
from .mock_tts import MockTextToSpeechProvider
from backend.config.settings import get_settings

logger = logging.getLogger("elevenlabs_tts")


class ElevenLabsTTSProvider(TextToSpeechProvider):
    """ElevenLabs REST API Text-to-Speech provider with ultra-realistic voices."""

    def __init__(self, api_key: Optional[str] = None, default_voice_id: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key or settings.elevenlabs_api_key
        self.default_voice_id = default_voice_id or settings.elevenlabs_voice_id
        self.fallback = MockTextToSpeechProvider()

    def synthesize(self, text: str, voice_id: Optional[str] = None) -> bytes:
        if not self.api_key:
            return self.fallback.synthesize(text, voice_id)

        target_voice = voice_id or self.default_voice_id
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{target_voice}"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.api_key,
        }
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
            },
        }

        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.post(url, json=data, headers=headers)
                if res.status_code == 200:
                    return res.content
                logger.warning(f"ElevenLabs returned status {res.status_code}: {res.text}")
        except Exception as e:
            logger.error(f"ElevenLabs TTS failed: {e}. Falling back to mock TTS.")

        return self.fallback.synthesize(text, voice_id)

from abc import ABC, abstractmethod
from typing import Optional


class SpeechToTextProvider(ABC):
    """Abstract interface for Speech-to-Text providers."""

    @abstractmethod
    def transcribe(self, audio_bytes: bytes, audio_format: str = "wav", language: str = "en") -> str:
        """Convert audio byte stream into text transcript."""
        pass

    async def transcribe_async(self, audio_bytes: bytes, audio_format: str = "wav", language: str = "en") -> str:
        """Asynchronous transcription."""
        return self.transcribe(audio_bytes, audio_format, language)

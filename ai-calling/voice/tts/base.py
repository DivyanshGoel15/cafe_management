from abc import ABC, abstractmethod
from typing import Optional


class TextToSpeechProvider(ABC):
    """Abstract interface for Text-to-Speech synthesis providers."""

    @abstractmethod
    def synthesize(self, text: str, voice_id: Optional[str] = None) -> bytes:
        """Synthesize text into audio bytes (e.g. WAV or MP3)."""
        pass

    async def synthesize_async(self, text: str, voice_id: Optional[str] = None) -> bytes:
        """Asynchronous synthesis."""
        return self.synthesize(text, voice_id)

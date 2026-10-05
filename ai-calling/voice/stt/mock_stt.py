from .base import SpeechToTextProvider


class MockSpeechToTextProvider(SpeechToTextProvider):
    """
    Mock STT provider for local development without paid voice APIs.
    Can return decoded mock strings or canned test utterances.
    """

    def __init__(self, default_response: str = "I would like to book a table for tomorrow evening."):
        self.default_response = default_response

    def transcribe(self, audio_bytes: bytes, audio_format: str = "wav", language: str = "en") -> str:
        # If the audio bytes contain embedded utf-8 text (e.g. from simulator payload), decode it
        try:
            decoded = audio_bytes.decode("utf-8").strip()
            if decoded:
                return decoded
        except Exception:
            pass

        return self.default_response

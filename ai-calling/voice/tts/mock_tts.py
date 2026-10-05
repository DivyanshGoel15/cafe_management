import struct
from typing import Optional
from .base import TextToSpeechProvider


class MockTextToSpeechProvider(TextToSpeechProvider):
    """
    Mock TTS provider generating simulated valid WAV audio bytes for local development
    without requiring third-party audio synthesis API subscriptions.
    """

    def synthesize(self, text: str, voice_id: Optional[str] = None) -> bytes:
        # Create a valid 44-byte RIFF/WAV header with 8000Hz mono 16-bit PCM silence/tone
        sample_rate = 8000
        num_channels = 1
        bits_per_sample = 16
        # Generate ~0.5 second of simulated audio frames
        num_samples = int(sample_rate * 0.5)
        byte_rate = sample_rate * num_channels * (bits_per_sample // 8)
        block_align = num_channels * (bits_per_sample // 8)
        data_size = num_samples * block_align
        riff_size = 36 + data_size

        header = struct.pack(
            "<4sI4s4sIHHIIHH4sI",
            b"RIFF",
            riff_size,
            b"WAVE",
            b"fmt ",
            16,  # Subchunk1Size for PCM
            1,   # AudioFormat (1 = PCM)
            num_channels,
            sample_rate,
            byte_rate,
            block_align,
            bits_per_sample,
            b"data",
            data_size,
        )
        audio_data = b"\x00" * data_size
        return header + audio_data

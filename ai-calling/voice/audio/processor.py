import base64
import io
import struct
from typing import Optional


class AudioProcessor:
    """Utilities for processing audio streams, byte buffers, and encoding."""

    @staticmethod
    def decode_base64_audio(b64_string: str) -> bytes:
        return base64.b64decode(b64_string)

    @staticmethod
    def encode_base64_audio(audio_bytes: bytes) -> str:
        return base64.b64encode(audio_bytes).decode("ascii")

    @staticmethod
    def is_valid_wav_header(audio_bytes: bytes) -> bool:
        if len(audio_bytes) < 44:
            return False
        return audio_bytes[:4] == b"RIFF" and audio_bytes[8:12] == b"WAVE"

    @staticmethod
    def wrap_raw_pcm_as_wav(pcm_bytes: bytes, sample_rate: int = 8000, channels: int = 1, bits_per_sample: int = 16) -> bytes:
        data_size = len(pcm_bytes)
        byte_rate = sample_rate * channels * (bits_per_sample // 8)
        block_align = channels * (bits_per_sample // 8)
        riff_size = 36 + data_size

        header = struct.pack(
            "<4sI4s4sIHHIIHH4sI",
            b"RIFF",
            riff_size,
            b"WAVE",
            b"fmt ",
            16,
            1,  # PCM
            channels,
            sample_rate,
            byte_rate,
            block_align,
            bits_per_sample,
            b"data",
            data_size,
        )
        return header + pcm_bytes

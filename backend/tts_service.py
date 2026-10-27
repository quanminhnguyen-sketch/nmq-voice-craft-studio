"""
TTS Service for Nguyễn Minh Quân VoiceCraft Studio
Handles edge-tts communication, parameter formatting, and audio synthesis.
"""

import io
from typing import AsyncGenerator, Tuple
import edge_tts

def format_rate(rate_val: int) -> str:
    """Format rate integer (-50 to 100) to edge-tts string, e.g. '+20%' or '-10%'"""
    if rate_val >= 0:
        return f"+{rate_val}%"
    return f"{rate_val}%"

def format_pitch(pitch_val: int) -> str:
    """Format pitch integer (-50 to 50) to edge-tts string, e.g. '+10Hz' or '-5Hz'"""
    if pitch_val >= 0:
        return f"+{pitch_val}Hz"
    return f"{pitch_val}Hz"

def format_volume(vol_val: int) -> str:
    """Format volume integer (-50 to 50) to edge-tts string, e.g. '+0%' or '-10%'"""
    if vol_val >= 0:
        return f"+{vol_val}%"
    return f"{vol_val}%"

class TTSService:
    @staticmethod
    async def synthesize_to_bytes(
        text: str,
        voice: str = "vi-VN-HoaiMyNeural",
        rate: int = 0,
        pitch: int = 0,
        volume: int = 0
    ) -> bytes:
        """Synthesize text to MP3 bytes directly in memory"""
        clean_text = text.strip()
        if not clean_text:
            raise ValueError("Văn bản không được để trống.")

        rate_str = format_rate(rate)
        pitch_str = format_pitch(pitch)
        vol_str = format_volume(volume)

        communicate = edge_tts.Communicate(
            text=clean_text,
            voice=voice,
            rate=rate_str,
            pitch=pitch_str,
            volume=vol_str
        )

        buffer = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                buffer.write(chunk["data"])

        audio_bytes = buffer.getvalue()
        if not audio_bytes:
            raise RuntimeError("Không thể tạo dữ liệu âm thanh từ giọng đọc đã chọn.")

        return audio_bytes

    @staticmethod
    async def stream_audio_chunks(
        text: str,
        voice: str = "vi-VN-HoaiMyNeural",
        rate: int = 0,
        pitch: int = 0,
        volume: int = 0
    ) -> AsyncGenerator[bytes, None]:
        """Stream synthesized audio chunks directly to client"""
        clean_text = text.strip()
        if not clean_text:
            raise ValueError("Văn bản không được để trống.")

        rate_str = format_rate(rate)
        pitch_str = format_pitch(pitch)
        vol_str = format_volume(volume)

        communicate = edge_tts.Communicate(
            text=clean_text,
            voice=voice,
            rate=rate_str,
            pitch=pitch_str,
            volume=vol_str
        )

        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                yield chunk["data"]

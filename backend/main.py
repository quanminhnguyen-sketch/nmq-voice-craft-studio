"""
Nguyễn Minh Quân VoiceCraft Studio - FastAPI Backend Server
Provides TTS synthesis, streaming, voice catalogs, and serves the web frontend.
"""

import os
from pathlib import Path
from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from backend.voice_catalog import FEATURED_VOICES, get_all_voices
from backend.tts_service import TTSService

app = FastAPI(
    title="Nguyễn Minh Quân VoiceCraft Studio API",
    description="Text-to-Speech API powered by edge-tts and FastAPI",
    version="1.0.0"
)

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TTSRequest(BaseModel):
    text: str = Field(..., description="Văn bản cần chuyển đổi thành giọng nói")
    voice: str = Field("vi-VN-HoaiMyNeural", description="Mã giọng đọc (Voice ID)")
    rate: int = Field(0, ge=-50, le=100, description="Tốc độ đọc (-50% đến +100%)")
    pitch: int = Field(0, ge=-50, le=50, description="Cao độ giọng (-50Hz đến +50Hz)")
    volume: int = Field(0, ge=-50, le=50, description="Âm lượng (-50% đến +50%)")

@app.get("/api/health")
async def health_check():
    """Healthcheck endpoint for runner and monitoring"""
    return {
        "status": "healthy",
        "service": "Nguyễn Minh Quân VoiceCraft Studio",
        "version": "1.0.0"
    }

@app.get("/api/voices")
async def get_voices():
    """Get list of featured and all available voices"""
    all_voices = await get_all_voices()
    return {
        "featured": FEATURED_VOICES,
        "all": all_voices,
        "total_count": len(all_voices)
    }

@app.post("/api/tts/generate")
async def generate_speech(req: TTSRequest):
    """Generate audio MP3 file from text input"""
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Văn bản không được để trống.")
    
    try:
        audio_bytes = await TTSService.synthesize_to_bytes(
            text=req.text,
            voice=req.voice,
            rate=req.rate,
            pitch=req.pitch,
            volume=req.volume
        )
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": 'inline; filename="speech.mp3"',
                "Content-Length": str(len(audio_bytes)),
                "Cache-Control": "no-cache"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tạo giọng nói: {str(e)}")

@app.post("/api/tts/stream")
async def stream_speech(req: TTSRequest):
    """Stream audio chunks directly to client for lower latency"""
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Văn bản không được để trống.")
    
    try:
        generator = TTSService.stream_audio_chunks(
            text=req.text,
            voice=req.voice,
            rate=req.rate,
            pitch=req.pitch,
            volume=req.volume
        )
        return StreamingResponse(
            generator,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": 'inline; filename="speech_stream.mp3"',
                "Cache-Control": "no-cache"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi phát luồng âm thanh: {str(e)}")

@app.get("/api/tts/preview")
async def preview_voice(voice: str = Query(..., description="Mã giọng đọc cần nghe thử")):
    """Quick preview synthesis for a specific voice"""
    # Find sample text from catalog or fallback
    sample_text = "Xin chào! Đây là đoạn âm thanh mẫu để bạn trải nghiệm chất lượng giọng đọc."
    for fv in FEATURED_VOICES:
        if fv["id"] == voice:
            sample_text = fv.get("sample", sample_text)
            break
            
    try:
        audio_bytes = await TTSService.synthesize_to_bytes(
            text=sample_text,
            voice=voice,
            rate=0,
            pitch=0,
            volume=0
        )
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": f'inline; filename="preview_{voice}.mp3"',
                "Cache-Control": "public, max-age=3600"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi tạo giọng mẫu: {str(e)}")

# Mount frontend static directory if present
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)

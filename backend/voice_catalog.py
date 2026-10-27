"""
Voice Catalog for Nguyễn Minh Quân VoiceCraft Studio
Provides curated premium neural voices and dynamic voice fetching via edge-tts.
"""

from typing import List, Dict, Any
import edge_tts

# Curated list of popular, high quality neural voices
FEATURED_VOICES: List[Dict[str, Any]] = [
    {
        "id": "vi-VN-HoaiMyNeural",
        "name": "Hoài My (Nữ)",
        "locale": "vi-VN",
        "language": "Tiếng Việt",
        "flag": "🇻🇳",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Giọng nữ truyền cảm, dịu dàng, phát âm chuẩn tự nhiên",
        "sample": "Xin chào! Chào mừng bạn đến với công cụ chuyển đổi văn bản thành giọng nói VoiceCraft.",
        "featured": True
    },
    {
        "id": "vi-VN-NamMinhNeural",
        "name": "Nam Minh (Nam)",
        "locale": "vi-VN",
        "language": "Tiếng Việt",
        "flag": "🇻🇳",
        "gender": "Male",
        "gender_label": "Nam",
        "description": "Giọng nam trầm ấm, đĩnh đạc, phù hợp bản tin và sách nói",
        "sample": "Kính chào quý thính giả, đây là chương trình tin tức âm thanh tự động hàng ngày.",
        "featured": True
    },
    {
        "id": "en-US-JennyNeural",
        "name": "Jenny (Female)",
        "locale": "en-US",
        "language": "English (US)",
        "flag": "🇺🇸",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Warm, natural, clear American female accent",
        "sample": "Hello! Welcome to Nguyen Minh Quan VoiceCraft Studio, an advanced AI text-to-speech platform.",
        "featured": True
    },
    {
        "id": "en-US-GuyNeural",
        "name": "Guy (Male)",
        "locale": "en-US",
        "language": "English (US)",
        "flag": "🇺🇸",
        "gender": "Male",
        "gender_label": "Nam",
        "description": "Deep, confident, engaging American male voice",
        "sample": "Today is a great day to build wonderful software with modern AI tools.",
        "featured": True
    },
    {
        "id": "en-US-AriaNeural",
        "name": "Aria (Female)",
        "locale": "en-US",
        "language": "English (US)",
        "flag": "🇺🇸",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Energetic, expressive, and versatile voice",
        "sample": "Discover how easy it is to convert your thoughts into studio-quality speech.",
        "featured": True
    },
    {
        "id": "en-US-ChristopherNeural",
        "name": "Christopher (Male)",
        "locale": "en-US",
        "language": "English (US)",
        "flag": "🇺🇸",
        "gender": "Male",
        "gender_label": "Nam",
        "description": "Professional, authoritative, excellent for tutorials",
        "sample": "In this guide, we will explore the foundational principles of system design.",
        "featured": False
    },
    {
        "id": "en-GB-SoniaNeural",
        "name": "Sonia (Female)",
        "locale": "en-GB",
        "language": "English (UK)",
        "flag": "🇬🇧",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Elegant British accent, articulate and pleasant",
        "sample": "Good morning. Here is a delightful preview of today's soundscape.",
        "featured": True
    },
    {
        "id": "en-GB-RyanNeural",
        "name": "Ryan (Male)",
        "locale": "en-GB",
        "language": "English (UK)",
        "flag": "🇬🇧",
        "gender": "Male",
        "gender_label": "Nam",
        "description": "Refined British male narrator tone",
        "sample": "Welcome to our audio documentary series on modern engineering marvels.",
        "featured": False
    },
    {
        "id": "ja-JP-NanamiNeural",
        "name": "Nanami (七海 - Female)",
        "locale": "ja-JP",
        "language": "Japanese",
        "flag": "🇯🇵",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Natural Japanese anime & narration voice",
        "sample": "こんにちは！VoiceCraftへようこそ。素敵な音声をお届けします。",
        "featured": True
    },
    {
        "id": "ja-JP-KeitaNeural",
        "name": "Keita (啓太 - Male)",
        "locale": "ja-JP",
        "language": "Japanese",
        "flag": "🇯🇵",
        "gender": "Male",
        "gender_label": "Nam",
        "description": "Calm, polite Japanese male tone",
        "sample": "皆様、本日のニュースとテクノロジーの最新情報をお届けいたします。",
        "featured": False
    },
    {
        "id": "ko-KR-SunHiNeural",
        "name": "Sun-Hi (선희 - Female)",
        "locale": "ko-KR",
        "language": "Korean",
        "flag": "🇰🇷",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Friendly, gentle Korean female voice",
        "sample": "안녕하세요! 텍스트를 고품질 음성으로 변환해 드립니다.",
        "featured": True
    },
    {
        "id": "ko-KR-InJoonNeural",
        "name": "In-Joon (인준 - Male)",
        "locale": "ko-KR",
        "language": "Korean",
        "flag": "🇰🇷",
        "gender": "Male",
        "gender_label": "Nam",
        "description": "Polite and crisp Korean male voice",
        "sample": "오늘 하루도 편안하고 즐거운 시간 되시기를 바랍니다.",
        "featured": False
    },
    {
        "id": "zh-CN-XiaoxiaoNeural",
        "name": "Xiaoxiao (晓晓 - Female)",
        "locale": "zh-CN",
        "language": "Chinese (Mandarin)",
        "flag": "🇨🇳",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Clear and warm standard Mandarin Chinese",
        "sample": "您好！欢迎使用智能语音合成助手，体验超自然的朗读效果。",
        "featured": True
    },
    {
        "id": "zh-CN-YunjianNeural",
        "name": "Yunjian (云健 - Male)",
        "locale": "zh-CN",
        "language": "Chinese (Mandarin)",
        "flag": "🇨🇳",
        "gender": "Male",
        "gender_label": "Nam",
        "description": "Expressive narration & documentary voice",
        "sample": "历史的车轮滚滚向前，带给我们无尽的思考与力量。",
        "featured": False
    },
    {
        "id": "fr-FR-DeniseNeural",
        "name": "Denise (Female)",
        "locale": "fr-FR",
        "language": "French",
        "flag": "🇫🇷",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Polished, melodious French Parisian voice",
        "sample": "Bonjour et bienvenue dans notre studio de synthèse vocale.",
        "featured": True
    },
    {
        "id": "de-DE-KatjaNeural",
        "name": "Katja (Female)",
        "locale": "de-DE",
        "language": "German",
        "flag": "🇩🇪",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Precise, articulate German female voice",
        "sample": "Guten Tag! Entdecken Sie die nächste Generation digitaler Stimmen.",
        "featured": False
    },
    {
        "id": "es-ES-ElviraNeural",
        "name": "Elvira (Female)",
        "locale": "es-ES",
        "language": "Spanish",
        "flag": "🇪🇸",
        "gender": "Female",
        "gender_label": "Nữ",
        "description": "Clear Castilian Spanish accent",
        "sample": "¡Hola! Bienvenidos a nuestra plataforma de conversión de voz.",
        "featured": False
    }
]

# Cache for dynamic full voice list
_FULL_VOICES_CACHE = None

async def get_all_voices() -> List[Dict[str, Any]]:
    """Fetch all available edge-tts voices or return cached list"""
    global _FULL_VOICES_CACHE
    if _FULL_VOICES_CACHE is not None:
        return _FULL_VOICES_CACHE
    
    try:
        raw_voices = await edge_tts.list_voices()
        parsed = []
        for v in raw_voices:
            short_name = v.get("ShortName", "")
            locale = v.get("Locale", "")
            gender = v.get("Gender", "Unknown")
            friendly_name = v.get("FriendlyName", short_name)
            
            # Simple flag lookup
            flag = "🌐"
            if locale.startswith("vi-"): flag = "🇻🇳"
            elif locale.startswith("en-US"): flag = "🇺🇸"
            elif locale.startswith("en-GB"): flag = "🇬🇧"
            elif locale.startswith("ja-"): flag = "🇯🇵"
            elif locale.startswith("ko-"): flag = "🇰🇷"
            elif locale.startswith("zh-"): flag = "🇨🇳"
            elif locale.startswith("fr-"): flag = "🇫🇷"
            elif locale.startswith("de-"): flag = "🇩🇪"
            elif locale.startswith("es-"): flag = "🇪🇸"
            elif locale.startswith("it-"): flag = "🇮🇹"
            elif locale.startswith("ru-"): flag = "🇷🇺"
            elif locale.startswith("th-"): flag = "🇹🇭"

            parsed.append({
                "id": short_name,
                "name": friendly_name.split(" - ")[0].replace("Microsoft ", ""),
                "locale": locale,
                "language": v.get("LocaleName", locale),
                "flag": flag,
                "gender": gender,
                "gender_label": "Nữ" if gender.lower() == "female" else "Nam",
                "description": v.get("VoiceTag", {}).get("VoicePersonalities", ["Neural Voice"])[0] if isinstance(v.get("VoiceTag"), dict) else "Neural Voice",
                "sample": "Kiểm tra giọng đọc mẫu thử.",
                "featured": any(fv["id"] == short_name for fv in FEATURED_VOICES)
            })
        
        # Sort so Vietnamese and Featured voices appear on top
        def sort_key(item):
            is_vi = item["locale"].startswith("vi-")
            is_feat = item["featured"]
            return (0 if (is_vi and is_feat) else 1 if is_vi else 2 if is_feat else 3, item["locale"], item["name"])
        
        parsed.sort(key=sort_key)
        _FULL_VOICES_CACHE = parsed
        return _FULL_VOICES_CACHE
    except Exception as e:
        # Fallback to featured voices if online list fails
        return FEATURED_VOICES

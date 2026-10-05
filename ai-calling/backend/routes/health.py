from fastapi import APIRouter
from backend.config.settings import get_settings

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    """Health check endpoint returning system status and provider configuration."""
    settings = get_settings()
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "mock_mode": settings.mock_mode,
        "providers": {
            "telephony": settings.provider_telephony,
            "stt": settings.provider_stt,
            "tts": settings.provider_tts,
            "llm": settings.provider_llm,
        },
    }

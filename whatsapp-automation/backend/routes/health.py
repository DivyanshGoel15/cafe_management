from datetime import datetime
from fastapi import APIRouter
from backend.config.settings import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    """Health check endpoint indicating service status and active operational mode."""
    return {
        "status": "healthy",
        "mock_mode": settings.MOCK_MODE,
        "environment": settings.ENVIRONMENT,
        "default_cafe_id": settings.DEFAULT_CAFE_ID,
        "timestamp": datetime.utcnow().isoformat(),
        "service": "whatsapp-automation",
        "version": "1.0.0"
    }

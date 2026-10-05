from datetime import datetime
from fastapi import APIRouter
from app.config import settings
from app.repositories import cafe_repo

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    cafe = cafe_repo.get_cafe()
    return {
        "status": "healthy",
        "app": settings.app_name,
        "environment": settings.environment,
        "cafe_name": cafe.name,
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

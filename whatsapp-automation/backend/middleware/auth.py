from fastapi import Header, HTTPException, status
from typing import Optional
from backend.config.settings import settings


def verify_api_key(x_api_key: Optional[str] = Header(None)) -> bool:
    """
    Validates the X-API-Key header.
    In development or mock mode, permits requests if key is not configured or matches secret.
    """
    # If in mock mode and no key configured, allow
    if settings.MOCK_MODE and not settings.API_KEY_SECRET:
        return True

    if settings.API_KEY_SECRET:
        if not x_api_key or x_api_key != settings.API_KEY_SECRET:
            # For local ease, allow when x_api_key is omitted in local mock mode
            if settings.MOCK_MODE and x_api_key is None:
                return True
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or missing API Key"
            )
    return True

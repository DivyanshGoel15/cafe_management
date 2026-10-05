from fastapi import Request, HTTPException, status
from backend.config.settings import get_settings


async def verify_api_key(request: Request) -> None:
    """
    Security middleware verifying API key header for admin/protected endpoints.
    Bypassed in local/mock development when ENABLE_API_AUTH is false.
    """
    settings = get_settings()

    # Skip auth for health check, docs, static assets, and webhooks
    path = request.url.path
    if (
        path.startswith("/health")
        or path.startswith("/docs")
        or path.startswith("/openapi.json")
        or path.startswith("/static")
        or path == "/"
        or path.startswith("/webhooks")
    ):
        return

    if not settings.enable_api_auth:
        return

    api_key_header = request.headers.get("X-API-Key") or request.headers.get("x-api-key")
    if not api_key_header:
        # Check Authorization Bearer header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            api_key_header = auth_header.split(" ", 1)[1]

    if not api_key_header or api_key_header != settings.api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key. Provide header 'X-API-Key'.",
        )

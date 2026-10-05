import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from backend.config.settings import get_settings

# Store request timestamps per IP address
_ip_request_history = defaultdict(list)


async def check_rate_limit(request: Request) -> None:
    """In-memory rate limiter per IP address."""
    settings = get_settings()
    limit = settings.rate_limit_per_minute

    # Bypass if limit is set to 0 or negative
    if limit <= 0:
        return

    # Skip health check and static assets
    path = request.url.path
    if path.startswith("/health") or path.startswith("/static") or path == "/":
        return

    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    one_minute_ago = now - 60.0

    # Clean old requests
    timestamps = [t for t in _ip_request_history[client_ip] if t > one_minute_ago]
    _ip_request_history[client_ip] = timestamps

    if len(timestamps) >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded ({limit} requests per minute). Please try again shortly.",
        )

    _ip_request_history[client_ip].append(now)

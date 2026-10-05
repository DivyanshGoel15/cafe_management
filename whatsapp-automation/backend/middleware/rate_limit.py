import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from backend.config.settings import settings


class InMemoryRateLimiter:
    """Sliding window in-memory rate limiter to protect endpoints and prevent message spam."""

    def __init__(self, max_requests: int = 120, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.history = defaultdict(list)

    def check_rate_limit(self, client_ip: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds

        # Clean old timestamps
        timestamps = [ts for ts in self.history[client_ip] if ts > cutoff]
        if len(timestamps) >= self.max_requests:
            return False

        timestamps.append(now)
        self.history[client_ip] = timestamps
        return True


rate_limiter = InMemoryRateLimiter(max_requests=200, window_seconds=60)


async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    # Skip rate limiting in mock development mode
    if not settings.MOCK_MODE and not rate_limiter.check_rate_limit(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait before making further requests."
        )
    return await call_next(request)

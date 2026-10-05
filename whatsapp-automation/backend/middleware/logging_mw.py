import time
import logging
from fastapi import Request

logger = logging.getLogger("whatsapp_automation.access")


def mask_sensitive(text: str) -> str:
    """Masks authorization tokens and secrets in logs."""
    if not text:
        return ""
    if len(text) <= 6:
        return "***"
    return f"{text[:3]}***{text[-3:]}"


async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    method = request.method
    path = request.url.path

    response = await call_next(request)

    duration = round((time.time() - start_time) * 1000, 2)
    logger.info(f"{method} {path} - {response.status_code} ({duration}ms)")
    return response

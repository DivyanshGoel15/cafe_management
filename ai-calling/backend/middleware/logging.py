import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from backend.services.logging_service import StructuredLogger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = f"req-{uuid.uuid4().hex[:8]}"
        request.state.request_id = req_id
        start_time = time.time()

        try:
            response = await call_next(request)
            duration_ms = round((time.time() - start_time) * 1000, 2)
            response.headers["X-Request-ID"] = req_id

            if not request.url.path.startswith("/health") and not request.url.path.startswith("/static"):
                StructuredLogger.log_event(
                    event_type="HTTP_REQUEST",
                    message=f"{request.method} {request.url.path} responded {response.status_code} in {duration_ms}ms",
                    data={
                        "request_id": req_id,
                        "method": request.method,
                        "path": request.url.path,
                        "status_code": response.status_code,
                        "duration_ms": duration_ms,
                    },
                )
            return response
        except Exception as e:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            StructuredLogger.log_event(
                event_type="ERROR",
                message=f"Unhandled HTTP error on {request.method} {request.url.path}: {str(e)}",
                data={"request_id": req_id, "path": request.url.path, "error": str(e)},
                level=40,
            )
            raise e

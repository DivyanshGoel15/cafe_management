import logging
import json
import re
from datetime import datetime
from typing import Dict, Any, Optional

logger = logging.getLogger("ai_calling_structured")


class StructuredLogger:
    """
    Structured logger for AI Calling telemetry and observability events.
    Automatically masks sensitive information (API keys, authorization headers, credit cards).
    """

    @staticmethod
    def _sanitize(data: Any) -> Any:
        if isinstance(data, dict):
            sanitized = {}
            for k, v in data.items():
                if any(sec in k.lower() for sec in ["key", "token", "secret", "password", "auth", "cvv", "card"]):
                    sanitized[k] = "***REDACTED***"
                else:
                    sanitized[k] = StructuredLogger._sanitize(v)
            return sanitized
        elif isinstance(data, list):
            return [StructuredLogger._sanitize(item) for item in data]
        elif isinstance(data, str):
            # Mask potential credit card patterns (13-16 consecutive digits)
            return re.sub(r"\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b", "****-****-****-****", data)
        return data

    @classmethod
    def log_event(
        cls,
        event_type: str,
        message: str,
        call_id: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        level: int = logging.INFO,
    ) -> None:
        payload = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "event_type": event_type,  # INCOMING_CALL, OUTGOING_CALL, AI_REQUEST, TOOL_CALL, BOOKING_ACTION, ESCALATION, CALL_COMPLETION, ERROR
            "call_id": call_id,
            "message": message,
            "details": cls._sanitize(data or {}),
        }
        json_log = json.dumps(payload)
        logger.log(level, json_log)

from typing import Dict, Any
from pydantic import BaseModel


class StatisticsResponse(BaseModel):
    cafe_id: str
    messages_sent: int
    messages_delivered: int
    messages_read: int
    messages_failed: int
    messages_scheduled: int
    messages_queued: int
    customer_replies: int
    active_opt_outs: int
    total_campaigns: int
    active_campaigns: int
    delivery_rate_percentage: float
    breakdown_by_status: Dict[str, int]

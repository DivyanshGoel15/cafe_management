from .base import BaseRepository
from .customer_repository import CustomerRepository
from .booking_repository import BookingRepository
from .call_repository import CallRepository
from .agent_repository import AgentRepository

__all__ = [
    "BaseRepository",
    "CustomerRepository",
    "BookingRepository",
    "CallRepository",
    "AgentRepository",
]

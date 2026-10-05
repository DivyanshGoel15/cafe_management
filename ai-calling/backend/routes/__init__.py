from .health import router as health_router
from .calls import router as calls_router
from .agents import router as agents_router
from .webhooks import router as webhooks_router
from .simulation import router as simulation_router
from .bookings import router as bookings_router

__all__ = [
    "health_router",
    "calls_router",
    "agents_router",
    "webhooks_router",
    "simulation_router",
    "bookings_router",
]

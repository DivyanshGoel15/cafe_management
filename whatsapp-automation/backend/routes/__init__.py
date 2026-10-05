from backend.routes.health import router as health_router
from backend.routes.messages import router as messages_router
from backend.routes.templates import router as templates_router
from backend.routes.campaigns import router as campaigns_router
from backend.routes.webhooks import router as webhooks_router
from backend.routes.statistics import router as statistics_router
from backend.routes.customers import router as customers_router
from backend.routes.workflows import router as workflows_router

__all__ = [
    "health_router",
    "messages_router",
    "templates_router",
    "campaigns_router",
    "webhooks_router",
    "statistics_router",
    "customers_router",
    "workflows_router",
]

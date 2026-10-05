import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from backend.config.settings import settings
from backend.middleware.logging_mw import logging_middleware
from backend.middleware.rate_limit import rate_limit_middleware
from backend.routes import (
    health_router,
    messages_router,
    templates_router,
    campaigns_router,
    webhooks_router,
    statistics_router,
    customers_router,
    workflows_router,
)
from database.session import init_db, get_db_context
from database.mock_data import seed_mock_data
from workflows import get_automation_engine, register_all_workflows
from scheduler import get_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("whatsapp_automation")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown routines."""
    logger.info("Initializing WhatsApp Automation Service...")
    logger.info(f"Operational Mode: {'MOCK MODE (Simulated)' if settings.MOCK_MODE else 'PRODUCTION (Live WhatsApp API)'}")

    # 1. Initialize DB tables
    init_db()

    # 2. Seed mock default templates & sample customers
    with get_db_context() as db:
        seed_mock_data(db)

    # 3. Register workflows with Automation Engine
    engine = get_automation_engine()
    register_all_workflows(engine)

    # 4. Start background scheduler
    scheduler = get_scheduler()
    scheduler.start(interval_seconds=1.0)

    logger.info("WhatsApp Automation Service initialized successfully.")
    yield

    # Teardown
    logger.info("Shutting down WhatsApp Automation Service...")
    scheduler.stop()
    logger.info("Shutdown complete.")


def create_app() -> FastAPI:
    """Application factory."""
    app = FastAPI(
        title="Cafe WhatsApp Automation Service",
        description=(
            "Independent event-driven WhatsApp messaging, scheduling, customer reply, "
            "and marketing automation service for cafes."
        ),
        version="1.0.0",
        lifespan=lifespan
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom middlewares
    app.middleware("http")(logging_middleware)
    app.middleware("http")(rate_limit_middleware)

    # Include routes
    app.include_router(health_router)
    app.include_router(messages_router)
    app.include_router(templates_router)
    app.include_router(campaigns_router)
    app.include_router(webhooks_router)
    app.include_router(statistics_router)
    app.include_router(customers_router)
    app.include_router(workflows_router)

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

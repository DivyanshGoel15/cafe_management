import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from backend.config.settings import get_settings
from backend.middleware.logging import RequestLoggingMiddleware
from backend.middleware.auth import verify_api_key
from backend.middleware.rate_limit import check_rate_limit
from database.mock_data.seeder import seed_database
from backend.routes import (
    health_router,
    calls_router,
    agents_router,
    webhooks_router,
    simulation_router,
    bookings_router,
)

settings = get_settings()
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and seed initial mock data
    seed_database()
    yield
    # Shutdown logic if any


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Standalone AI Voice Calling Service for Cafes with pluggable telephony, STT, LLM, and TTS providers.",
    lifespan=lifespan,
    dependencies=[Depends(verify_api_key), Depends(check_rate_limit)],
)

# CORS middleware for local frontend and Cafe Admin Dashboard integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging and ID middleware
app.add_middleware(RequestLoggingMiddleware)

# Include API Routers
app.include_router(health_router)
app.include_router(calls_router)
app.include_router(agents_router)
app.include_router(webhooks_router)
app.include_router(simulation_router)
app.include_router(bookings_router)

# Mount static folder if it exists
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/", include_in_schema=False)
async def serve_admin_dashboard():
    """Serve the interactive web admin interface and call simulator."""
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {
        "message": f"Welcome to {settings.app_name}",
        "docs_url": "/docs",
        "health_url": "/health",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "error": str(exc)},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.host, port=settings.port, reload=settings.debug)

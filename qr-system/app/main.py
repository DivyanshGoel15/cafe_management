import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    health_router, tables_router, sessions_router,
    cart_router, payments_router, orders_router,
    kitchen_router, menu_router, requests_router, qr_router
)

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title=settings.app_name,
    description="Standalone QR-Based Dine-In Table Ordering Module for Cafe Management",
    version="1.0.0"
)

# CORS configuration for local standalone development and future cafe integrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static assets
static_path = BASE_DIR / "static"
if static_path.exists():
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# ----------------- UI / Web Page Endpoints -----------------

@app.get("/", response_class=RedirectResponse)
def index_redirect():
    """Default landing redirects to Table 1 customer menu."""
    return RedirectResponse(url="/table/table_1")

@app.get("/table/{table_id}", response_class=HTMLResponse)
def serve_customer_table_page(table_id: str):
    """Customer ordering page for the scanned table QR."""
    template_file = BASE_DIR / "templates" / "customer.html"
    return HTMLResponse(content=template_file.read_text(encoding="utf-8"))

@app.get("/menu")
def serve_customer_menu_page(request: Request):
    """Alternative entry point for /menu?table={table_id}."""
    accept = request.headers.get("accept", "")
    if "application/json" in accept:
        from app.services import menu_service
        return menu_service.get_menu()
    template_file = BASE_DIR / "templates" / "customer.html"
    return HTMLResponse(content=template_file.read_text(encoding="utf-8"))

@app.get("/kitchen", response_class=HTMLResponse)
def serve_kitchen_page():
    """Kitchen Display System (KDS) tablet/desktop interface."""
    template_file = BASE_DIR / "templates" / "kitchen.html"
    return HTMLResponse(content=template_file.read_text(encoding="utf-8"))

@app.get("/admin/qr", response_class=HTMLResponse)
@app.get("/qr", response_class=HTMLResponse)
def serve_admin_qr_page():
    """Admin Table & Permanent QR Code Sticker Management Console."""
    template_file = BASE_DIR / "templates" / "admin_qr.html"
    return HTMLResponse(content=template_file.read_text(encoding="utf-8"))

# ----------------- API Router Registrations -----------------
app.include_router(health_router)
app.include_router(tables_router)
app.include_router(sessions_router)
app.include_router(cart_router)
app.include_router(payments_router)
app.include_router(orders_router)
app.include_router(kitchen_router)
app.include_router(menu_router)
app.include_router(requests_router)
app.include_router(qr_router)

from app.routers.health import router as health_router
from app.routers.tables import router as tables_router
from app.routers.sessions import router as sessions_router
from app.routers.cart import router as cart_router
from app.routers.payments import router as payments_router
from app.routers.orders import router as orders_router
from app.routers.kitchen import router as kitchen_router
from app.routers.menu import router as menu_router
from app.routers.requests import router as requests_router
from app.routers.qr import router as qr_router

__all__ = [
    "health_router", "tables_router", "sessions_router",
    "cart_router", "payments_router", "orders_router",
    "kitchen_router", "menu_router", "requests_router", "qr_router"
]

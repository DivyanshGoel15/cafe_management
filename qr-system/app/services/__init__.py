from app.services.table_service import TableService
from app.services.menu_service import MenuService
from app.services.session_service import SessionService
from app.services.cart_service import CartService
from app.services.qr_service import QRService
from app.services.order_service import OrderService
from app.services.request_service import RequestService

# Singleton service instances
table_service = TableService()
menu_service = MenuService()
session_service = SessionService()
cart_service = CartService()
qr_service = QRService()
order_service = OrderService()
request_service = RequestService()

__all__ = [
    "TableService", "MenuService", "SessionService",
    "CartService", "QRService", "OrderService", "RequestService",
    "table_service", "menu_service", "session_service",
    "cart_service", "qr_service", "order_service", "request_service"
]

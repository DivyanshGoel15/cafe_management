from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from app.models.schemas import (
    Cafe, Table, QRCode, TableSession, CustomerSession,
    MenuCategory, MenuItem, MenuAddon, Cart, Order, Payment,
    TableRequest, BillRequest
)
from app.models.enums import OrderStatus, RequestStatus, BillRequestStatus

class BaseCafeRepository(ABC):
    @abstractmethod
    def get_cafe(self) -> Cafe:
        pass

class BaseTableRepository(ABC):
    @abstractmethod
    def get_all(self) -> List[Table]:
        pass
    @abstractmethod
    def get_by_id(self, table_id: str) -> Optional[Table]:
        pass
    @abstractmethod
    def get_by_qr_identifier(self, qr_identifier: str) -> Optional[Table]:
        pass
    @abstractmethod
    def update_table(self, table: Table) -> Table:
        pass
    @abstractmethod
    def get_qr_code(self, table_id: str) -> Optional[QRCode]:
        pass
    @abstractmethod
    def save_qr_code(self, qr_code: QRCode) -> QRCode:
        pass

class BaseMenuRepository(ABC):
    @abstractmethod
    def get_categories(self) -> List[MenuCategory]:
        pass
    @abstractmethod
    def get_category_by_id(self, category_id: str) -> Optional[MenuCategory]:
        pass
    @abstractmethod
    def get_item_by_id(self, item_id: str) -> Optional[MenuItem]:
        pass
    @abstractmethod
    def get_addon_by_id(self, addon_id: str) -> Optional[MenuAddon]:
        pass
    @abstractmethod
    def update_item_availability(self, item_id: str, is_available: bool) -> Optional[MenuItem]:
        pass

class BaseSessionRepository(ABC):
    @abstractmethod
    def get_active_table_session(self, table_id: str) -> Optional[TableSession]:
        pass
    @abstractmethod
    def get_table_session_by_id(self, session_id: str) -> Optional[TableSession]:
        pass
    @abstractmethod
    def save_table_session(self, session: TableSession) -> TableSession:
        pass
    @abstractmethod
    def get_customer_session(self, customer_id: str) -> Optional[CustomerSession]:
        pass
    @abstractmethod
    def save_customer_session(self, session: CustomerSession) -> CustomerSession:
        pass

class BaseCartRepository(ABC):
    @abstractmethod
    def get_cart_by_customer_id(self, customer_id: str) -> Optional[Cart]:
        pass
    @abstractmethod
    def save_cart(self, cart: Cart) -> Cart:
        pass
    @abstractmethod
    def delete_cart(self, customer_id: str) -> bool:
        pass

class BaseOrderRepository(ABC):
    @abstractmethod
    def get_order_by_id(self, order_id: str) -> Optional[Order]:
        pass
    @abstractmethod
    def get_orders_by_session_id(self, session_id: str) -> List[Order]:
        pass
    @abstractmethod
    def get_orders_by_table_id(self, table_id: str) -> List[Order]:
        pass
    @abstractmethod
    def get_all_kitchen_orders(self) -> List[Order]:
        pass
    @abstractmethod
    def save_order(self, order: Order) -> Order:
        pass
    @abstractmethod
    def update_order_status(self, order_id: str, status: OrderStatus) -> Optional[Order]:
        pass

class BasePaymentRepository(ABC):
    @abstractmethod
    def get_payment_by_id(self, payment_id: str) -> Optional[Payment]:
        pass
    @abstractmethod
    def save_payment(self, payment: Payment) -> Payment:
        pass

class BaseRequestRepository(ABC):
    @abstractmethod
    def create_table_request(self, req: TableRequest) -> TableRequest:
        pass
    @abstractmethod
    def get_table_requests(self, table_id: Optional[str] = None) -> List[TableRequest]:
        pass
    @abstractmethod
    def update_table_request_status(self, request_id: str, status: RequestStatus) -> Optional[TableRequest]:
        pass
    @abstractmethod
    def create_bill_request(self, req: BillRequest) -> BillRequest:
        pass
    @abstractmethod
    def get_bill_requests(self, table_id: Optional[str] = None) -> List[BillRequest]:
        pass
    @abstractmethod
    def update_bill_request_status(self, request_id: str, status: BillRequestStatus) -> Optional[BillRequest]:
        pass

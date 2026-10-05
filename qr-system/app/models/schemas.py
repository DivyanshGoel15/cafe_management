from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.models.enums import (
    TableStatus, TableSessionStatus, OrderStatus,
    PaymentStatus, RequestType, RequestStatus, BillRequestStatus
)

# ----------------- Cafe & Tables -----------------

class Cafe(BaseModel):
    id: str
    name: str
    tagline: str
    address: str = "12 Heritage Lane, Connaught Place, New Delhi"
    phone: str = "+91 98765 43210"
    currency: str = "INR"
    currency_symbol: str = "₹"
    tax_rate: float = 0.05
    service_charge_rate: float = 0.0

class QRCode(BaseModel):
    qr_id: str
    table_id: str
    table_number: int
    permanent_url: str
    qr_image_data: str  # Base64 data URI (image/png)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Table(BaseModel):
    table_id: str
    table_number: int
    capacity: int = 4
    qr_identifier: str
    qr_url: str
    status: TableStatus = TableStatus.AVAILABLE
    is_active: bool = True
    current_session_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ----------------- Sessions -----------------

class CustomerSession(BaseModel):
    customer_id: str
    table_id: str
    session_id: str
    name: Optional[str] = "Guest"
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TableSession(BaseModel):
    session_id: str
    table_id: str
    table_number: int
    status: TableSessionStatus = TableSessionStatus.ACTIVE
    customer_ids: List[str] = Field(default_factory=list)
    order_ids: List[str] = Field(default_factory=list)
    subtotal: float = 0.0
    tax_amount: float = 0.0
    service_charge: float = 0.0
    total_amount: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    closed_at: Optional[datetime] = None

# ----------------- Menu -----------------

class MenuAddon(BaseModel):
    addon_id: str
    name: str
    price: float = 0.0
    is_available: bool = True

class MenuItem(BaseModel):
    item_id: str
    category_id: str
    name: str
    description: str
    price: float
    is_veg: bool = True
    is_available: bool = True
    image_url: str = ""
    addons: List[MenuAddon] = Field(default_factory=list)
    sort_order: int = 0

class MenuCategory(BaseModel):
    category_id: str
    name: str
    description: str = ""
    icon: str = ""
    sort_order: int = 0
    is_active: bool = True
    items: List[MenuItem] = Field(default_factory=list)

# ----------------- Cart -----------------

class SelectedAddon(BaseModel):
    addon_id: str
    name: str
    price: float

class CartItem(BaseModel):
    cart_item_id: str
    item_id: str
    item_name: str
    unit_price: float
    quantity: int = 1
    selected_addons: List[SelectedAddon] = Field(default_factory=list)
    item_total: float
    notes: Optional[str] = None

class Cart(BaseModel):
    cart_id: str
    customer_id: str
    table_id: str
    session_id: str
    items: List[CartItem] = Field(default_factory=list)
    subtotal: float = 0.0
    tax_amount: float = 0.0
    service_charge: float = 0.0
    final_total: float = 0.0
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ----------------- Orders -----------------

class OrderItem(BaseModel):
    order_item_id: str
    item_id: str
    item_name: str
    unit_price: float
    quantity: int
    selected_addons: List[SelectedAddon] = Field(default_factory=list)
    item_total: float
    notes: Optional[str] = None

class Order(BaseModel):
    order_id: str
    order_number: str  # e.g. ORD-1042
    table_id: str
    table_number: int
    session_id: str
    customer_id: str
    customer_name: str = "Guest"
    customer_phone: Optional[str] = None
    items: List[OrderItem] = Field(default_factory=list)
    subtotal: float
    tax_amount: float
    service_charge: float
    total_amount: float
    status: OrderStatus = OrderStatus.CART
    payment_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ----------------- Payments -----------------

class Payment(BaseModel):
    payment_id: str
    order_id: Optional[str] = None
    table_id: str
    session_id: str
    customer_id: str
    amount: float
    currency: str = "INR"
    status: PaymentStatus = PaymentStatus.PENDING
    provider: str = "mock_provider"
    provider_transaction_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ----------------- Table Requests -----------------

class TableRequest(BaseModel):
    request_id: str
    table_id: str
    table_number: int
    session_id: str
    customer_id: str
    request_type: RequestType
    status: RequestStatus = RequestStatus.PENDING
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BillRequest(BaseModel):
    bill_request_id: str
    table_id: str
    table_number: int
    session_id: str
    customer_id: str
    customer_name: str = "Guest"
    total_amount: float
    status: BillRequestStatus = BillRequestStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ----------------- DTOs / Request & Response Payloads -----------------

class AddCartItemPayload(BaseModel):
    customer_id: str
    table_id: str
    item_id: str
    quantity: int = 1
    addon_ids: List[str] = Field(default_factory=list)
    notes: Optional[str] = None

class UpdateCartItemPayload(BaseModel):
    customer_id: str
    quantity: int
    addon_ids: Optional[List[str]] = None
    notes: Optional[str] = None

class SessionCreatePayload(BaseModel):
    table_id: str
    customer_name: Optional[str] = "Guest"
    customer_phone: Optional[str] = None
    customer_id: Optional[str] = None

class CreatePaymentPayload(BaseModel):
    customer_id: str
    table_id: str
    session_id: str
    customer_name: Optional[str] = "Guest"
    customer_phone: Optional[str] = None
    notes: Optional[str] = None
    simulation_result: str = "success"  # "success", "failed", "pending"

class PaymentWebhookPayload(BaseModel):
    payment_id: str
    status: str
    provider_transaction_id: Optional[str] = None

class OrderCreatePayload(BaseModel):
    customer_id: str
    table_id: str
    session_id: str
    payment_id: str
    customer_name: Optional[str] = "Guest"
    customer_phone: Optional[str] = None
    notes: Optional[str] = None

class OrderStatusUpdatePayload(BaseModel):
    status: OrderStatus

class ItemAvailabilityPayload(BaseModel):
    is_available: bool

class TableRequestPayload(BaseModel):
    table_id: str
    session_id: str
    customer_id: str
    request_type: RequestType
    notes: Optional[str] = None

class TableRequestUpdatePayload(BaseModel):
    status: RequestStatus

class BillRequestPayload(BaseModel):
    table_id: str
    session_id: str
    customer_id: str
    customer_name: Optional[str] = "Guest"

class BillRequestUpdatePayload(BaseModel):
    status: BillRequestStatus

class QRGeneratePayload(BaseModel):
    table_id: str
    force_regenerate: bool = False

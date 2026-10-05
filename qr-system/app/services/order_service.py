import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.schemas import Order, OrderItem, SelectedAddon
from app.models.enums import OrderStatus, PaymentStatus
from app.database import db
from app.repositories import (
    order_repo, cart_repo, payment_repo, table_repo,
    session_repo, menu_repo,
    BaseOrderRepository, BaseCartRepository, BasePaymentRepository,
    BaseTableRepository, BaseSessionRepository, BaseMenuRepository
)
from app.services.session_service import SessionService

class OrderService:
    def __init__(
        self,
        o_repo: BaseOrderRepository = order_repo,
        c_repo: BaseCartRepository = cart_repo,
        p_repo: BasePaymentRepository = payment_repo,
        t_repo: BaseTableRepository = table_repo,
        s_repo: BaseSessionRepository = session_repo,
        m_repo: BaseMenuRepository = menu_repo
    ):
        self.order_repo = o_repo
        self.cart_repo = c_repo
        self.payment_repo = p_repo
        self.table_repo = t_repo
        self.session_repo = s_repo
        self.menu_repo = m_repo
        self.session_service = SessionService(s_repo, t_repo, o_repo)

    def create_order_from_cart(
        self,
        customer_id: str,
        table_id: str,
        session_id: str,
        payment_id: str,
        customer_name: Optional[str] = "Guest",
        customer_phone: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Order:
        # 1. Verify Payment
        payment = self.payment_repo.get_payment_by_id(payment_id)
        if not payment:
            raise ValueError(f"Payment with ID '{payment_id}' does not exist")

        if payment.status != PaymentStatus.SUCCESS:
            raise ValueError(f"Cannot place order: Payment is not successful (status: {payment.status.value})")

        # 2. Verify Table
        table = self.table_repo.get_by_id(table_id)
        if not table:
            raise ValueError(f"Table '{table_id}' not found")

        # 3. Retrieve Cart
        cart = self.cart_repo.get_cart_by_customer_id(customer_id)
        if not cart or not cart.items:
            raise ValueError("Cannot place order: Cart is empty")

        # 4. Verify items availability at checkout time
        for ci in cart.items:
            item = self.menu_repo.get_item_by_id(ci.item_id)
            if not item or not item.is_available:
                raise ValueError(f"Item '{ci.item_name}' became unavailable. Please remove it from cart.")

        # 5. Build Order Items
        order_items = []
        for ci in cart.items:
            order_items.append(
                OrderItem(
                    order_item_id=f"oi_{uuid.uuid4().hex[:8]}",
                    item_id=ci.item_id,
                    item_name=ci.item_name,
                    unit_price=ci.unit_price,
                    quantity=ci.quantity,
                    selected_addons=ci.selected_addons,
                    item_total=ci.item_total,
                    notes=ci.notes
                )
            )

        # 6. Build Order (Order is now Confirmed and Received by Kitchen)
        order_id = f"ord_{uuid.uuid4().hex[:10]}"
        order_number = db.next_order_number()

        order = Order(
            order_id=order_id,
            order_number=order_number,
            table_id=table.table_id,
            table_number=table.table_number,
            session_id=session_id,
            customer_id=customer_id,
            customer_name=customer_name or "Guest",
            customer_phone=customer_phone,
            items=order_items,
            subtotal=cart.subtotal,
            tax_amount=cart.tax_amount,
            service_charge=cart.service_charge,
            total_amount=cart.final_total,
            status=OrderStatus.CONFIRMED,
            payment_id=payment_id,
            notes=notes,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.order_repo.save_order(order)

        # Link payment to order
        updated_payment = payment.model_copy(update={"order_id": order_id})
        self.payment_repo.save_payment(updated_payment)

        # Recalculate Table Session
        self.session_service.recalculate_totals(session_id)

        # Clear customer's cart after successful order placement
        self.cart_repo.delete_cart(customer_id)

        # Asynchronously sync order to Central Hub
        self._sync_order_to_hub(order)

        return order

    def _sync_order_to_hub(self, order: Order):
        try:
            import urllib.request, json
            payload = {
                "id": order.order_id,
                "orderNumber": int(order.order_number.replace("ORD-", "")),
                "customer": order.customer_name,
                "phone": order.customer_phone or "",
                "type": "Dine-in",
                "table": f"Table {order.table_number}",
                "tableId": order.table_id,
                "tableNumber": order.table_number,
                "sessionId": order.session_id,
                "items": [
                    {
                        "id": item.item_id,
                        "name": item.item_name,
                        "qty": item.quantity,
                        "price": item.unit_price,
                        "total": item.item_total
                    }
                    for item in order.items
                ],
                "subtotal": order.subtotal,
                "tax": order.tax_amount,
                "serviceCharge": order.service_charge,
                "total": order.total_amount,
                "status": "Confirmed",
                "paymentStatus": "Paid",
                "paymentMethod": "UPI"
            }
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                "http://localhost:4000/api/orders",
                data=data,
                headers={"Content-Type": "application/json", "User-Agent": "QR-System"}
            )
            with urllib.request.urlopen(req, timeout=1.5):
                pass
        except Exception:
            pass

    def get_order(self, order_id: str) -> Optional[Order]:
        order = self.order_repo.get_order_by_id(order_id)
        if order:
            try:
                import urllib.request, json
                req = urllib.request.Request(f"http://localhost:4000/api/orders/{order_id}", headers={"User-Agent": "QR-System"})
                with urllib.request.urlopen(req, timeout=1.0) as resp:
                    if resp.status == 200:
                        remote_order = json.loads(resp.read().decode('utf-8'))
                        remote_status = remote_order.get("status")
                        if remote_status:
                            for enum_val in OrderStatus:
                                if enum_val.value.lower() == remote_status.lower():
                                    order = self.order_repo.update_order_status(order_id, enum_val)
                                    break
            except Exception:
                pass
        return order

    def get_kitchen_orders(self) -> List[Order]:
        return self.order_repo.get_all_kitchen_orders()

    def update_order_status(self, order_id: str, status: OrderStatus) -> Optional[Order]:
        order = self.order_repo.get_order_by_id(order_id)
        if not order:
            return None

        updated_order = self.order_repo.update_order_status(order_id, status)
        if updated_order:
            self.session_service.recalculate_totals(updated_order.session_id)
            self._sync_status_to_hub(order_id, status)
        return updated_order

    def _sync_status_to_hub(self, order_id: str, status: OrderStatus):
        try:
            import urllib.request, json
            data = json.dumps({"status": status.value.capitalize()}).encode("utf-8")
            req = urllib.request.Request(
                f"http://localhost:4000/api/orders/{order_id}/status",
                data=data,
                headers={"Content-Type": "application/json", "User-Agent": "QR-System"},
                method="PUT"
            )
            with urllib.request.urlopen(req, timeout=1.5):
                pass
        except Exception:
            pass


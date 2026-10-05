from typing import List, Optional
from datetime import datetime
from app.database import InMemoryDatabase, db
from app.models.schemas import (
    Cafe, Table, QRCode, TableSession, CustomerSession,
    MenuCategory, MenuItem, MenuAddon, Cart, Order, Payment,
    TableRequest, BillRequest
)
from app.models.enums import OrderStatus, RequestStatus, BillRequestStatus, TableSessionStatus, TableStatus
from app.repositories.base import (
    BaseCafeRepository, BaseTableRepository, BaseMenuRepository,
    BaseSessionRepository, BaseCartRepository, BaseOrderRepository,
    BasePaymentRepository, BaseRequestRepository
)

class MemoryCafeRepository(BaseCafeRepository):
    def __init__(self, database: InMemoryDatabase = db):
        self.db = database

    def get_cafe(self) -> Cafe:
        with self.db._lock:
            try:
                import urllib.request, json
                req = urllib.request.Request("http://localhost:4000/api/cafe", headers={"User-Agent": "QR-System"})
                with urllib.request.urlopen(req, timeout=1.0) as resp:
                    if resp.status == 200:
                        data = json.loads(resp.read().decode('utf-8'))
                        if self.db.cafe:
                            self.db.cafe.name = data.get("name", self.db.cafe.name)
                            self.db.cafe.address = data.get("address", self.db.cafe.address)
                            self.db.cafe.phone = data.get("phone", self.db.cafe.phone)
                            self.db.cafe.tagline = data.get("tagline", self.db.cafe.tagline)
            except Exception:
                pass
            return self.db.cafe

class MemoryTableRepository(BaseTableRepository):
    def __init__(self, database: InMemoryDatabase = db):
        self.db = database

    def _sync_tables(self):
        try:
            import urllib.request, json
            req = urllib.request.Request("http://localhost:4000/api/tables", headers={"User-Agent": "QR-System"})
            with urllib.request.urlopen(req, timeout=1.0) as resp:
                if resp.status == 200:
                    tables_data = json.loads(resp.read().decode('utf-8'))
                    for td in tables_data:
                        num = int(td.get("number", 0))
                        if num:
                            tid = f"table_{num}"
                            is_act = td.get("isActive", True) and td.get("status") != "Inactive"
                            if tid in self.db.tables:
                                self.db.tables[tid].capacity = int(td.get("capacity", self.db.tables[tid].capacity))
                                self.db.tables[tid].status = TableStatus.AVAILABLE if is_act else TableStatus.OCCUPIED
                            else:
                                new_t = Table(
                                    table_id=tid,
                                    table_number=num,
                                    capacity=int(td.get("capacity", 4)),
                                    qr_identifier=f"qr_table_{num}",
                                    qr_url=f"http://localhost:8000/table/{tid}",
                                    status=TableStatus.AVAILABLE if is_act else TableStatus.OCCUPIED
                                )
                                self.db.tables[tid] = new_t
        except Exception:
            pass

    def get_all(self) -> List[Table]:
        self._sync_tables()
        with self.db._lock:
            return sorted(list(self.db.tables.values()), key=lambda t: t.table_number)

    def get_by_id(self, table_id: str) -> Optional[Table]:
        self._sync_tables()
        with self.db._lock:
            digits = str(table_id).replace("table_", "").replace("T-", "").strip()
            normalized = f"table_{digits}" if digits.isdigit() else str(table_id)
            tbl = self.db.tables.get(normalized) or self.db.tables.get(str(table_id))
            return tbl

    def get_by_qr_identifier(self, qr_identifier: str) -> Optional[Table]:
        self._sync_tables()
        with self.db._lock:
            for tbl in self.db.tables.values():
                if tbl.qr_identifier == qr_identifier:
                    return tbl
            return None

    def update_table(self, table: Table) -> Table:
        with self.db._lock:
            self.db.tables[table.table_id] = table
            return table

    def get_qr_code(self, table_id: str) -> Optional[QRCode]:
        with self.db._lock:
            return self.db.qr_codes.get(table_id)

    def save_qr_code(self, qr_code: QRCode) -> QRCode:
        with self.db._lock:
            self.db.qr_codes[qr_code.table_id] = qr_code
            return qr_code

class MemoryMenuRepository(BaseMenuRepository):
    def __init__(self, database: InMemoryDatabase = db):
        self.db = database

    def _sync_menu(self):
        try:
            import urllib.request, json
            req = urllib.request.Request("http://localhost:4000/api/menu", headers={"User-Agent": "QR-System"})
            with urllib.request.urlopen(req, timeout=1.0) as resp:
                if resp.status == 200:
                    items = json.loads(resp.read().decode('utf-8'))
                    active_names = {i.get("name", "").lower() for i in items}
                    active_ids = {str(i.get("id", "")).lower() for i in items}

                    for itm in items:
                        name = itm.get("name", "")
                        price = float(itm.get("price", 0))
                        avail = bool(itm.get("available", itm.get("isAvailable", True)))
                        cid = itm.get("category", itm.get("categoryId", "cat_starters"))

                        match = None
                        for k, mi in self.db.menu_items.items():
                            if mi.name.lower() == name.lower() or k.lower() == str(itm.get("id", "")).lower():
                                match = mi
                                break
                        if match:
                            match.price = price
                            match.is_available = avail
                            match.name = name
                        else:
                            new_item = MenuItem(
                                item_id=str(itm.get("id", f"item_{len(self.db.menu_items) + 1}")),
                                category_id=cid,
                                name=name,
                                description=itm.get("description", ""),
                                price=price,
                                is_veg=itm.get("isVeg", True),
                                is_available=avail,
                                image_url=itm.get("imageUrl", "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80"),
                                addons=[]
                            )
                            self.db.menu_items[new_item.item_id] = new_item
                            if cid not in self.db.categories:
                                self.db.categories[cid] = MenuCategory(
                                    category_id=cid,
                                    name=cid,
                                    description=cid,
                                    sort_order=len(self.db.categories) + 1,
                                    items=[]
                                )

                    # Remove items deleted from central API
                    deleted_keys = []
                    for k, mi in self.db.menu_items.items():
                        if mi.name.lower() not in active_names and k.lower() not in active_ids:
                            deleted_keys.append(k)
                    for dk in deleted_keys:
                        del self.db.menu_items[dk]
        except Exception:
            pass

    def get_categories(self) -> List[MenuCategory]:
        self._sync_menu()
        with self.db._lock:
            cats = []
            for cat in sorted(self.db.categories.values(), key=lambda c: c.sort_order):
                items = [
                    item for item in self.db.menu_items.values()
                    if item.category_id == cat.category_id or item.category_id == cat.name
                ]
                items.sort(key=lambda i: i.sort_order)
                cat_copy = cat.model_copy()
                cat_copy.items = items
                cats.append(cat_copy)
            return cats

    def get_category_by_id(self, category_id: str) -> Optional[MenuCategory]:
        self._sync_menu()
        with self.db._lock:
            cat = self.db.categories.get(category_id)
            if not cat:
                return None
            items = [
                item for item in self.db.menu_items.values()
                if item.category_id == cat.category_id or item.category_id == cat.name
            ]
            items.sort(key=lambda i: i.sort_order)
            cat_copy = cat.model_copy()
            cat_copy.items = items
            return cat_copy

    def get_item_by_id(self, item_id: str) -> Optional[MenuItem]:
        self._sync_menu()
        with self.db._lock:
            # Check by item_id or name
            clean = str(item_id).lower()
            if item_id in self.db.menu_items:
                return self.db.menu_items[item_id]
            for k, itm in self.db.menu_items.items():
                if k.lower() == clean or itm.name.lower() == clean:
                    return itm
            return None

    def get_addon_by_id(self, addon_id: str) -> Optional[MenuAddon]:
        with self.db._lock:
            return self.db.addons.get(addon_id)

    def update_item_availability(self, item_id: str, is_available: bool) -> Optional[MenuItem]:
        with self.db._lock:
            item = self.get_item_by_id(item_id)
            if not item:
                return None
            updated = item.model_copy(update={"is_available": is_available})
            self.db.menu_items[item.item_id] = updated
            return updated

class MemorySessionRepository(BaseSessionRepository):
    def __init__(self, database: InMemoryDatabase = db):
        self.db = database

    def get_active_table_session(self, table_id: str) -> Optional[TableSession]:
        with self.db._lock:
            for s in self.db.table_sessions.values():
                if s.table_id == table_id and s.status == TableSessionStatus.ACTIVE:
                    return s
            return None

    def get_table_session_by_id(self, session_id: str) -> Optional[TableSession]:
        with self.db._lock:
            return self.db.table_sessions.get(session_id)

    def save_table_session(self, session: TableSession) -> TableSession:
        with self.db._lock:
            self.db.table_sessions[session.session_id] = session
            return session

    def get_customer_session(self, customer_id: str) -> Optional[CustomerSession]:
        with self.db._lock:
            return self.db.customer_sessions.get(customer_id)

    def save_customer_session(self, session: CustomerSession) -> CustomerSession:
        with self.db._lock:
            self.db.customer_sessions[session.customer_id] = session
            return session

class MemoryCartRepository(BaseCartRepository):
    def __init__(self, database: InMemoryDatabase = db):
        self.db = database

    def get_cart_by_customer_id(self, customer_id: str) -> Optional[Cart]:
        with self.db._lock:
            return self.db.carts.get(customer_id)

    def save_cart(self, cart: Cart) -> Cart:
        with self.db._lock:
            self.db.carts[cart.customer_id] = cart
            return cart

    def delete_cart(self, customer_id: str) -> bool:
        with self.db._lock:
            if customer_id in self.db.carts:
                del self.db.carts[customer_id]
                return True
            return False

class MemoryOrderRepository(BaseOrderRepository):
    def __init__(self, database: InMemoryDatabase = db):
        self.db = database

    def get_order_by_id(self, order_id: str) -> Optional[Order]:
        with self.db._lock:
            return self.db.orders.get(order_id)

    def get_orders_by_session_id(self, session_id: str) -> List[Order]:
        with self.db._lock:
            return [o for o in self.db.orders.values() if o.session_id == session_id]

    def get_orders_by_table_id(self, table_id: str) -> List[Order]:
        with self.db._lock:
            return [o for o in self.db.orders.values() if o.table_id == table_id]

    def get_all_kitchen_orders(self) -> List[Order]:
        with self.db._lock:
            try:
                import urllib.request, json
                req = urllib.request.Request("http://localhost:4000/api/orders", headers={"User-Agent": "QR-System"})
                with urllib.request.urlopen(req, timeout=1.0) as resp:
                    if resp.status == 200:
                        remote_orders = json.loads(resp.read().decode('utf-8'))
                        for ro in remote_orders:
                            oid = ro.get("id")
                            if oid and oid not in self.db.orders:
                                r_status = ro.get("status", "Confirmed")
                                matched_status = OrderStatus.CONFIRMED
                                for es in OrderStatus:
                                    if es.value.lower() == r_status.lower():
                                        matched_status = es
                                        break
                                self.db.orders[oid] = Order(
                                    order_id=oid,
                                    order_number=str(ro.get("orderNumber", oid)),
                                    table_id=ro.get("tableId") or f"table_{ro.get('tableNumber', 7)}",
                                    table_number=int(ro.get("tableNumber", 7)),
                                    session_id=ro.get("sessionId") or f"sess_{oid}",
                                    customer_id=ro.get("customer", "Guest"),
                                    customer_name=ro.get("customer", "Guest"),
                                    customer_phone=ro.get("phone", ""),
                                    items=[],
                                    subtotal=float(ro.get("subtotal", 0)),
                                    tax_amount=float(ro.get("tax", 0)),
                                    service_charge=float(ro.get("serviceCharge", 0)),
                                    total_amount=float(ro.get("total", 0)),
                                    status=matched_status,
                                    payment_id=f"pay_{oid}"
                                )
                            elif oid and oid in self.db.orders:
                                r_status = ro.get("status", "")
                                for es in OrderStatus:
                                    if es.value.lower() == r_status.lower():
                                        self.db.orders[oid] = self.db.orders[oid].model_copy(update={"status": es})
                                        break
            except Exception:
                pass
            orders = [
                o for o in self.db.orders.values()
                if o.status in [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY]
            ]
            orders.sort(key=lambda o: o.created_at, reverse=True)
            return orders

    def save_order(self, order: Order) -> Order:
        with self.db._lock:
            self.db.orders[order.order_id] = order
            return order

    def update_order_status(self, order_id: str, status: OrderStatus) -> Optional[Order]:
        with self.db._lock:
            order = self.db.orders.get(order_id)
            if not order:
                return None
            updated = order.model_copy(update={"status": status, "updated_at": datetime.utcnow()})
            self.db.orders[order_id] = updated
            return updated

class MemoryPaymentRepository(BasePaymentRepository):
    def __init__(self, database: InMemoryDatabase = db):
        self.db = database

    def get_payment_by_id(self, payment_id: str) -> Optional[Payment]:
        with self.db._lock:
            return self.db.payments.get(payment_id)

    def save_payment(self, payment: Payment) -> Payment:
        with self.db._lock:
            self.db.payments[payment.payment_id] = payment
            return payment

class MemoryRequestRepository(BaseRequestRepository):
    def __init__(self, database: InMemoryDatabase = db):
        self.db = database

    def create_table_request(self, req: TableRequest) -> TableRequest:
        with self.db._lock:
            self.db.table_requests[req.request_id] = req
            try:
                import urllib.request, json
                digits = req.table_id.replace("table_", "").replace("T-", "")
                tnum = int(digits) if digits.isdigit() else 7
                payload = {
                    "tableNumber": tnum,
                    "tableId": req.table_id,
                    "requestType": req.request_type.value,
                    "notes": req.notes or f"Customer called {req.request_type.value}"
                }
                data = json.dumps(payload).encode("utf-8")
                r = urllib.request.Request("http://localhost:4000/api/table-requests", data=data, headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(r, timeout=1.0):
                    pass
            except Exception:
                pass
            return req

    def get_table_requests(self, table_id: Optional[str] = None) -> List[TableRequest]:
        with self.db._lock:
            reqs = list(self.db.table_requests.values())
            if table_id:
                reqs = [r for r in reqs if r.table_id == table_id]
            reqs.sort(key=lambda r: r.created_at, reverse=True)
            return reqs

    def update_table_request_status(self, request_id: str, status: RequestStatus) -> Optional[TableRequest]:
        with self.db._lock:
            req = self.db.table_requests.get(request_id)
            if not req:
                return None
            updated = req.model_copy(update={"status": status, "updated_at": datetime.utcnow()})
            self.db.table_requests[request_id] = updated
            try:
                import urllib.request, json
                data = json.dumps({"status": status.value.capitalize()}).encode("utf-8")
                r = urllib.request.Request(f"http://localhost:4000/api/table-requests/{request_id}/status", data=data, headers={"Content-Type": "application/json"}, method="PUT")
                with urllib.request.urlopen(r, timeout=1.0):
                    pass
            except Exception:
                pass
            return updated

    def create_bill_request(self, req: BillRequest) -> BillRequest:
        with self.db._lock:
            self.db.bill_requests[req.bill_request_id] = req
            try:
                import urllib.request, json
                digits = req.table_id.replace("table_", "").replace("T-", "")
                tnum = int(digits) if digits.isdigit() else 7
                payload = {
                    "tableNumber": tnum,
                    "tableId": req.table_id,
                    "customerName": req.customer_name or "Guest"
                }
                data = json.dumps(payload).encode("utf-8")
                r = urllib.request.Request("http://localhost:4000/api/bill-requests", data=data, headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(r, timeout=1.0):
                    pass
            except Exception:
                pass
            return req

    def get_bill_requests(self, table_id: Optional[str] = None) -> List[BillRequest]:
        with self.db._lock:
            reqs = list(self.db.bill_requests.values())
            if table_id:
                reqs = [r for r in reqs if r.table_id == table_id]
            reqs.sort(key=lambda r: r.created_at, reverse=True)
            return reqs

    def update_bill_request_status(self, request_id: str, status: BillRequestStatus) -> Optional[BillRequest]:
        with self.db._lock:
            req = self.db.bill_requests.get(request_id)
            if not req:
                return None
            updated = req.model_copy(update={"status": status, "updated_at": datetime.utcnow()})
            self.db.bill_requests[request_id] = updated
            try:
                import urllib.request, json
                data = json.dumps({"status": status.value.capitalize()}).encode("utf-8")
                r = urllib.request.Request(f"http://localhost:4000/api/bill-requests/{request_id}/status", data=data, headers={"Content-Type": "application/json"}, method="PUT")
                with urllib.request.urlopen(r, timeout=1.0):
                    pass
            except Exception:
                pass
            return updated

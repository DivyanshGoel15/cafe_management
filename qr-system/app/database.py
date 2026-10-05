import threading
from typing import Dict, List, Optional
from app.models.schemas import (
    Cafe, Table, QRCode, TableSession, CustomerSession,
    MenuCategory, MenuItem, MenuAddon, Cart, Order, Payment,
    TableRequest, BillRequest
)
from app.seed_data import get_initial_cafe, get_initial_tables, get_initial_menu
from app.config import settings

class InMemoryDatabase:
    """
    Thread-safe in-memory mock database.
    Abstracted behind clean repository interfaces for easy migration to PostgreSQL/Supabase.
    """
    def __init__(self):
        self._lock = threading.RLock()
        self.cafe: Optional[Cafe] = None
        self.tables: Dict[str, Table] = {}
        self.qr_codes: Dict[str, QRCode] = {}
        self.categories: Dict[str, MenuCategory] = {}
        self.menu_items: Dict[str, MenuItem] = {}
        self.addons: Dict[str, MenuAddon] = {}
        self.table_sessions: Dict[str, TableSession] = {}
        self.customer_sessions: Dict[str, CustomerSession] = {}
        self.carts: Dict[str, Cart] = {}
        self.orders: Dict[str, Order] = {}
        self.payments: Dict[str, Payment] = {}
        self.table_requests: Dict[str, TableRequest] = {}
        self.bill_requests: Dict[str, BillRequest] = {}
        self._order_counter = 1000

        self.reset_and_seed()

    def reset_and_seed(self):
        with self._lock:
            self.cafe = get_initial_cafe()
            self.tables.clear()
            self.qr_codes.clear()
            self.categories.clear()
            self.menu_items.clear()
            self.addons.clear()
            self.table_sessions.clear()
            self.customer_sessions.clear()
            self.carts.clear()
            self.orders.clear()
            self.payments.clear()
            self.table_requests.clear()
            self.bill_requests.clear()
            self._order_counter = 1000

            # Seed tables
            for tbl in get_initial_tables(settings.base_url):
                self.tables[tbl.table_id] = tbl

            # Seed menu
            for cat in get_initial_menu():
                self.categories[cat.category_id] = cat
                for item in cat.items:
                    self.menu_items[item.item_id] = item
                    for addon in item.addons:
                        self.addons[addon.addon_id] = addon

    def next_order_number(self) -> str:
        with self._lock:
            self._order_counter += 1
            return f"ORD-{self._order_counter}"

# Global singleton database instance
db = InMemoryDatabase()

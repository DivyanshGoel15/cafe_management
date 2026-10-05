# ☕ Cafe Aroma — QR-Based Dine-In Ordering System

> A complete, standalone, production-ready QR dine-in ordering module for cafes and restaurants. Features permanent table QR architecture, mobile-first customer ordering, server-authoritative pricing, simulated payment gateway, live kitchen display system (KDS), waiter/bill assistance, and multi-customer table session aggregation.

---

## 📌 Table of Contents
1. [Core Concept & Architectural Highlights](#core-concept--architectural-highlights)
2. [Permanent QR Architecture](#permanent-qr-architecture)
3. [System Architecture & Tech Stack](#system-architecture--tech-stack)
4. [User Interfaces](#user-interfaces)
   - [Customer Mobile Ordering (`/table/{table_id}`)](#1-customer-mobile-ordering)
   - [Kitchen Display System (`/kitchen`)](#2-kitchen-display-system-kds)
   - [Admin QR & Table Console (`/admin/qr`)](#3-admin-qr--table-management-console)
5. [Domain Data Models & Repository Pattern](#domain-data-models--repository-pattern)
6. [Payment Abstraction & Simulation](#payment-abstraction--simulation)
7. [API Reference (23 Endpoints)](#api-reference)
8. [Automated Test Suite (20 Tests)](#automated-test-suite)
9. [Setup & Running Locally](#setup--running-locally)
10. [Future Integration Architecture](#future-integration-architecture)

---

## 🚀 Core Concept & Architectural Highlights

In a modern dine-in cafe, each physical table has a permanent QR sticker. When guests sit down:
1. **Permanent QR Scan**: Customer scans the permanent QR code on Table 7 (pointing to `/table/table_7`).
2. **Dynamic Menu Loading**: The backend dynamically identifies Table 7, creates or joins an active dine-in table session, and returns the current cafe menu.
3. **No Account Required**: Anonymous, friction-free session-based ordering.
4. **Authoritative Pricing**: Frontend prices are strictly informational. All item amounts, add-ons, taxes (GST 5%), and totals are computed server-side from the authoritative menu database.
5. **Payment-Before-Kitchen**: Orders **MUST NOT** enter `Received` or `Confirmed` until payment is successfully completed. Failed payments never generate kitchen orders.
6. **Multi-Customer Table Aggregation**: Multiple guests at the same table (e.g. Customer A, B, and C) can scan the same QR, place and pay for their own items independently, while the system aggregates the total under the shared Table Session.

---

## 🏷️ Permanent QR Architecture

Physical QR stickers are printed once and attached to tables. They do **NOT** contain menu data and do **NOT** require regeneration when:
- Menu items are added or removed
- Prices change
- Dishes become unavailable
- Cafe branding updates

```
Physical Sticker (Table 7)
       ↓
URL: https://cafe-domain.com/table/table_7
       ↓
Backend Service identifies Table 7
       ↓
Loads Current Authoritative Menu & Active Session
       ↓
Customer orders & pays seamlessly
```

---

## 🛠️ System Architecture & Tech Stack

- **Backend**: Python 3.11+, FastAPI, Pydantic v2
- **QR Engine**: `qrcode[pil]` generating crisp base64 data URIs and printable PNG stickers
- **Data Persistence**: Thread-safe in-memory database with Repository Pattern (`BaseRepository` interfaces for Cafe, Table, Menu, Session, Cart, Order, Payment, and Request entities) — cleanly swappable to PostgreSQL or Supabase.
- **Frontend / UI**: Mobile-first responsive web apps built with HTML5, Vanilla CSS (curated artisanal cafe dark/warm theme, glassmorphism, micro-animations, `@media print` sticker styles), and Vanilla JS.
- **Testing**: `pytest` and `httpx` (TestClient) covering 20 comprehensive unit and integration test cases.

---

## 📱 User Interfaces

### 1. Customer Mobile Ordering
- **URL**: `http://localhost:8000/table/{table_id}` (e.g., `/table/table_7`)
- **Key Features**:
  - Live cafe branding ("Cafe Aroma") and Table # pill indicator
  - Category filters: *Starters & Small Bites*, *Main Course*, *Artisanal Beverages*, *Handcrafted Desserts*, *Chef's Specials*
  - Search bar & Veg Only toggle switch
  - Diet badges (Green dot for Veg, Red dot for Non-Veg)
  - Unavailable dishes clearly display **"Currently unavailable"** and disabled add actions
  - Item Customization Modal: Select add-ons (e.g., Extra Melted Cheese, Peri Peri, Aioli Dip), add special cooking instructions, adjust quantity with live price recalculation
  - Floating Cart bar & Cart Drawer with item breakdown, optional guest name/phone, and GST summary
  - **Simulated Payment Gateway**:
    - "Simulate Successful Payment": Completes payment, submits order, dispatches to kitchen, clears cart, and opens live tracker
    - "Simulate Failed Payment": Rejects order, leaves cart intact, shows error alert
    - "Simulate Pending Payment": Demonstrates asynchronous pending status
  - **Live Order Status Stepper**: Live auto-polling progress indicator:
    `Received` → `Confirmed` → `Preparing` → `Ready` → `Served`
  - Table Assistance chips: **Call Waiter**, **Water Refill**, **General Help**, **Request Bill**

### 2. Kitchen Display System (KDS)
- **URL**: `http://localhost:8000/kitchen`
- **Key Features**:
  - Tablet and desktop high-contrast commercial kitchen layout
  - Live stream of incoming confirmed orders with audio chime alert
  - Order cards showing Table #, Order #, elapsed time, guest note, and bold item quantities with customized add-ons
  - Status progression buttons: `Start Preparing →` | `Mark Ready ✓` | `Mark Served 🍽️`
  - **Table Assistance & Bill Requests tab**: Real-time staff acknowledgment and completion for water refills, waiter calls, and bills
  - **Menu Availability Switchboard**: 1-click toggle switches to immediately make any menu item available or unavailable across all customer devices

### 3. Admin QR & Table Management Console
- **URL**: `http://localhost:8000/admin/qr`
- **Key Features**:
  - Overview of all 20 cafe tables with capacity, status, and permanent QR previews
  - **Printable Sticker Preview Modal**:
    - Styled physical sticker layout (Cafe Logo, "TABLE 7", QR code, "Scan to view menu & order", short URL)
    - `Print Sticker` button with print CSS stylesheet
    - `Download PNG` button
    - `Regenerate QR` button (for rare sticker replacements)
  - **Active Table Sessions & Order Aggregation View**: Demonstrates how multiple customer orders are aggregated under each table's active dine-in session.

---

## 🗄️ Domain Data Models & Repository Pattern

All models are defined with Pydantic in [`app/models/schemas.py`](file:///c:/Users/divya_y6vjlfl/OneDrive/Desktop/cafe_management/qr-system/app/models/schemas.py) and statuses in [`app/models/enums.py`](file:///c:/Users/divya_y6vjlfl/OneDrive/Desktop/cafe_management/qr-system/app/models/enums.py):

| Entity | Description |
| :--- | :--- |
| `Cafe` | Cafe identity, currency, address, tax rate (5%), service charge rate |
| `Table` | Table ID, number, capacity, permanent QR identifier, status |
| `QRCode` | Table ID, permanent URL, base64 PNG data URI |
| `TableSession` | Active dine-in session, joined customer IDs, order IDs, aggregated totals |
| `CustomerSession`| Anonymous customer ID, table ID, session ID, optional name & phone |
| `MenuCategory` | Category ID, name, icon, sort order, list of items |
| `MenuItem` | Item ID, name, description, price, is_veg, is_available, image, add-ons |
| `MenuAddon` | Add-on ID, name, price, availability |
| `Cart` & `CartItem` | Customer cart, server-calculated totals, selected add-ons, notes |
| `Order` & `OrderItem`| Confirmed order, order number, table number, status, payment ID |
| `Payment` | Payment ID, order ID, amount, status (`pending`, `success`, `failed`, `refunded`) |
| `TableRequest` | Call Waiter, Request Water, Request Assistance requests |
| `BillRequest` | Bill request with table session total amount |

Repositories in [`app/repositories/base.py`](file:///c:/Users/divya_y6vjlfl/OneDrive/Desktop/cafe_management/qr-system/app/repositories/base.py) allow plug-and-play migration to PostgreSQL/Supabase:
```python
class BaseOrderRepository(ABC):
    def get_order_by_id(self, order_id: str) -> Optional[Order]: ...
    def get_all_kitchen_orders(self) -> List[Order]: ...
    def save_order(self, order: Order) -> Order: ...
    def update_order_status(self, order_id: str, status: OrderStatus) -> Optional[Order]: ...
```

---

## 💳 Payment Abstraction & Simulation

Payment integrations inherit from [`PaymentProvider`](file:///c:/Users/divya_y6vjlfl/OneDrive/Desktop/cafe_management/qr-system/app/payments/provider.py):
```python
class PaymentProvider(ABC):
    def create_payment(self, table_id, session_id, customer_id, amount, ...): ...
    def check_payment_status(self, payment_id): ...
    def handle_payment_webhook(self, payload): ...
```
Implemented by [`MockPaymentProvider`](file:///c:/Users/divya_y6vjlfl/OneDrive/Desktop/cafe_management/qr-system/app/payments/mock_provider.py) supporting simulated outcomes without storing payment credentials.

---

## 🔌 API Reference

### Health & Tables
- `GET /health` — System health and cafe metadata
- `GET /tables/{table_id}` — Table information and current session status
- `GET /tables/{table_id}/menu` — Cafe branding and dynamic menu categories

### Sessions
- `POST /sessions` — Join or create an active table session for a customer
- `GET /sessions/{session_id}` — Table session details and aggregated orders

### Cart
- `GET /cart/{customer_id}` — Retrieve customer cart
- `POST /cart` — Add item to cart with server-side price & availability verification
- `PUT /cart/{id}` — Update item quantity or add-ons
- `DELETE /cart/{id}` — Remove item or clear cart (`?customer_id=...`)

### Payments
- `POST /payments/create` — Create payment intent (server calculates amount from cart)
- `POST /payments/webhook` — Simulated webhook receiver

### Orders
- `GET /orders/{id}` — Retrieve order details and live status
- `POST /orders` — Submit order after verified payment
- `PUT /orders/{id}/status` — Update order status

### Kitchen
- `GET /kitchen/orders` — List active orders for KDS
- `PUT /kitchen/orders/{id}/status` — Advance order status (`Preparing`, `Ready`, `Served`)

### Menu
- `PUT /menu/items/{id}/availability` — Dynamically toggle item availability

### Requests
- `GET /table-requests` — List table assistance requests
- `POST /table-requests` — Create waiter / water / help call
- `PUT /table-requests/{id}` — Update request status (`Acknowledged`, `Completed`)
- `GET /bill-requests` — List bill requests
- `POST /bill-requests` — Submit bill request
- `PUT /bill-requests/{id}` — Update bill status (`Preparing`, `Delivered`, `Completed`)

### QR Management
- `GET /qr/tables` — List all tables with permanent QR codes
- `POST /qr/generate` — Generate or regenerate permanent QR
- `GET /qr/{table_id}` — Get permanent QR for specific table

---

## 🧪 Automated Test Suite

A complete test suite in [`tests/test_qr_system.py`](file:///c:/Users/divya_y6vjlfl/OneDrive/Desktop/cafe_management/qr-system/tests/test_qr_system.py) validates all 20 required behaviors:

1. `test_01_qr_identifies_correct_table` — Table lookup by ID and table number
2. `test_02_permanent_qr_continues_working_after_menu_changes` — QR stability across menu updates
3. `test_03_customer_session_creation` — Session creation with anonymous customer
4. `test_04_multiple_customers_joining_same_table_session` — Multi-guest session sharing
5. `test_05_menu_retrieval` — Full menu retrieval with items, add-ons, and images
6. `test_06_cart_operations` — Add, update quantity, remove, and tax calculations
7. `test_07_availability_checking` — Rejection of unavailable items at cart addition
8. `test_08_successful_payment` — Payment creation with success simulation
9. `test_09_failed_payment` — Payment creation with failure simulation
10. `test_10_order_creation_after_successful_payment` — Order confirmation & cart clearing
11. `test_11_no_order_creation_after_failed_payment` — Strict order rejection on payment failure
12. `test_12_kitchen_order_creation` — Confirmed order dispatch to kitchen display
13. `test_13_kitchen_status_updates` — Progression: Preparing → Ready → Served
14. `test_14_item_availability_changes` — Kitchen toggle immediately alters customer menu
15. `test_15_waiter_request` — Waiter call creation, acknowledgment, and completion
16. `test_16_bill_request` — Bill request creation and lifecycle
17. `test_17_table_session_handling` — Multi-customer order aggregation under table session
18. `test_18_qr_generation` — Base64 QR generation and force regeneration
19. `test_19_price_validation` — Server-side authoritative price enforcement
20. `test_20_invalid_table_qr_handling` — 404 error handling for non-existent tables

To execute the test suite:
```bash
python -m pytest tests/test_qr_system.py -v
```

---

## 💻 Setup & Running Locally

### Prerequisites
- Python 3.10+
- `pip`

### 1. Installation
Navigate to the `qr-system` directory:
```bash
cd qr-system
python -m pip install -r requirements.txt
```

### 2. Start the Server
```bash
python run.py
```
Or with Uvicorn:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Open in Browser
- **Customer Menu (Table 7)**: [http://localhost:8000/table/table_7](http://localhost:8000/table/table_7)
- **Kitchen Display System (KDS)**: [http://localhost:8000/kitchen](http://localhost:8000/kitchen)
- **Admin QR & Table Management**: [http://localhost:8000/admin/qr](http://localhost:8000/admin/qr)
- **Interactive OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔮 Future Integration Architecture

The QR system is built as a modular subsystem that exposes clean REST interfaces. When connecting with the Cafe Admin Dashboard and real payment gateways:

```
┌────────────────────────────────┐
│      Cafe Admin Dashboard      │
└───────────────┬────────────────┘
                │ Webhooks / REST
                ▼
┌────────────────────────────────┐       ┌───────────────────────────┐
│        QR-System API           │ <───> │ Real Payment Provider     │
│   (Table Sessions & Orders)    │       │ (Razorpay / Stripe / etc) │
└───────────────┬────────────────┘       └───────────────────────────┘
                │ Database Repositories
                ▼
┌────────────────────────────────┐
│   PostgreSQL / Supabase DB     │
└────────────────────────────────┘
```
1. **Database Migration**: Implement `BaseOrderRepository`, `BaseMenuRepository`, etc., using SQLAlchemy or Supabase client without modifying business logic.
2. **Real Payment Gateway**: Create `RazorpayPaymentProvider` implementing `PaymentProvider` (`create_payment`, `check_payment_status`, `handle_payment_webhook`).
3. **Admin Dashboard Events**: Forward `Order` creation, table requests, and bill requests via webhook or queue to the central Cafe Admin Dashboard.

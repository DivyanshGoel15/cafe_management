# Brew & Co — Cafe Admin Dashboard

A commercial, production-quality Cafe Operations & Management SaaS Dashboard for cafe owners and staff. Built with high visual fidelity to the reference design language, featuring deep forest green tones (`#0B2018`), warm artisanal copper accents (`#B87333`), Inter typography, and a warm stone background.

---

## 🚀 Quick Start & Local Run

### Prerequisites
- Node.js (v18+ recommended, tested on Node v22.19.0)
- npm (v9+ recommended)

### 1. Installation
Clone or navigate to the project directory:
```bash
cd cafe-admin-dashboard
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your web browser.

### 3. Build for Production
To generate an optimized production bundle:
```bash
npm run build
```
The output will be generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 🔑 Authentication & Demo Access

The dashboard includes a full mock authentication layer with persistent session handling in `localStorage` and Role-Based Access Control (RBAC).

For instant testing, use the **⚡ Instant Demo Switcher** buttons on the login screen, or log in manually with the following credentials:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **👑 Owner** | `owner@brewandco.com` | `cafe123` | Full access across all 15 modules including Financials, Settings &amp; Staff |
| **👔 Manager** | `manager@brewandco.com` | `cafe123` | Operations, Orders, Bookings, Menu, CRM, Offers, Reviews, WhatsApp &amp; AI |
| **☕ Staff / Barista** | `staff@brewandco.com` | `cafe123` | Floor operations: Orders POS, Table status, Bookings &amp; In-stock toggles |

---

## 📋 Comprehensive Modules & Features

1. **🔐 Authentication**
   - Login with "Remember session", validation, loading states and error alerts
   - Instant Demo role switcher (Owner, Manager, Staff)
   - Forgot Password &amp; Reset Password simulation
   - Logout with confirmation modal

2. **📊 Overview Dashboard**
   - KPI metrics: Today's Revenue, Active Orders, Reservations, Table Occupancy
   - Interactive Chart.js charts: 7-day revenue trend line, category breakdown doughnut, weekly bookings bar
   - Live Operations banner &amp; Quick Action buttons (`+ New Order`, `+ New Booking`)
   - Real-time activity feed &amp; Recent orders preview

3. **🧭 Sidebar Navigation**
   - 15 module navigation links with icons &amp; live badge counters
   - Sidebar collapse mode toggle (icon-only rail)
   - Mobile responsive navigation with slide-in drawer and overlay backdrop
   - User profile section with avatar initials, role badge &amp; quick sign-out

4. **🛍️ Orders Management (POS)**
   - Search orders by ID, guest name or ordered items
   - Status filters: All, Pending, Confirmed, Preparing, Ready, Completed, Cancelled
   - Order type filter: Dine-in, Takeaway, Delivery
   - Slide-out Order Details panel with live 5-step status progression
   - Financial breakdown: Subtotal, 5% GST, Service charge, Discounts, Total
   - Actions: Confirm, Send to Kitchen, Mark Ready, Mark Delivered, Cancel Order, Print Receipt / KOT

5. **🪑 Table & Floor Management**
   - Visual floor plan layout with cards categorized by zone (Main Dining, Patio &amp; Garden, Lounge, Bar)
   - Live occupancy stats: Available, Occupied, Reserved, Cleaning
   - Instant status selector on each table card with customer notes
   - Add Table, Edit Table, and Delete Table modals

6. **📅 Reservations & Bookings**
   - Calendar View and List View switcher
   - Filter by: All, Today, Upcoming, Pending Action, Confirmed, Cancelled
   - Prominent "Today's Reservations" summary banner
   - Table assignment selector (assigns table to guest)
   - Booking Details modal: Confirm, Seat Guests, Complete, Cancel
   - `+ New Booking` modal

7. **☕ Menu Management**
   - Category filtering: Coffee, Starters, Main Course, Desserts, Beverages
   - Dietary filter: 🟢 Vegetarian and 🔴 Non-Vegetarian indicators
   - Instant In-Stock / Out-of-Stock toggle switch with persistent state
   - `+ Add Item` and `Edit Item` modals with preparation time &amp; bestseller tags

8. **👥 Customer CRM**
    - Customer CRM list with lifetime spend, orders count, and segment badges (VIP, Regular, New, At Risk)
    - Slide-out CRM Profile drawer:
      - Crystal clear view without any dimming or black overlay screen
      - Lifetime metrics &amp; average cart value
      - Editable staff notes and preferences (saved to `localStorage`)
      - Past order history with itemized details
      - Reservation history
      - Direct WhatsApp action

9. **👔 Staff & Permissions Management**
    - Staff directory with shift schedules, roles &amp; last active timestamps
    - `+ Add Staff` and `Edit Staff` modals
    - **🔐 Interactive Role Permissions Editor**:
      - Master Admin Owner access
      - Owner can toggle and save module permissions for **Manager** and **Staff**
      - Instant live synchronization with sidebar navigation and route enforcement
      - Reset to Recommended Defaults option

10. **📈 Analytics & Business Intelligence**
    - Multi-timeframe filters: Today, Last 7 Days, Last 30 Days, Last 3 Months
    - Dynamically re-rendering Chart.js visualizations:
      - Sales &amp; Revenue trajectory
      - Hourly Peak Hours distribution (8 AM - 10 PM)
      - Top 5 best-selling menu items (horizontal bar)
      - Order channels breakdown (Dine-in vs Takeaway vs Delivery)
    - Operational KPIs: Table turnover time, cancellation rate, food waste rate

11. **🎟️ Offers & Promotions**
    - Active, Scheduled, and Expired promotion tabs
    - Coupon cards with coupon codes, discount percentage/flat rules, and validity range
    - Interactive usage progress bars
    - One-click "Copy Code" with clipboard support
    - `+ Create Offer` modal

12. **⭐ Reviews & Reputation**
    - Overall rating breakdown card (4.8 / 5.0 with 5-star distribution bars)
    - Review cards across Google Maps, WhatsApp, and Table QR sources
    - Reply modal with pre-configured quick AI-suggested response templates
    - Mark as handled toggle

13. **💬 WhatsApp Automation & Live Bot Simulator**
    - Meta WhatsApp Cloud API connection status and webhook health checker
    - Inbound/outbound message delivery &amp; read statistics
    - Pre-approved Meta Message Templates catalog with `+ New Template` modal
    - Scheduled broadcast campaigns list
    - **📱 Interactive WhatsApp Phone Simulator**:
      - Live mobile phone UI with instant reply stream
      - Quick test prompt chips (`☕ View Menu`, `📅 Book Table`, `🍕 Place Order`, `🔍 Order Status`, `⭐ Feedback`)
      - AI Intent Router that parses inquiries and creates real bookings/orders in state!

14. **🎙️ AI Voice Calling Concierge**
    - Inbound telephony agent status banner (`+91 80 4000 1234`)
    - Call conversion metrics &amp; average call duration
    - Inbound call history with intent tags and duration
    - **Call Recording & Transcript Modal**: Plays simulated audio playback and displays bilingual transcripts
    - **Voice Agent Configuration**: Choose voice model (Aadhya, Kabir, Priya), opening greeting, business hours, and human escalation rules

15. **📱 Table QR Orders & Static QR Management**
    - Designed specifically for physical cafes with permanent acrylic QR standees on tables
    - Clean table cards showing Zone, Online Ordering Status (🟢 Online / ⏸️ Paused), and permanent static URLs (`brewandco.cafe/order?table=T1`)
    - 1-click **📋 Copy Static Link** button
    - **📱 Preview Customer Order Page**: Interactive modal displaying what customers see when scanning that table's static QR standee
    - Real-time ordering toggles: Pause or resume online ordering per table
    - Live counters: Today's Scans, Orders Placed, and Digital Table Revenue

16. **🔔 Notification Center**
    - Topbar notification bell with unread badge counter
    - Dedicated full notification center page
    - Category filters: Orders, Bookings, Stock/Inventory, Customer, System
    - Mark as Read and Mark All Read actions
    - Click any notification to navigate directly to the relevant view

17. **⚙️ Settings & Cafe Configuration**
    - **Business Profile**: Cafe name, logo, address, phone, email, FSSAI license, opening hours, social links
    - **Restaurant Rules & Taxes**: GST tax rate (5%), Service charge, turnover time, auto-confirm bookings toggle
    - **Notification Preferences**: Sound chime toggle, WhatsApp alerts, daily email digest

---

## 🏗️ Technical Architecture & Design System

```
cafe-admin-dashboard/
├── index.html                  # Single Page Application shell
├── package.json                # Vite configuration & npm scripts
├── README.md                   # Documentation & setup guide
├── CAFE_CRM_Dashboard.html     # Preserved original reference design
├── css/
│   ├── main.css                # CSS variables, typography & design tokens
│   ├── layout.css              # Sidebar, topbar, mobile drawer & shell
│   ├── components.css          # Buttons, badges, modals, drawers, toasts & tables
│   ├── pages.css               # Floor plan, WhatsApp phone, QR cards & CRM drawer
│   └── responsive.css          # Tablet & mobile media queries
├── js/
│   ├── app.js                  # Main app bootstrapper & global event listeners
│   ├── store.js                # Centralized state management & LocalStorage persistence
│   ├── auth.js                 # Authentication service & RBAC permissions
│   ├── router.js               # Client-side router handling all 15 routes
│   ├── charts.js               # Chart.js initialization & dynamic updates
│   ├── components/
│   │   ├── toast.js            # Toast notifications manager
│   │   ├── modal.js            # Modal & slide drawer controller
│   │   └── qrCodeGenerator.js  # HTML5 Canvas QR code generator
│   └── pages/                  # 15 modular page view renderers
│       ├── dashboardView.js
│       ├── ordersView.js
│       ├── bookingsView.js
│       ├── tablesView.js
│       ├── menuView.js
│       ├── customersView.js
│       ├── staffView.js
│       ├── analyticsView.js
│       ├── offersView.js
│       ├── reviewsView.js
│       ├── whatsappView.js
│       ├── aiCallingView.js
│       ├── qrView.js
│       ├── notificationsView.js
│       └── settingsView.js
```

### Design Tokens
- **Sidebar**: `#0B2018` (Deep Forest Green)
- **Accent**: `#B87333` (Artisanal Copper)
- **Accent Light**: `#D4944A` (Amber)
- **Background**: `#F2F1EE` (Warm Stone / Paper)
- **Card**: `#FFFFFF`
- **Border**: `#E4E2DE`
- **Typography**: Inter (Google Fonts)

---

## 📱 Responsive Layouts
- **Desktop (>= 1200px)**: Full dual-pane layout, 236px sidebar, 4-column metric cards, side-by-side charts.
- **Laptop & Tablet (768px - 1199px)**: Collapsible sidebar, 2-column metric cards, responsive drawers.
- **Mobile (<= 768px)**: Hamburger topbar, touch-friendly slide-out navigation drawer with backdrop, single column stacked cards, touch-optimized tap targets.

---

## 📄 License
Private commercial software for Brew & Co Cafe operations. All rights reserved.

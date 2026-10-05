# Cafe Aroma — Customer Website

A commercial, production-quality, mobile-first customer-facing website for **Cafe Aroma** (located at 12 Heritage Lane, Connaught Place, New Delhi). Built as an independent, deployable web product that can be sold directly to cafe owners and seamlessly connects with cafe operations, WhatsApp automation, and QR dine-in ordering systems.

---

## 🎨 Visual Identity & Source of Truth

Preserves the visual design language of the cafe management ecosystem:

- **Deep Forest Green** (`#0B2018`): Primary background for hero, footer, and brand accents.
- **Artisanal Burnished Copper** (`#B87333`): Warm metallic accents, primary action buttons, borders, and badges.
- **Amber Gold Highlight** (`#D4944A`): Subtle glow and secondary highlights.
- **Warm Stone / Cafe Paper** (`#F7F6F2` / `#EFECE6`): Soft organic background for readability and tactile cafe ambience.
- **Pure Charcoal** (`#191B18`): High-contrast, accessible typography.
- **Typography**: Google Fonts [`Inter`](https://fonts.google.com/specimen/Inter) for clean, functional UI paired with [`Playfair Display`](https://fonts.google.com/specimen/Playfair+Display) for editorial headings and artisanal taglines.

---

## 🚀 Quick Start & Local Run

### Prerequisites
- Node.js (v18+ recommended, tested on Node v22.19.0)
- npm (v9+ recommended)

### 1. Installation
```bash
cd customer-website
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Run Automated Tests
```bash
npm test
```
Executes the test suite with 29 automated tests covering business hours, menu filtering, search, dietary toggles, booking availability calculations, reservation creation, contact validation, and QR table resolution.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized bundle in `dist/`.

To preview the production build:
```bash
npm run preview
```

---

## 📑 Pages & Routes Architecture

| Route | Page | Purpose & Features |
| :--- | :--- | :--- |
| `#/` | **Home** | Hero with brand statement & CTAs, live opening status, category cards, featured dishes, signature tasting spotlight, offers preview, why choose us, cafe experience, customer reviews, hours, location, and table reservation CTA. |
| `#/menu` | **Menu** | 25+ items across 6 categories, live search, pure veg / non-veg dietary toggle, sorting (popular, rating, price), in-stock filters, unavailable items handling, and click-to-customize. |
| `#/menu/:itemId` | **Item Details** | Deep-linkable modal/view showing high-res imagery, ingredients breakdown, allergens, prep time, calories, interactive add-on selection with dynamic total calculation, and taste reservation CTA. |
| `#/about` | **Our Story** | Heritage narrative (founded 2018 in Connaught Place), single-estate coffee sourcing from Chikmagalur, 36-hour sourdough fermentation philosophy, culinary team profiles, and brand values. |
| `#/offers` | **Offers & Vouchers** | 6 active promotional vouchers (Morning Rush, Pizza Duo, Weekend High-Tea, Remote Work Perk, Celebration Dessert, Student Discount), one-click coupon copier, terms & conditions toggle, and expired archive tab. |
| `#/gallery` | **Photo Gallery** | 16 curated photography items across coffee brewing, food, ambience, and jazz events, responsive grid with full-screen interactive Lightbox (keyboard navigation, next/prev, zoom). |
| `#/reservations` | **Table Booking** | 4-step reservation flow: party size, date picker, time slot selector, seating area preference, guest details, occasion tag, promo code, and realistic mock availability engine. |
| `#/booking-confirmation` | **Booking Status** | Confirmed reservation details, booking ID (e.g. `BK-82914`), table assignment, Google Calendar & `.ics` file download, directions, modify booking, cancel booking, and booking lookup tool. |
| `#/contact` | **Contact & Location** | Full address, phone, email, live dynamic "Open Now" schedule, Google Maps interactive directions card, validated contact inquiry form, and FAQ accordion. |
| `#/table/:tableId` | **QR Dine-In Gateway** | Dedicated entry point for table QR scans (e.g. `#/table/7`). Shows "Welcome to Cafe Aroma — Table 7", area, capacity, "View Menu & Order" CTA, and waiter call assistance. |
| `#/privacy` | **Privacy Policy** | Comprehensive customer data handling and confidentiality terms. |
| `#/terms` | **Terms of Service** | Table reservation hold policies, allergen notices, and cancellation terms. |
| `*` | **404 Page** | Graceful fallback view with helpful navigation options. |

---

## 🏛️ Data Architecture & Service Layer

All mock data is centralized and accessed through asynchronous Service Interfaces simulating real backend API responses with `Promise` latency:

```
js/
├── data/
│   └── cafeData.js             # Cafe profile, 25+ menu items, 6 offers, 10 reviews, 16 gallery items, tables
├── services/
│   ├── cafeService.js          # getCafe(), getHours(), isOpenNow()
│   ├── menuService.js          # getCategories(), getItems(), getItemById(), getFeaturedItems()
│   ├── offersService.js        # getOffers(), getOfferByCode()
│   ├── reviewsService.js       # getReviews(), getReviewStats(), addReview()
│   ├── bookingService.js       # checkAvailability(), createBooking(), getBooking(), updateBooking(), cancelBooking()
│   ├── contactService.js       # submitContact()
│   └── tableService.js         # getTableInfo() (QR parameter normalization & table matching)
├── components/
│   ├── Navbar.js               # Frosted glass header, active routes, status badge, mobile toggle
│   ├── MobileDrawer.js         # Off-canvas sliding drawer for mobile screens
│   ├── Footer.js               # Rich brand footer, operating hours, social links, newsletter
│   ├── ItemDetailModal.js      # Modal for item customizations, allergens & dynamic price total
│   ├── Lightbox.js             # Fullscreen image viewer with keyboard navigation
│   └── Toast.js                # Floating user notification system
├── pages/
│   ├── HomePage.js
│   ├── MenuPage.js
│   ├── AboutPage.js
│   ├── OffersPage.js
│   ├── GalleryPage.js
│   ├── ReservationsPage.js
│   ├── ConfirmationPage.js
│   ├── ContactPage.js
│   ├── TableDineInPage.js
│   ├── PrivacyPage.js
│   ├── TermsPage.js
│   └── NotFoundPage.js
├── router.js                   # Client-side router with SEO title/meta updates
└── app.js                      # Application bootstrap & event orchestration
```

---

## 🔍 SEO & Accessibility Foundations

- **Dynamic Head Metadata**: Document title and meta description dynamically updated on route changes.
- **LocalBusiness Schema (JSON-LD)**: Structured data for `CafeOrCoffeeShop` in `index.html` (geo coordinates, address, opening hours, price range, cuisine types).
- **OpenGraph & Twitter Cards**: High-resolution social share cards.
- **Accessibility**: Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`), visible focus rings, ARIA dialog roles, and skip-to-content links.

---

## 📱 Mobile-First Responsive Design

- Breakpoints configured in `css/responsive.css` (`1024px`, `768px`, `480px`).
- Touch-friendly tap targets (minimum 44px height).
- Sticky bottom mobile action bar for one-tap booking and menu browsing.
- Fast lazy-loaded images with smooth CSS transitions.

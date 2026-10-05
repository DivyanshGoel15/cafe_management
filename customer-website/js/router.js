/**
 * Client-Side Router
 * Supports hash-based and direct path routing, dynamic parameter extraction,
 * SEO document title/meta updates, and scroll management.
 */
import { renderHomePage } from './pages/HomePage.js';
import { renderMenuPage } from './pages/MenuPage.js';
import { renderAboutPage } from './pages/AboutPage.js';
import { renderOffersPage } from './pages/OffersPage.js';
import { renderGalleryPage } from './pages/GalleryPage.js';
import { renderReservationsPage } from './pages/ReservationsPage.js';
import { renderConfirmationPage } from './pages/ConfirmationPage.js';
import { renderContactPage } from './pages/ContactPage.js';
import { renderTableDineInPage } from './pages/TableDineInPage.js';
import { renderPrivacyPage } from './pages/PrivacyPage.js';
import { renderTermsPage } from './pages/TermsPage.js';
import { renderNotFoundPage } from './pages/NotFoundPage.js';
import { updateActiveNavLink } from './components/Navbar.js';
import { CAFE_INFO } from './data/cafeData.js';

// Route definitions for client-side routing

const routes = [
  {
    path: '/',
    handler: renderHomePage,
    title: `${CAFE_INFO.name} — Artisanal Coffee & Sourdough Kitchen | Connaught Place, New Delhi`,
    description: `Experience ${CAFE_INFO.name} in Connaught Place. Single-origin specialty coffee, 36-hour slow fermented sourdough, botanical patio and warm hospitality.`
  },
  {
    path: '/menu',
    handler: renderMenuPage,
    title: `Menu — Artisanal Brews, Sourdough Pizzas & Plates | ${CAFE_INFO.name}`,
    description: `Browse the complete food and specialty coffee menu of ${CAFE_INFO.name}. Check dietary allergens, customize add-ons, and order in cafe.`
  },
  {
    path: '/menu/:itemId',
    handler: async (params) => {
      // Renders menu page and auto-triggers item modal
      const html = await renderMenuPage(params);
      setTimeout(() => {
        if (typeof window.openItemModal === 'function') {
          window.openItemModal(params.itemId);
        }
      }, 100);
      return html;
    },
    title: `Menu Item Details | ${CAFE_INFO.name}`,
    description: `Details, ingredients and customizations for our handcrafted creations at ${CAFE_INFO.name}.`
  },
  {
    path: '/about',
    handler: renderAboutPage,
    title: `Our Story, Roastery & Heritage | ${CAFE_INFO.name}`,
    description: `Learn how ${CAFE_INFO.name} was founded in 2018. Explore our single-estate coffee sourcing from Chikmagalur and sourdough philosophy.`
  },
  {
    path: '/offers',
    handler: renderOffersPage,
    title: `Offers, Discounts & Vouchers | ${CAFE_INFO.name}`,
    description: `Exclusive promotions, coffee rush vouchers, student discounts and celebration deals at ${CAFE_INFO.name}.`
  },
  {
    path: '/gallery',
    handler: renderGalleryPage,
    title: `Atmosphere & Photography Gallery | ${CAFE_INFO.name}`,
    description: `Explore photos of our sunlit botanical courtyard, brass espresso bar, artisan pizzas and Friday acoustic jazz nights.`
  },
  {
    path: '/reservations',
    handler: renderReservationsPage,
    title: `Book a Table Online | ${CAFE_INFO.name}`,
    description: `Reserve a table at ${CAFE_INFO.name} with real-time seat availability, instant confirmation, and zero booking fee.`
  },
  {
    path: '/booking-confirmation',
    handler: renderConfirmationPage,
    title: `Reservation Status & Lookup | ${CAFE_INFO.name}`,
    description: `Check table booking confirmation details, add to calendar, modify or cancel reservations at ${CAFE_INFO.name}.`
  },
  {
    path: '/contact',
    handler: renderContactPage,
    title: `Location, Opening Hours & Contact | ${CAFE_INFO.name}`,
    description: `Visit ${CAFE_INFO.name} at 12 Heritage Lane, Connaught Place, New Delhi. Opening hours, directions, and event inquiries.`
  },
  {
    path: '/table/:tableId',
    handler: renderTableDineInPage,
    title: `Table Dine-In Ordering | ${CAFE_INFO.name}`,
    description: `Welcome to ${CAFE_INFO.name} Dine-In. Browse our digital menu and order right from your seat.`
  },
  {
    path: '/privacy',
    handler: renderPrivacyPage,
    title: `Privacy Policy | ${CAFE_INFO.name}`,
    description: `Privacy guidelines and customer data policies for ${CAFE_INFO.name}.`
  },
  {
    path: '/terms',
    handler: renderTermsPage,
    title: `Terms & Conditions | ${CAFE_INFO.name}`,
    description: `Terms and conditions governing table reservations and service at ${CAFE_INFO.name}.`
  }
];

class Router {
  constructor() {
    this.compiledRoutes = routes.map(r => this.compileRoute(r));
    this.appContainer = null;
  }

  compileRoute(route) {
    const paramNames = [];
    const patternStr = '^' + route.path.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    }) + '$';

    return {
      pattern: new RegExp(patternStr),
      paramNames,
      handler: route.handler,
      title: route.title,
      description: route.description,
      rawPath: route.path
    };
  }

  init(containerId = 'app-content') {
    this.appContainer = document.getElementById(containerId);

    // Support direct path /table/:id if someone hits it via pathname
    if (window.location.pathname.startsWith('/table/')) {
      const tableId = window.location.pathname.replace('/table/', '');
      window.location.hash = `#/table/${tableId}`;
    }

    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRoute());

    // Initial route handling
    this.handleRoute();
  }

  getCurrentPath() {
    const rawHash = window.location.hash.slice(1); // remove '#'
    if (!rawHash || rawHash === '') return '/';
    return rawHash.split('?')[0] || '/';
  }

  async handleRoute() {
    if (!this.appContainer) return;

    const currentPath = this.getCurrentPath();
    let matched = null;
    let params = {};

    for (const route of this.compiledRoutes) {
      const match = currentPath.match(route.pattern);
      if (match) {
        matched = route;
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        break;
      }
    }

    // Update active nav links
    updateActiveNavLink(currentPath);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Show smooth loading state if needed
    this.appContainer.innerHTML = `
      <div style="min-height:50vh; display:flex; align-items:center; justify-content:center;">
        <div class="spinner spinner-copper" style="width:36px; height:36px;"></div>
      </div>
    `;

    try {
      if (matched) {
        // SEO metadata updates
        document.title = matched.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', matched.description);

        const html = await matched.handler(params);
        this.appContainer.innerHTML = html;
      } else {
        document.title = `404 Page Not Found | ${CAFE_INFO.name}`;
        const html = await renderNotFoundPage();
        this.appContainer.innerHTML = html;
      }
    } catch (err) {
      console.error('Route handler error:', err);
      this.appContainer.innerHTML = `
        <div class="container section text-center">
          <div class="card" style="padding:40px; max-width:600px; margin:0 auto;">
            <h3 style="color:var(--nonveg-red); margin-bottom:12px;">Failed to load view</h3>
            <p style="color:var(--text-secondary); margin-bottom:20px;">${err.message || 'An unexpected error occurred.'}</p>
            <a href="#/" class="btn btn-primary">Return to Home</a>
          </div>
        </div>
      `;
    }
  }
}

export const router = new Router();

/* ══════════════════════════════════════════════════════════════
   BREW & CO — CLIENT-SIDE ROUTER & VIEW ORCHESTRATOR
   Protected routes, permission checks & view lifecycle
   ══════════════════════════════════════════════════════════════ */

import { auth } from './auth.js';
import { toast } from './components/toast.js';

import { renderDashboard } from './pages/dashboardView.js';
import { renderOrders } from './pages/ordersView.js';
import { renderBookings } from './pages/bookingsView.js';
import { renderTables } from './pages/tablesView.js';
import { renderMenu } from './pages/menuView.js';
import { renderCustomers } from './pages/customersView.js';
import { renderStaff } from './pages/staffView.js';
import { renderAnalytics } from './pages/analyticsView.js';
import { renderOffers } from './pages/offersView.js';
import { renderReviews } from './pages/reviewsView.js';
import { renderWhatsApp } from './pages/whatsappView.js';
import { renderAiCalling } from './pages/aiCallingView.js';
import { renderQR } from './pages/qrView.js';
import { renderNotifications } from './pages/notificationsView.js';
import { renderSettings } from './pages/settingsView.js';

const ROUTE_CONFIG = {
  dashboard: { title: 'Dashboard', render: renderDashboard, module: 'dashboard' },
  orders: { title: 'Orders Management', render: renderOrders, module: 'orders' },
  bookings: { title: 'Reservations & Bookings', render: renderBookings, module: 'bookings' },
  tables: { title: 'Table Floor Management', render: renderTables, module: 'tables' },
  menu: { title: 'Menu & Stock Catalog', render: renderMenu, module: 'menu' },
  customers: { title: 'Customer CRM', render: renderCustomers, module: 'customers' },
  staff: { title: 'Staff & Roles Management', render: renderStaff, module: 'staff' },
  analytics: { title: 'Analytics & Financials', render: renderAnalytics, module: 'analytics' },
  offers: { title: 'Offers & Promotions', render: renderOffers, module: 'offers' },
  reviews: { title: 'Reviews & Reputation', render: renderReviews, module: 'reviews' },
  whatsapp: { title: 'WhatsApp Hub & Live Bot', render: renderWhatsApp, module: 'whatsapp' },
  'ai-calling': { title: 'AI Voice Calling Concierge', render: renderAiCalling, module: 'ai-calling' },
  'qr-system': { title: 'Table QR Orders', render: renderQR, module: 'qr-system' },
  notifications: { title: 'Notification Center', render: renderNotifications, module: 'notifications' },
  settings: { title: 'Settings & Configuration', render: renderSettings, module: 'settings' }
};

export class Router {
  constructor() {
    this.currentRoute = 'dashboard';
    window.addEventListener('popstate', () => {
      this.handleHashChange();
    });
  }

  init() {
    this.handleHashChange();
  }

  handleHashChange() {
    const hash = window.location.hash.replace('#/', '').replace('#', '') || 'dashboard';
    this.navigate(hash, false);
  }

  navigate(routeName, updateHash = true) {
    if (!auth.isAuthenticated()) {
      window.showAuthModal();
      return;
    }

    const route = ROUTE_CONFIG[routeName] || ROUTE_CONFIG['dashboard'];
    const finalRouteName = ROUTE_CONFIG[routeName] ? routeName : 'dashboard';

    // RBAC Permission Check
    if (!auth.hasPermission(route.module, 'view')) {
      toast.error(`Access Restricted: Your current role (${auth.getCurrentUser().role}) does not have permission to view ${route.title}.`);
      this.renderAccessDenied(route.title);
      return;
    }

    this.currentRoute = finalRouteName;
    if (updateHash) {
      window.location.hash = `#/${finalRouteName}`;
    }

    // Hide all views
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });

    // Show current view container
    const viewEl = document.getElementById(`view-${finalRouteName}`);
    if (viewEl) {
      viewEl.classList.add('active');
    }

    // Update Topbar Title
    const titleEl = document.getElementById('topbar-page-title');
    if (titleEl) {
      titleEl.textContent = route.title;
    }

    // Update Sidebar Active state
    document.querySelectorAll('.sb-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.route === finalRouteName) {
        item.classList.add('active');
      }
    });

    // Close Mobile Drawer if open
    window.closeMobileSidebar();

    // Call page renderer
    try {
      route.render();
    } catch (err) {
      console.error(`Error rendering route ${finalRouteName}:`, err);
    }

    // Scroll to top of content
    const content = document.getElementById('main-content');
    if (content) content.scrollTop = 0;
  }

  renderAccessDenied(moduleTitle) {
    const user = auth.getCurrentUser();
    // Hide all views
    document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active'));

    let deniedEl = document.getElementById('view-access-denied');
    if (!deniedEl) {
      deniedEl = document.createElement('div');
      deniedEl.id = 'view-access-denied';
      deniedEl.className = 'page-view';
      document.getElementById('main-content').appendChild(deniedEl);
    }

    deniedEl.classList.add('active');
    deniedEl.innerHTML = `
      <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:44px 24px; text-align:center; max-width:560px; margin:40px auto; box-shadow:var(--shadow-sm);">
        <div style="width:64px; height:64px; border-radius:50%; background:var(--red-bg); color:var(--red); font-size:32px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">
          🔒
        </div>
        <div style="font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px;">Access Restricted</div>
        <p style="font-size:13.5px; color:var(--muted); line-height:1.5; margin-bottom:20px;">
          You are currently signed in as <strong>${user.name}</strong> with role <span class="badge badge-purple">${user.role}</span>.
          Access to <strong>${moduleTitle}</strong> requires Owner or Manager clearance.
        </p>
        <div style="display:flex; justify-content:center; gap:10px;">
          <button class="btn btn-outline btn-sm" onclick="window.router.navigate('dashboard')">&larr; Return to Dashboard</button>
          <button class="btn btn-primary btn-sm" onclick="window.auth.loginAs('Owner').then(() => window.router.navigate('${this.currentRoute}'))">Switch to Owner Role (Demo)</button>
        </div>
      </div>
    `;

    document.getElementById('topbar-page-title').textContent = 'Access Restricted';
  }
}

export const router = new Router();
window.router = router;

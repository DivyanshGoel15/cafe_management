/* ══════════════════════════════════════════════════════════════
   BREW & CO — MAIN APPLICATION BOOTSTRAPPER (app.js)
   Integrated with Hub Command Center (modules.config.json)
   ══════════════════════════════════════════════════════════════ */

import { store } from './store.js';
import { auth } from './auth.js';
import { router } from './router.js';
import { toast } from './components/toast.js';
import { modal } from './components/modal.js';
import { initModuleConfig, applyModuleVisibility, fetchModuleConfig } from './moduleConfig.js';

// Expose services globally for HTML inline handlers
window.store = store;
window.auth = auth;
window.toast = toast;
window.modal = modal;

// ── CLOCK ──
function startClock() {
  const clockEl = document.getElementById('topbar-clock');
  function tick() {
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = 
      now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
      now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
  tick();
  setInterval(tick, 20000);
}

// ── SIDEBAR CONTROLS ──
window.toggleSidebarCollapse = () => {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
  }
};

window.openMobileSidebar = () => {
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('mobile-sidebar-backdrop');
  if (sidebar) sidebar.classList.add('mobile-open');
  if (backdrop) backdrop.classList.add('show');
};

window.closeMobileSidebar = () => {
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('mobile-sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (backdrop) backdrop.classList.remove('show');
};

// ── BADGES & SYNC ──
window.updateNotificationBadge = () => {
  const state = store.getState();
  const unreadNotifs = state.notifications.filter(n => !n.read).length;
  const badgeEl = document.getElementById('notif-badge-counter');
  if (badgeEl) {
    badgeEl.textContent = unreadNotifs;
    badgeEl.style.display = unreadNotifs > 0 ? 'inline-block' : 'none';
  }

  // Sidebar badge for orders
  const pendingOrders = state.orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length;
  const sbOrderBadge = document.getElementById('sb-badge-orders');
  if (sbOrderBadge) {
    sbOrderBadge.textContent = pendingOrders;
    sbOrderBadge.style.display = pendingOrders > 0 ? 'inline-block' : 'none';
  }

  // Sidebar badge for bookings
  const pendingBookings = state.bookings.filter(b => b.status === 'Pending').length;
  const sbBookBadge = document.getElementById('sb-badge-bookings');
  if (sbBookBadge) {
    sbBookBadge.textContent = pendingBookings;
    sbBookBadge.style.display = pendingBookings > 0 ? 'inline-block' : 'none';
  }
};

// ── DYNAMIC ROLE-BASED SIDEBAR VISIBILITY ──
// Now also respects hub module toggles from modules.config.json
export async function updateSidebarVisibility() {
  const user = auth.getCurrentUser();
  if (!user) return;

  // Filter sidebar navigation items based on active role permissions
  document.querySelectorAll('.sb-item[data-route]').forEach(item => {
    const route = item.getAttribute('data-route');
    const allowed = auth.hasPermission(route, 'view');
    item.style.display = allowed ? 'flex' : 'none';
  });

  // Apply hub module config on top of RBAC (disable toggled-off modules)
  try {
    const hubConfig = await fetchModuleConfig();
    if (hubConfig) {
      applyModuleVisibility(hubConfig);
    }
  } catch (e) {
    // Hub not running — silently continue with all modules visible
  }

  // Filter sidebar section headers if all child items are hidden
  document.querySelectorAll('.sb-nav-wrap .sb-section-label').forEach(label => {
    let next = label.nextElementSibling;
    let hasVisibleItem = false;
    while (next && !next.classList.contains('sb-section-label')) {
      if (next.classList.contains('sb-item') && next.style.display !== 'none') {
        hasVisibleItem = true;
        break;
      }
      next = next.nextElementSibling;
    }
    label.style.display = hasVisibleItem ? 'block' : 'none';
  });

  // If current route is forbidden for the active role, redirect to first allowed route
  if (router.currentRoute && !auth.hasPermission(router.currentRoute, 'view')) {
    const fallbackList = ['dashboard', 'orders', 'bookings', 'tables', 'menu', 'notifications'];
    const target = fallbackList.find(r => auth.hasPermission(r, 'view')) || 'orders';
    router.navigate(target);
  }
}
window.updateSidebarVisibility = updateSidebarVisibility;

// ── USER PROFILE DISPLAY ──
function updateUserProfileUI() {
  const user = auth.getCurrentUser();
  const nameEl = document.getElementById('sb-user-name');
  const roleEl = document.getElementById('sb-user-role');
  const avaEl = document.getElementById('sb-user-avatar');
  const topbarRoleSelect = document.getElementById('topbar-role-select');

  if (user) {
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = `${user.role} Account`;
    if (avaEl) avaEl.textContent = user.avatarInitials || 'AS';
    if (topbarRoleSelect) topbarRoleSelect.value = user.role;
  }

  updateSidebarVisibility();
}

// ── AUTHENTICATION MODAL & LOGOUT ──
window.showAuthModal = () => {
  const authWrapper = document.getElementById('auth-screen');
  if (authWrapper) {
    authWrapper.style.display = 'flex';
  }
};

window.hideAuthModal = () => {
  const authWrapper = document.getElementById('auth-screen');
  if (authWrapper) {
    authWrapper.style.display = 'none';
  }
};

window.handleLoginSubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const remember = document.getElementById('login-remember').checked;
  const errEl = document.getElementById('login-error-msg');
  const btn = document.getElementById('btn-login-submit');

  errEl.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Verifying credentials...';

  try {
    const session = await auth.login(email, password, remember);
    toast.success(`Welcome back, ${session.name}! Logged in as ${session.role}.`);
    window.hideAuthModal();
    updateUserProfileUI();
    router.navigate(router.currentRoute || 'dashboard');
  } catch (err) {
    errEl.textContent = err.message || 'Login failed. Please check credentials.';
    errEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In to Dashboard';
  }
};

window.quickLoginAs = async (role) => {
  const session = await auth.loginAs(role);
  toast.success(`Switched role to: ${session.name} (${session.role})`);
  window.hideAuthModal();
  updateUserProfileUI();
  router.navigate(router.currentRoute || 'dashboard');
};

window.handleLogout = () => {
  modal.confirm({
    title: 'Sign Out',
    message: 'Are you sure you want to end your dashboard session?',
    confirmText: 'Sign Out',
    isDanger: true,
    onConfirm: async () => {
      await auth.logout();
      toast.info('You have signed out successfully.');
      window.showAuthModal();
    }
  });
};

// Forgot Password Flow
window.openForgotPasswordModal = () => {
  let modalEl = document.getElementById('modal-forgot-password');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-forgot-password';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Password Recovery</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-forgot-password')">✕</button>
      </div>
      <form onsubmit="window.submitForgotPassword(event)">
        <div class="modal-body">
          <p style="font-size:13px; color:var(--muted); margin-bottom:14px;">
            Enter your registered admin or staff email address. We will dispatch a password reset authorization code.
          </p>
          <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input type="email" class="form-input" id="forgot-email" required placeholder="e.g. manager@brewandco.com">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-forgot-password')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Send Reset Instructions</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-forgot-password');
};

window.submitForgotPassword = async (e) => {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value.trim();
  try {
    const res = await auth.forgotPassword(email);
    modal.close('modal-forgot-password');
    toast.success(res.message);
    window.openResetPasswordModal(email);
  } catch (err) {
    toast.error(err.message);
  }
};

window.openResetPasswordModal = (email) => {
  let modalEl = document.getElementById('modal-reset-password');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-reset-password';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Set New Password</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-reset-password')">✕</button>
      </div>
      <form onsubmit="window.submitResetPassword(event, '${email}')">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Reset Authorization Token *</label>
            <input type="text" class="form-input" id="reset-token" required value="CAFE-RESET-2026">
          </div>
          <div class="form-group">
            <label class="form-label">New Password *</label>
            <input type="password" class="form-input" id="reset-new-pass" required placeholder="At least 6 characters">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-reset-password')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save New Password</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-reset-password');
};

window.submitResetPassword = async (e, email) => {
  e.preventDefault();
  const token = document.getElementById('reset-token').value.trim();
  const newPass = document.getElementById('reset-new-pass').value;

  try {
    const res = await auth.resetPassword(email, token, newPass);
    modal.close('modal-reset-password');
    toast.success(res.message);
  } catch (err) {
    toast.error(err.message);
  }
};

// ── APP INITIALIZATION ──
document.addEventListener('DOMContentLoaded', async () => {
  startClock();
  updateUserProfileUI();
  window.updateNotificationBadge();

  // Initialize hub module config bridge (reads modules.config.json toggles)
  await initModuleConfig();

  // Listen to store changes for reactive badge sync & role permission updates
  store.subscribe(() => {
    window.updateNotificationBadge();
    updateSidebarVisibility();
  });

  // Auth listener
  auth.onAuthChange((session) => {
    updateUserProfileUI();
    if (!session) {
      window.showAuthModal();
    } else {
      window.hideAuthModal();
    }
  });

  // Check auth state
  if (!auth.isAuthenticated()) {
    window.showAuthModal();
  } else {
    window.hideAuthModal();
    router.init();
  }
});

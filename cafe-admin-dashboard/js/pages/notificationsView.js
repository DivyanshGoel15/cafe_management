/* ══════════════════════════════════════════════════════════════
   BREW & CO — NOTIFICATION CENTER VIEW CONTROLLER
   Live alerts for orders, bookings, low inventory & system logs
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';

let notifTypeFilter = 'all';

export function renderNotifications() {
  const state = store.getState();
  const el = document.getElementById('view-notifications');
  if (!el) return;

  const unreadCount = state.notifications.filter(n => !n.read).length;

  let filtered = [...state.notifications];
  if (notifTypeFilter !== 'all') {
    filtered = filtered.filter(n => n.type.toLowerCase() === notifTypeFilter.toLowerCase());
  }

  el.innerHTML = `
    <!-- Header -->
    <div class="section-header">
      <div>
        <div class="section-title">Notification Center</div>
        <div style="font-size:12px; color:var(--muted); margin-top:2px;">
          ${unreadCount} unread alerts requiring operational attention
        </div>
      </div>

      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline btn-sm" onclick="window.markAllNotificationsRead()">✓ Mark All Read</button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs" style="margin-bottom:16px;">
      <button class="ftab ${notifTypeFilter === 'all' ? 'active' : ''}" onclick="window.filterNotifType('all')">All Alerts (${state.notifications.length})</button>
      <button class="ftab ${notifTypeFilter === 'order' ? 'active' : ''}" onclick="window.filterNotifType('order')">Orders</button>
      <button class="ftab ${notifTypeFilter === 'booking' ? 'active' : ''}" onclick="window.filterNotifType('booking')">Bookings</button>
      <button class="ftab ${notifTypeFilter === 'stock' ? 'active' : ''}" onclick="window.filterNotifType('stock')">Inventory / Stock</button>
      <button class="ftab ${notifTypeFilter === 'customer' ? 'active' : ''}" onclick="window.filterNotifType('customer')">Customer Feedback</button>
      <button class="ftab ${notifTypeFilter === 'system' ? 'active' : ''}" onclick="window.filterNotifType('system')">System</button>
    </div>

    <!-- Notification List -->
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${filtered.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">🔔</div>
          <div class="empty-title">All caught up!</div>
          <div class="empty-desc">No notifications matching this category.</div>
        </div>
      ` : filtered.map(n => {
        const icon = n.type === 'order' ? '🛍️' : n.type === 'booking' ? '📅' : n.type === 'stock' ? '⚠️' : n.type === 'customer' ? '⭐' : '⚙️';
        const borderCol = n.type === 'order' ? 'var(--accent)' : n.type === 'booking' ? 'var(--green)' : n.type === 'stock' ? 'var(--red)' : 'var(--blue)';
        return `
          <div style="background:var(--card); border:1px solid var(--border); border-left:4px solid ${borderCol}; border-radius:8px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; opacity:${n.read ? 0.75 : 1}; cursor:pointer;" onclick="window.handleNotificationClick('${n.id}', '${n.page}')">
            <div style="display:flex; align-items:flex-start; gap:14px;">
              <div style="font-size:20px; line-height:1; margin-top:2px;">${icon}</div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-weight:700; font-size:13.5px; color:var(--text);">${n.title}</span>
                  ${!n.read ? `<span class="badge badge-yellow" style="font-size:9.5px; padding:1px 6px;">Unread</span>` : ''}
                </div>
                <div style="font-size:12.5px; color:var(--text-secondary); margin-top:3px;">${n.message}</div>
                <div style="font-size:11px; color:var(--muted); margin-top:5px;">${n.time}</div>
              </div>
            </div>

            <div style="display:flex; gap:8px;">
              ${!n.read ? `
                <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); window.markSingleNotificationRead('${n.id}')">Mark Read</button>
              ` : ''}
              <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); window.router.navigate('${n.page}')">Open &rarr;</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

window.filterNotifType = (type) => {
  notifTypeFilter = type;
  renderNotifications();
};

window.markSingleNotificationRead = (id) => {
  store.markNotificationAsRead(id);
  renderNotifications();
  window.updateNotificationBadge();
};

window.markAllNotificationsRead = () => {
  store.markAllNotificationsAsRead();
  toast.success('All notifications marked as read.');
  renderNotifications();
  window.updateNotificationBadge();
};

window.handleNotificationClick = (id, targetPage) => {
  store.markNotificationAsRead(id);
  window.updateNotificationBadge();
  if (targetPage && window.router) {
    window.router.navigate(targetPage);
  }
};

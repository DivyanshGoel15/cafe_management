/* ══════════════════════════════════════════════════════════════
   BREW & CO — DASHBOARD VIEW CONTROLLER
   ══════════════════════════════════════════════════════════════ */

import { store, getTodayDateString } from '../store.js';
import { initDashboardCharts } from '../charts.js';

export function renderDashboard() {
  const state = store.getState();
  const el = document.getElementById('view-dashboard');
  if (!el) return;

  const todayStr = getTodayDateString();
  const todayOrders = state.orders.filter(o => o.date === todayStr);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const todayBookings = state.bookings.filter(b => b.date === todayStr);
  const activeTables = state.tables.filter(t => t.status === 'Occupied').length;
  const availableTables = state.tables.filter(t => t.status === 'Available').length;
  const pendingOrders = state.orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length;

  el.innerHTML = `
    <!-- Top Alert Banner -->
    <div class="dashboard-alert-banner">
      <div class="dashboard-alert-text">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span><strong>Live Operations:</strong> 1 reservation pending confirmation for tonight &middot; Table 6 is in cleaning mode.</span>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="window.router.navigate('bookings')">Review Bookings &rarr;</button>
    </div>

    <!-- Quick Actions Bar -->
    <div class="quick-actions-bar">
      <button class="quick-action-pill" onclick="window.openNewOrderModal()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>+ New Order</span>
      </button>
      <button class="quick-action-pill" onclick="window.openNewBookingModal()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>+ New Booking</span>
      </button>
      <button class="quick-action-pill" onclick="window.router.navigate('tables')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        <span>Floor Plan Status</span>
      </button>
      <button class="quick-action-pill" onclick="window.router.navigate('whatsapp')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span>AI WhatsApp Simulator</span>
      </button>
    </div>

    <!-- Stats Row (4 Cards) -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Today's Revenue</div>
          <div class="stat-icon">₹</div>
        </div>
        <div class="stat-value">₹${todayRevenue.toLocaleString('en-IN') || '18,340'}</div>
        <div class="stat-delta up">+14.2% vs yesterday</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Active Orders</div>
          <div class="stat-icon">🛍️</div>
        </div>
        <div class="stat-value">${todayOrders.length}</div>
        <div class="stat-delta ${pendingOrders > 0 ? 'dn' : 'up'}">${pendingOrders} in kitchen / prep</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Today's Bookings</div>
          <div class="stat-icon">📅</div>
        </div>
        <div class="stat-value">${todayBookings.length}</div>
        <div class="stat-delta up">+4 reservations tonight</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Tables Occupied</div>
          <div class="stat-icon">🪑</div>
        </div>
        <div class="stat-value">${activeTables} <span style="font-size:16px; font-weight:400; color:var(--muted)">/ ${state.tables.length}</span></div>
        <div class="stat-delta up">${availableTables} tables ready</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Revenue — Last 7 Days</div>
            <div class="chart-sub">Daily revenue across dine-in, takeaway and online orders</div>
          </div>
          <span class="badge badge-green">Healthy Growth</span>
        </div>
        <div class="chart-wrap"><canvas id="chartRevenue"></canvas></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Orders by Category</div>
            <div class="chart-sub">Sales distribution by volume</div>
          </div>
        </div>
        <div class="chart-wrap"><canvas id="chartCategory"></canvas></div>
      </div>
    </div>

    <!-- Secondary Row (Reservations trend + Activity Feed) -->
    <div class="charts-grid" style="grid-template-columns: 1fr 1fr;">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Reservations — This Week</div>
            <div class="chart-sub">Confirmed vs cancelled bookings</div>
          </div>
        </div>
        <div class="chart-wrap-sm"><canvas id="chartBookings"></canvas></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Real-Time Activity Feed</div>
            <div class="chart-sub">Live events across POS, WhatsApp &amp; floor</div>
          </div>
        </div>
        <div class="activity-feed-list">
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--green)"></div>
            <div>
              <div class="activity-text">New booking <strong>RES-2407</strong> — Rahul Verma (2 guests at 8:00 PM)</div>
              <div class="activity-time">2 mins ago via WhatsApp AI</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--accent)"></div>
            <div>
              <div class="activity-text">Order <strong>ORD-5521</strong> delivered to Table 1 — Priya Sharma (₹638)</div>
              <div class="activity-time">9 mins ago</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--blue)"></div>
            <div>
              <div class="activity-text">AI Voice Agent handled inquiry for Rohit Khanna (+91 98234 56789)</div>
              <div class="activity-time">18 mins ago</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--green)"></div>
            <div>
              <div class="activity-text">UPI Payment received for <strong>ORD-5520</strong> — ₹561</div>
              <div class="activity-time">25 mins ago</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--red)"></div>
            <div>
              <div class="activity-text">Reservation <strong>RES-2405</strong> cancelled by Vivek Joshi</div>
              <div class="activity-time">45 mins ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders Table Preview -->
    <div style="margin-top: 20px;">
      <div class="section-header">
        <div class="section-title">Recent Orders</div>
        <button class="btn btn-ghost btn-sm" onclick="window.router.navigate('orders')">View All Orders &rarr;</button>
      </div>
      <div class="table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Table / Type</th><th>Items</th><th>Total</th><th>Status</th><th>Time</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${state.orders.slice(0, 5).map(o => `
                <tr>
                  <td class="td-mono td-muted">${o.id}</td>
                  <td class="td-bold">${o.customer}</td>
                  <td>${o.table}</td>
                  <td class="td-muted" style="max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    ${o.items.map(i => `${i.name} x${i.qty}`).join(', ')}
                  </td>
                  <td class="td-bold">₹${o.total}</td>
                  <td>${window.getOrderStatusBadge(o.status)}</td>
                  <td class="td-muted">${o.time}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.openOrderDetails('${o.id}')">Details</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Initialize charts after markup mounts
  setTimeout(() => {
    initDashboardCharts();
  }, 50);
}

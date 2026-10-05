/* ══════════════════════════════════════════════════════════════
   BREW & CO — CUSTOMER MANAGEMENT (CRM) VIEW CONTROLLER
   Full profile drawer with order history, booking history & notes
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let custSegment = 'all';
let custSearch = '';
let activeCustId = null;

export function renderCustomers() {
  const state = store.getState();
  const el = document.getElementById('view-customers');
  if (!el) return;

  const total = state.customers.length;
  const activeCount = state.customers.filter(c => c.status === 'Regular' || c.status === 'VIP').length;
  const vipCount = state.customers.filter(c => c.status === 'VIP').length;
  const atRiskCount = state.customers.filter(c => c.status === 'At Risk').length;

  let filtered = [...state.customers];
  if (custSegment !== 'all') {
    filtered = filtered.filter(c => c.status.toLowerCase() === custSegment.toLowerCase());
  }
  if (custSearch.trim()) {
    const q = custSearch.toLowerCase().trim();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  }

  el.innerHTML = `
    <!-- KPI Header Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Customer Base</div>
        <div class="stat-value">1,247</div>
        <div class="stat-delta up">+43 joined this month</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active (Last 30 Days)</div>
        <div class="stat-value">${activeCount * 42}</div>
        <div class="stat-delta up">38% monthly return rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">VIP High Spenders</div>
        <div class="stat-value">${vipCount * 18}</div>
        <div class="stat-delta up">₹15,000+ lifetime spend</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">At-Risk (Inactive 30+ Days)</div>
        <div class="stat-value" style="color:var(--red);">${atRiskCount * 24}</div>
        <div class="stat-delta dn">Eligible for win-back discount</div>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${custSegment === 'all' ? 'active' : ''}" onclick="window.filterCustSegment('all')">All Customers</button>
        <button class="ftab ${custSegment === 'regular' ? 'active' : ''}" onclick="window.filterCustSegment('regular')">Regulars</button>
        <button class="ftab ${custSegment === 'vip' ? 'active' : ''}" onclick="window.filterCustSegment('vip')">VIPs</button>
        <button class="ftab ${custSegment === 'new' ? 'active' : ''}" onclick="window.filterCustSegment('new')">New</button>
        <button class="ftab ${custSegment === 'at risk' ? 'active' : ''}" onclick="window.filterCustSegment('at risk')">At Risk (${atRiskCount})</button>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search customer name, phone..." value="${custSearch}" oninput="window.searchCustomers(this.value)">
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.openAddCustomerModal()">+ Add Customer</button>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Total Spending</th>
              <th>Last Visit</th>
              <th>Segment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="7">
                  <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <div class="empty-title">No customers found</div>
                    <div class="empty-desc">No customer matches your search or filter.</div>
                  </div>
                </td>
              </tr>
            ` : filtered.map(c => {
              const init = c.name.split(' ').map(w => w[0]).join('').slice(0, 2);
              const badgeClass = c.status === 'VIP' ? 'badge-blue' : c.status === 'Regular' ? 'badge-green' : c.status === 'New' ? 'badge-grey' : 'badge-yellow';
              return `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div class="cust-av">${init}</div>
                      <div>
                        <div class="td-bold">${c.name}</div>
                        <div style="font-size:11px; color:var(--muted);">${c.email || 'No email registered'}</div>
                      </div>
                    </div>
                  </td>
                  <td class="td-muted">${c.phone}</td>
                  <td>${c.orders} orders</td>
                  <td class="td-bold">₹${c.spend.toLocaleString('en-IN')}</td>
                  <td class="td-muted">${c.lastVisit}</td>
                  <td><span class="badge ${badgeClass}">${c.status}</span></td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.openCustomerProfile('${c.id}')">View CRM Profile</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Customer Profile Slide Drawer -->
    <div class="drawer-panel" id="cust-profile-drawer">
      <div class="drawer-header">
        <div class="modal-title" id="cust-drawer-name">Customer Profile</div>
        <button class="modal-close-btn" onclick="window.modal.closeDrawer('cust-profile-drawer')">✕</button>
      </div>
      <div class="drawer-body" id="cust-drawer-body"></div>
      <div class="drawer-footer" id="cust-drawer-footer"></div>
    </div>
  `;
}

window.filterCustSegment = (seg) => {
  custSegment = seg;
  renderCustomers();
};

window.searchCustomers = (q) => {
  custSearch = q;
  renderCustomers();
};

window.openCustomerProfile = (custId) => {
  activeCustId = custId;
  const state = store.getState();
  const c = state.customers.find(item => item.id === custId);
  if (!c) return;

  const init = c.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  document.getElementById('cust-drawer-name').textContent = c.name;

  document.getElementById('cust-drawer-body').innerHTML = `
    <!-- Top Bio Card -->
    <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid var(--border);">
      <div class="cust-av" style="width:48px; height:48px; font-size:17px;">${init}</div>
      <div>
        <div style="font-size:17px; font-weight:700;">${c.name}</div>
        <div style="font-size:12.5px; color:var(--muted);">${c.phone} &middot; ${c.email || 'None'}</div>
        <span class="badge badge-green" style="margin-top:4px;">${c.status}</span>
      </div>
    </div>

    <!-- Spending & Frequency Metrics -->
    <div class="form-row" style="margin-bottom:18px;">
      <div style="background:#FAFAF9; padding:12px; border-radius:8px; border:1px solid var(--border);">
        <div style="font-size:11px; color:var(--muted);">Total Lifetime Spend</div>
        <div style="font-size:20px; font-weight:700; color:var(--accent);">₹${c.spend.toLocaleString('en-IN')}</div>
      </div>
      <div style="background:#FAFAF9; padding:12px; border-radius:8px; border:1px solid var(--border);">
        <div style="font-size:11px; color:var(--muted);">Total Orders Placed</div>
        <div style="font-size:20px; font-weight:700; color:var(--text);">${c.orders}</div>
      </div>
    </div>

    <!-- Staff Notes / Preferences -->
    <div style="margin-bottom:20px;">
      <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--muted); margin-bottom:6px;">
        Staff Notes &amp; Preferences
      </div>
      <textarea class="form-textarea" id="cust-notes-input" style="min-height:70px;">${c.notes || ''}</textarea>
      <button class="btn btn-outline btn-sm" style="margin-top:6px;" onclick="window.saveCustomerNotes('${c.id}')">Save Notes</button>
    </div>

    <!-- Order History -->
    <div style="margin-bottom:20px;">
      <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--muted); margin-bottom:8px;">
        Past Orders History (${(c.ordersHistory || []).length})
      </div>
      ${(c.ordersHistory && c.ordersHistory.length > 0) ? `
        <div class="order-items-list">
          ${c.ordersHistory.map(o => `
            <div class="order-item-row">
              <div>
                <div style="font-weight:600;">${o.id} &middot; <span style="font-weight:400; font-size:11.5px; color:var(--muted);">${o.date}</span></div>
                <div style="font-size:11.5px; color:var(--muted);">${o.items}</div>
              </div>
              <div style="font-weight:700;">₹${o.amount}</div>
            </div>
          `).join('')}
        </div>
      ` : `<div style="font-size:12px; color:var(--muted);">No past orders recorded.</div>`}
    </div>

    <!-- Booking History -->
    <div>
      <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--muted); margin-bottom:8px;">
        Reservation History (${(c.bookingsHistory || []).length})
      </div>
      ${(c.bookingsHistory && c.bookingsHistory.length > 0) ? `
        <div class="order-items-list">
          ${c.bookingsHistory.map(b => `
            <div class="order-item-row">
              <div>
                <div style="font-weight:600;">${b.id} &middot; ${b.date}</div>
                <div style="font-size:11.5px; color:var(--muted);">${b.guests} guests</div>
              </div>
              <div><span class="badge badge-green">${b.status}</span></div>
            </div>
          `).join('')}
        </div>
      ` : `<div style="font-size:12px; color:var(--muted);">No past bookings found.</div>`}
    </div>
  `;

  document.getElementById('cust-drawer-footer').innerHTML = `
    <button class="btn btn-danger-ghost btn-sm" onclick="window.confirmDeleteCustomer('${c.id}')">Delete Customer</button>
    <button class="btn btn-primary btn-sm" onclick="window.sendDirectWhatsApp('${c.phone}')">💬 Open WhatsApp</button>
  `;

  modal.openDrawer('cust-profile-drawer');
};

window.saveCustomerNotes = (id) => {
  const notes = document.getElementById('cust-notes-input').value.trim();
  const state = store.getState();
  const customers = state.customers.map(c => c.id === id ? { ...c, notes } : c);
  store.saveState({ ...state, customers });
  toast.success('Customer notes saved.');
};

window.sendDirectWhatsApp = (phone) => {
  window.router.navigate('whatsapp');
  toast.info(`Switched to WhatsApp Simulator for ${phone}`);
};

window.confirmDeleteCustomer = (id) => {
  modal.confirm({
    title: 'Delete Customer Record',
    message: 'Are you sure you want to delete this customer and their history?',
    isDanger: true,
    confirmText: 'Delete Record',
    onConfirm: () => {
      store.deleteCustomer(id);
      modal.closeDrawer('cust-profile-drawer');
      toast.info('Customer removed.');
      renderCustomers();
    }
  });
};

window.openAddCustomerModal = () => {
  let modalEl = document.getElementById('modal-add-cust');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-add-cust';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Add Customer to CRM</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-add-cust')">✕</button>
      </div>
      <form onsubmit="window.saveNewCustomer(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="cust-new-name" required placeholder="e.g. Shalini Roy">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="cust-new-phone" required placeholder="e.g. 9812345678">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" id="cust-new-email" placeholder="e.g. shalini@gmail.com">
            </div>
            <div class="form-group">
              <label class="form-label">Segment</label>
              <select class="form-select" id="cust-new-segment">
                <option value="New">New</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Initial Notes / Preferences</label>
            <textarea class="form-textarea" id="cust-new-notes" placeholder="e.g. Coffee preferences, allergies, dietary constraints..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-add-cust')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Create Profile</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-add-cust');
};

window.saveNewCustomer = (e) => {
  e.preventDefault();
  const name = document.getElementById('cust-new-name').value.trim();
  const phone = document.getElementById('cust-new-phone').value.trim();
  const email = document.getElementById('cust-new-email').value.trim();
  const status = document.getElementById('cust-new-segment').value;
  const notes = document.getElementById('cust-new-notes').value.trim();

  const newCust = {
    id: 'CUST-' + Math.floor(120 + Math.random() * 800),
    name,
    phone,
    email,
    orders: 0,
    spend: 0,
    lastVisit: 'Today',
    status,
    notes,
    ordersHistory: [],
    bookingsHistory: []
  };

  store.createCustomer(newCust);
  modal.close('modal-add-cust');
  toast.success(`Created CRM profile for ${name}`);
  renderCustomers();
};

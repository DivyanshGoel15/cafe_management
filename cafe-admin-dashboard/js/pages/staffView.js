/* ══════════════════════════════════════════════════════════════
   BREW & CO — STAFF MANAGEMENT & MANAGING AUTHORITY CONTROLLER
   Owner-exclusive account provisioning, role assignment & RBAC
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { auth } from '../auth.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let staffRoleFilter = 'all';

export function renderStaff() {
  const state = store.getState();
  const el = document.getElementById('view-staff');
  if (!el) return;

  const currentUser = auth.getCurrentUser();
  const isOwner = currentUser && currentUser.role === 'Owner';

  // 🔒 STRICT SECURITY ENFORCEMENT: ONLY THE OWNER CAN ACCESS & PROVISION ACCOUNTS
  if (!isOwner) {
    el.innerHTML = `
      <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:44px 28px; text-align:center; max-width:580px; margin:40px auto; box-shadow:var(--shadow-sm);">
        <div style="width:58px; height:58px; border-radius:50%; background:rgba(184,115,51,0.12); color:var(--accent); font-size:28px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">🔒</div>
        <div style="font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px;">Managing Authority Access Restricted</div>
        <div style="font-size:13px; color:var(--muted); line-height:1.55; margin-bottom:22px;">
          Only the <strong>Cafe Owner (Aditya Singhal)</strong> has the administrative authority to create, provision, and assign roles for Managers and Staff members.<br>
          Self-registration is strictly disabled to prevent unauthorized account creation.
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.router.navigate('orders')">Return to Daily Operations</button>
      </div>
    `;
    return;
  }

  let filtered = [...state.staff];
  if (staffRoleFilter !== 'all') {
    filtered = filtered.filter(s => s.role.toLowerCase() === staffRoleFilter.toLowerCase());
  }

  el.innerHTML = `
    <!-- Top Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Provisioned Accounts</div>
        <div class="stat-value">${state.staff.length}</div>
        <div class="stat-delta up">All credentials active</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Currently On Shift</div>
        <div class="stat-value">${state.staff.filter(s => s.status === 'Active').length}</div>
        <div class="stat-delta up">Floor &amp; Kitchen active</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Authorized Managers</div>
        <div class="stat-value">${state.staff.filter(s => s.role === 'Manager').length}</div>
        <div class="stat-delta neutral">Operational &amp; Growth access</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Floor &amp; Baristas</div>
        <div class="stat-value">${state.staff.filter(s => s.role === 'Staff').length}</div>
        <div class="stat-delta neutral">POS &amp; Order terminal access</div>
      </div>
    </div>

    <!-- Owner Authority Security Banner -->
    <div style="background:var(--card); border:1px solid var(--border); border-left:4px solid var(--accent); border-radius:10px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
      <div style="max-width:700px;">
        <div style="font-size:14.5px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:8px;">
          <span>👑 Managing Authority Account Provisioning</span>
          <span class="badge badge-purple">Owner Authority Only</span>
        </div>
        <div style="font-size:12.5px; color:var(--muted); margin-top:3px; line-height:1.45;">
          You are logged in with Master Owner Authority. Only you can create, assign roles, and set login credentials for Managers and Staff. Self-registration is strictly blocked to maintain administrative security.
        </div>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <button class="btn btn-outline btn-sm" onclick="window.openPermissionsMatrixModal()">🔐 Permissions Matrix</button>
        <button class="btn btn-primary btn-sm" onclick="window.openAddStaffModal()">+ Provision New Account</button>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${staffRoleFilter === 'all' ? 'active' : ''}" onclick="window.filterStaffRole('all')">All Accounts (${state.staff.length})</button>
        <button class="ftab ${staffRoleFilter === 'owner' ? 'active' : ''}" onclick="window.filterStaffRole('owner')">Owners</button>
        <button class="ftab ${staffRoleFilter === 'manager' ? 'active' : ''}" onclick="window.filterStaffRole('manager')">Managers</button>
        <button class="ftab ${staffRoleFilter === 'staff' ? 'active' : ''}" onclick="window.filterStaffRole('staff')">Staff &amp; Baristas</button>
      </div>
    </div>

    <!-- Staff & Managing Accounts Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Member / Login ID</th>
              <th>Authority Role</th>
              <th>Account Origin</th>
              <th>Contact Info</th>
              <th>Shift Schedule</th>
              <th>Status</th>
              <th>Administrative Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(s => {
              const init = s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              const isMasterOwner = s.role === 'Owner';
              const roleBadge = isMasterOwner ? 'badge-purple' : s.role === 'Manager' ? 'badge-blue' : 'badge-grey';

              return `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div class="cust-av" style="background:rgba(11,32,24,0.1); color:var(--sidebar);">${init}</div>
                      <div>
                        <div class="td-bold">${s.name}</div>
                        <div style="font-size:11.5px; color:var(--muted); font-family:monospace;">${s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge ${roleBadge}">
                      ${isMasterOwner ? '👑 ' : s.role === 'Manager' ? '👔 ' : '☕ '}${s.role}
                    </span>
                  </td>
                  <td>
                    <span style="font-size:11.5px; color:var(--muted); display:inline-flex; align-items:center; gap:4px;">
                      <span>🛡️</span> ${isMasterOwner ? 'Master Admin' : 'Owner-Provisioned'}
                    </span>
                  </td>
                  <td>
                    <div style="font-size:12px;">${s.phone}</div>
                  </td>
                  <td class="td-muted" style="font-size:12px;">${s.shift}</td>
                  <td>
                    <span class="badge ${s.status === 'Active' ? 'badge-green' : 'badge-red'}">${s.status}</span>
                  </td>
                  <td>
                    <div style="display:flex; gap:6px; align-items:center;">
                      <button class="btn btn-ghost btn-sm" onclick="window.openEditStaffModal('${s.id}')">Edit</button>
                      ${!isMasterOwner ? `
                        <button class="btn btn-ghost btn-sm" onclick="window.openResetStaffPasswordModal('${s.id}')" title="Reset employee login password">🔑 Reset Pwd</button>
                        <button class="btn btn-danger-ghost btn-sm" onclick="window.confirmDeleteStaff('${s.id}')" title="Revoke account access">Revoke</button>
                      ` : `
                        <span style="font-size:11px; color:var(--muted); font-style:italic;">Protected</span>
                      `}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.filterStaffRole = (r) => {
  staffRoleFilter = r;
  renderStaff();
};

// ── ROLE PERMISSIONS MATRIX & EDITOR ──
window.openPermissionsMatrixModal = () => {
  let modalEl = document.getElementById('modal-permissions-matrix');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-permissions-matrix';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  const currentUser = auth.getCurrentUser();
  const isOwner = currentUser && currentUser.role === 'Owner';
  const state = store.getState();
  const rolePerms = state.rolePermissions || {
    Owner: {},
    Manager: {},
    Staff: {}
  };

  const modules = [
    { key: 'dashboard', name: 'Dashboard & Overview', desc: 'KPI counters, real-time sales & operational overview' },
    { key: 'orders', name: 'Orders Management & POS', desc: 'Take live orders, billing, kitchen display & payments' },
    { key: 'bookings', name: 'Reservations & Bookings', desc: 'Table reservations, guest check-in & calendar' },
    { key: 'tables', name: 'Floor Plan & Tables', desc: 'Floor layout, occupancy status & seating assignment' },
    { key: 'menu', name: 'Menu & Stock Catalog', desc: 'Recipe items, pricing, out-of-stock 86 toggles' },
    { key: 'customers', name: 'Customer CRM', desc: 'Guest directory, spending history & VIP profiles' },
    { key: 'staff', name: 'Staff & Account Management', desc: 'Staff directory & managing authority account creation' },
    { key: 'analytics', name: 'Financials & Analytics', desc: 'Revenue analysis, category metrics & sales reports' },
    { key: 'offers', name: 'Offers & Promotions', desc: 'Discount coupons, promo rules & broadcasts' },
    { key: 'reviews', name: 'Reviews & Reputation', desc: 'Customer ratings, Google/Zomato feedback & replies' },
    { key: 'whatsapp', name: 'WhatsApp Automation Hub', desc: 'WhatsApp bot conversations & automated alerts' },
    { key: 'ai-calling', name: 'AI Voice Calling Concierge', desc: 'Automated AI voice calls for booking confirmations' },
    { key: 'qr-system', name: 'Table QR Orders', desc: 'Permanent table standees, online ordering & pause' },
    { key: 'notifications', name: 'Notification Center', desc: 'System alerts, low inventory & guest arrival notices' },
    { key: 'settings', name: 'Settings & Configuration', desc: 'Business profile, GST taxes, turnover times & rules' }
  ];

  modalEl.innerHTML = `
    <div class="modal-box modal-lg" style="max-height:92vh;">
      <div class="modal-header">
        <div>
          <div class="modal-title" style="display:flex; align-items:center; gap:8px;">
            <span>Role Permissions &amp; Access Control Matrix</span>
            ${isOwner ? '<span class="badge badge-purple">Owner Edit Mode</span>' : '<span class="badge badge-grey">Read Only</span>'}
          </div>
          <div style="font-size:12px; color:var(--muted); margin-top:2px;">
            ${isOwner ? 'As the Cafe Owner, you can customize feature access for Manager and Staff roles.' : 'Only the Cafe Owner can edit permissions for Manager and Staff.'}
          </div>
        </div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-permissions-matrix')">✕</button>
      </div>

      <div class="modal-body" style="padding:0; overflow-y:auto; max-height:calc(92vh - 130px);">
        <table style="width:100%;">
          <thead>
            <tr>
              <th style="padding:12px 18px;">Feature / Module</th>
              <th style="text-align:center; min-width:140px;">👑 Owner</th>
              <th style="text-align:center; min-width:140px;">👔 Manager</th>
              <th style="text-align:center; min-width:140px;">☕ Staff / Barista</th>
            </tr>
          </thead>
          <tbody>
            ${modules.map(m => {
              const isStaffModule = m.key === 'staff';
              const mgrAllowed = isStaffModule ? false : (rolePerms.Manager ? Boolean(rolePerms.Manager[m.key]) : false);
              const stfAllowed = isStaffModule ? false : (rolePerms.Staff ? Boolean(rolePerms.Staff[m.key]) : false);

              return `
                <tr>
                  <td style="padding:11px 18px;">
                    <div style="font-weight:600; font-size:13px;">${m.name}</div>
                    <div style="font-size:11px; color:var(--muted); line-height:1.3;">${m.desc}</div>
                  </td>
                  <td style="text-align:center;">
                    <span class="badge badge-green" style="font-size:11px;">Full Access 🔒</span>
                  </td>
                  <td style="text-align:center;">
                    ${isStaffModule ? `
                      <span class="badge badge-grey" title="Only the Owner can manage staff & accounts">Owner Only 🔒</span>
                    ` : isOwner ? `
                      <label class="toggle" style="display:inline-block;">
                        <input type="checkbox" id="perm-mgr-${m.key}" ${mgrAllowed ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                      </label>
                    ` : `
                      <span class="badge ${mgrAllowed ? 'badge-green' : 'badge-grey'}">${mgrAllowed ? 'Allowed' : 'Restricted'}</span>
                    `}
                  </td>
                  <td style="text-align:center;">
                    ${isStaffModule ? `
                      <span class="badge badge-grey" title="Only the Owner can manage staff & accounts">Owner Only 🔒</span>
                    ` : isOwner ? `
                      <label class="toggle" style="display:inline-block;">
                        <input type="checkbox" id="perm-stf-${m.key}" ${stfAllowed ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                      </label>
                    ` : `
                      <span class="badge ${stfAllowed ? 'badge-green' : 'badge-grey'}">${stfAllowed ? 'Allowed' : 'Restricted'}</span>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          ${isOwner ? `
            <button class="btn btn-outline btn-sm" onclick="window.resetRolePermissionsDefaults()">↺ Reset to Recommended Defaults</button>
          ` : `
            <span style="font-size:11.5px; color:var(--muted);">Viewing role authorization matrix</span>
          `}
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-permissions-matrix')">Close</button>
          ${isOwner ? `
            <button class="btn btn-primary btn-sm" onclick="window.saveRolePermissionsFromModal()">💾 Save Permissions</button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  modal.open('modal-permissions-matrix');
};

window.saveRolePermissionsFromModal = () => {
  const moduleKeys = [
    'dashboard', 'orders', 'bookings', 'tables', 'menu', 'customers',
    'staff', 'analytics', 'offers', 'reviews', 'whatsapp', 'ai-calling',
    'qr-system', 'notifications', 'settings'
  ];

  const newManagerPerms = {};
  const newStaffPerms = {};

  moduleKeys.forEach(k => {
    if (k === 'staff') {
      newManagerPerms[k] = false; // strictly Owner only!
      newStaffPerms[k] = false;
      return;
    }
    const mgrEl = document.getElementById(`perm-mgr-${k}`);
    const stfEl = document.getElementById(`perm-stf-${k}`);
    if (mgrEl) newManagerPerms[k] = mgrEl.checked;
    if (stfEl) newStaffPerms[k] = stfEl.checked;
  });

  store.updateRolePermissions('Manager', newManagerPerms);
  store.updateRolePermissions('Staff', newStaffPerms);

  if (window.updateSidebarVisibility) {
    window.updateSidebarVisibility();
  }

  toast.success('Role permissions saved successfully! Updated access rules are now in effect.');
  modal.close('modal-permissions-matrix');
  renderStaff();
};

window.resetRolePermissionsDefaults = () => {
  const defaultManager = {
    dashboard: true, orders: true, bookings: true, tables: true, menu: true, customers: true,
    staff: false, analytics: true, offers: true, reviews: true, whatsapp: true, 'ai-calling': true,
    'qr-system': true, notifications: true, settings: false
  };
  const defaultStaff = {
    dashboard: false, orders: true, bookings: true, tables: true, menu: true, customers: false,
    staff: false, analytics: false, offers: false, reviews: false, whatsapp: false, 'ai-calling': false,
    'qr-system': true, notifications: true, settings: false
  };

  const moduleKeys = [
    'dashboard', 'orders', 'bookings', 'tables', 'menu', 'customers',
    'staff', 'analytics', 'offers', 'reviews', 'whatsapp', 'ai-calling',
    'qr-system', 'notifications', 'settings'
  ];

  moduleKeys.forEach(k => {
    if (k === 'staff') return;
    const mgrEl = document.getElementById(`perm-mgr-${k}`);
    const stfEl = document.getElementById(`perm-stf-${k}`);
    if (mgrEl) mgrEl.checked = Boolean(defaultManager[k]);
    if (stfEl) stfEl.checked = Boolean(defaultStaff[k]);
  });

  toast.info('Loaded recommended role defaults. Click "Save Permissions" to commit.');
};

// ── PROVISION NEW MANAGING ACCOUNT (OWNER-EXCLUSIVE) ──
window.openAddStaffModal = () => {
  const currentUser = auth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Owner') {
    toast.error('Access Denied: Only the Cafe Owner can provision new staff or manager accounts.');
    return;
  }

  let modalEl = document.getElementById('modal-staff-form');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-staff-form';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box" style="max-width:540px;">
      <div class="modal-header">
        <div>
          <div class="modal-title" style="display:flex; align-items:center; gap:8px;">
            <span>👑 Provision New Managing Account</span>
          </div>
          <div style="font-size:11.5px; color:var(--muted); margin-top:2px;">
            Create login credentials for a Manager or Staff member. (Owner-only authority)
          </div>
        </div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-staff-form')">✕</button>
      </div>

      <form onsubmit="window.saveNewStaff(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="stf-name" required placeholder="e.g. Ramesh Iyer">
            </div>
            <div class="form-group">
              <label class="form-label">Managing Authority Role *</label>
              <select class="form-select" id="stf-role" required>
                <option value="Manager">👔 Manager (Operational Authority)</option>
                <option value="Staff" selected>☕ Staff / Barista (Floor &amp; POS)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Official Work Email (Login ID) *</label>
              <input type="email" class="form-input" id="stf-email" required placeholder="e.g. ramesh@brewandco.com">
            </div>
            <div class="form-group">
              <label class="form-label">Contact Phone Number *</label>
              <input type="tel" class="form-input" id="stf-phone" required placeholder="e.g. +91 98765 44004">
            </div>
          </div>

          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label class="form-label" style="margin-bottom:0;">Initial Login Password *</label>
              <button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px; font-size:11px;" onclick="window.generateRandomStaffPassword()">⚡ Generate Password</button>
            </div>
            <input type="text" class="form-input" id="stf-password" required value="brew@2026" placeholder="Set initial password for member">
            <div class="form-hint">The employee will use this password to sign into the dashboard.</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Shift Timing</label>
              <select class="form-select" id="stf-shift">
                <option value="Morning (08:00 - 16:30)">Morning (08:00 - 16:30)</option>
                <option value="Evening (15:30 - 23:30)">Evening (15:30 - 23:30)</option>
                <option value="All Day Shift">All Day Shift</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Station / Department</label>
              <select class="form-select" id="stf-station">
                <option value="Dining Area Floor">Dining Area Floor</option>
                <option value="Espresso & Barista Bar">Espresso &amp; Barista Bar</option>
                <option value="Kitchen & KDS">Kitchen &amp; KDS</option>
                <option value="Billing & Counter POS">Billing &amp; Counter POS</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:11.5px; color:var(--muted);">🔒 Provisioned exclusively by Owner</span>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-staff-form')">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm">Provision Account</button>
          </div>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-staff-form');
};

window.generateRandomStaffPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pwd = 'Cafe';
  for (let i = 0; i < 4; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  pwd += '!';
  const el = document.getElementById('stf-password');
  if (el) el.value = pwd;
  toast.info(`Generated temporary password: ${pwd}`);
};

window.saveNewStaff = (e) => {
  e.preventDefault();
  const currentUser = auth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Owner') {
    toast.error('Unauthorized: Only the Cafe Owner can create managing accounts.');
    return;
  }

  const name = document.getElementById('stf-name').value.trim();
  const role = document.getElementById('stf-role').value;
  const email = document.getElementById('stf-email').value.trim().toLowerCase();
  const phone = document.getElementById('stf-phone').value.trim();
  const password = document.getElementById('stf-password').value.trim();
  const shift = document.getElementById('stf-shift').value;

  if (password.length < 4) {
    toast.error('Password must be at least 4 characters long.');
    return;
  }

  const state = store.getState();
  const alreadyExists = state.users.some(u => u.email.toLowerCase() === email);
  if (alreadyExists) {
    toast.error(`An account with email "${email}" already exists. Please use a unique work email address.`);
    return;
  }

  store.createStaffAccount({
    name,
    email,
    password,
    role,
    phone,
    shift,
    status: 'Active'
  });

  modal.close('modal-staff-form');
  toast.success(`Account created for ${name} (${role})! Login ID: ${email}, Password: ${password}`);
  renderStaff();
};

window.openEditStaffModal = (id) => {
  const currentUser = auth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Owner') {
    toast.error('Unauthorized: Only the Cafe Owner can edit staff accounts.');
    return;
  }

  const state = store.getState();
  const s = state.staff.find(item => item.id === id);
  if (!s) return;

  const isMasterOwner = s.role === 'Owner';

  let modalEl = document.getElementById('modal-staff-form');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-staff-form';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Edit Staff Profile — ${s.name}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-staff-form')">✕</button>
      </div>
      <form onsubmit="window.saveEditStaff(event, '${s.id}')">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="stf-edit-name" required value="${s.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Authority Role *</label>
              ${isMasterOwner ? `
                <input type="text" class="form-input" readonly value="Owner (Master Admin)" style="background:#FAFAF9;">
                <input type="hidden" id="stf-edit-role" value="Owner">
              ` : `
                <select class="form-select" id="stf-edit-role">
                  <option value="Manager" ${s.role === 'Manager' ? 'selected' : ''}>👔 Manager (Operational Authority)</option>
                  <option value="Staff" ${s.role === 'Staff' ? 'selected' : ''}>☕ Staff / Barista (Floor &amp; POS)</option>
                </select>
              `}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email Address (Login ID)</label>
              <input type="email" class="form-input" readonly value="${s.email}" style="background:#FAFAF9;">
              <div class="form-hint">Email address serves as the unique login username.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="stf-edit-phone" required value="${s.phone}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Shift Timing</label>
              <input type="text" class="form-input" id="stf-edit-shift" value="${s.shift}">
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" id="stf-edit-status">
                <option value="Active" ${s.status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Inactive" ${s.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-staff-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Profile</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-staff-form');
};

window.saveEditStaff = (e, id) => {
  e.preventDefault();
  const currentUser = auth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Owner') {
    toast.error('Unauthorized: Only the Cafe Owner can edit accounts.');
    return;
  }

  const name = document.getElementById('stf-edit-name').value.trim();
  const role = document.getElementById('stf-edit-role').value;
  const phone = document.getElementById('stf-edit-phone').value.trim();
  const shift = document.getElementById('stf-edit-shift').value.trim();
  const status = document.getElementById('stf-edit-status').value;

  const state = store.getState();
  const existing = state.staff.find(s => s.id === id);
  if (!existing) return;

  store.updateStaff({
    ...existing,
    name,
    role,
    phone,
    shift,
    status
  });

  modal.close('modal-staff-form');
  toast.success(`Updated account details for ${name}`);
  renderStaff();
};

// ── OWNER PASSWORD RESET FOR STAFF/MANAGER ──
window.openResetStaffPasswordModal = (staffId) => {
  const currentUser = auth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Owner') {
    toast.error('Only the Cafe Owner can reset staff passwords.');
    return;
  }

  const state = store.getState();
  const s = state.staff.find(item => item.id === staffId);
  if (!s) return;

  let modalEl = document.getElementById('modal-reset-staff-pwd');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-reset-staff-pwd';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box" style="max-width:440px;">
      <div class="modal-header">
        <div class="modal-title">🔑 Reset Password for ${s.name}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-reset-staff-pwd')">✕</button>
      </div>
      <form onsubmit="window.saveResetStaffPassword(event, '${s.email}')">
        <div class="modal-body">
          <p style="font-size:12.5px; color:var(--muted); margin-bottom:14px; line-height:1.45;">
            As Owner, you can set a new login password for <strong>${s.name}</strong> (<code>${s.email}</code>).
          </p>

          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label class="form-label" style="margin-bottom:0;">New Password *</label>
              <button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px; font-size:11px;" onclick="window.generateResetPasswordVal()">⚡ Generate</button>
            </div>
            <input type="text" class="form-input" id="reset-new-staff-pwd" required value="cafe${Math.floor(100 + Math.random() * 900)}!" placeholder="Enter new password">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-reset-staff-pwd')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Update Password</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-reset-staff-pwd');
};

window.generateResetPasswordVal = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pwd = 'Cafe';
  for (let i = 0; i < 4; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  pwd += '!';
  const el = document.getElementById('reset-new-staff-pwd');
  if (el) el.value = pwd;
};

window.saveResetStaffPassword = (e, email) => {
  e.preventDefault();
  const currentUser = auth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Owner') {
    toast.error('Unauthorized.');
    return;
  }

  const newPwd = document.getElementById('reset-new-staff-pwd').value.trim();
  if (newPwd.length < 4) {
    toast.error('Password must be at least 4 characters long.');
    return;
  }

  store.resetStaffPassword(email, newPwd);
  modal.close('modal-reset-staff-pwd');
  toast.success(`Login password for ${email} has been updated to "${newPwd}".`);
};

// ── REVOKE ACCOUNT (OWNER-EXCLUSIVE) ──
window.confirmDeleteStaff = (id) => {
  const currentUser = auth.getCurrentUser();
  if (!currentUser || currentUser.role !== 'Owner') {
    toast.error('Unauthorized: Only the Cafe Owner can revoke accounts.');
    return;
  }

  const state = store.getState();
  const s = state.staff.find(item => item.id === id);
  if (!s) return;

  if (s.role === 'Owner') {
    toast.error('Cannot remove master Owner account.');
    return;
  }

  modal.confirm({
    title: `Revoke Account: ${s.name}`,
    message: `Are you sure you want to revoke account access for ${s.name} (${s.role})? Their login credentials (${s.email}) will be permanently deactivated.`,
    isDanger: true,
    confirmText: 'Revoke Access',
    onConfirm: () => {
      store.deleteStaff(id);
      toast.info(`Account access for ${s.name} has been revoked.`);
      renderStaff();
    }
  });
};

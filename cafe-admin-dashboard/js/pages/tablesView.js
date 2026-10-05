/* ══════════════════════════════════════════════════════════════
   BREW & CO — TABLE & FLOOR PLAN MANAGEMENT VIEW CONTROLLER
   Visual card & floor layout with instant status switching
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let selectedZone = 'all';

export function renderTables() {
  const state = store.getState();
  const el = document.getElementById('view-tables');
  if (!el) return;

  const total = state.tables.length;
  const occupied = state.tables.filter(t => t.status === 'Occupied').length;
  const reserved = state.tables.filter(t => t.status === 'Reserved').length;
  const available = state.tables.filter(t => t.status === 'Available').length;
  const cleaning = state.tables.filter(t => t.status === 'Cleaning').length;

  let filtered = state.tables;
  if (selectedZone !== 'all') {
    filtered = filtered.filter(t => t.zone.toLowerCase() === selectedZone.toLowerCase());
  }

  el.innerHTML = `
    <!-- Top Floor Summary Metrics -->
    <div class="stats-row" style="margin-bottom: 16px;">
      <div class="stat-card stat-accent-green">
        <div class="stat-label">Available for Seating</div>
        <div class="stat-value" style="color:var(--green)">${available}</div>
        <div class="stat-delta up">Ready to seat guests immediately</div>
      </div>
      <div class="stat-card stat-accent-red">
        <div class="stat-label">Currently Occupied</div>
        <div class="stat-value" style="color:var(--red)">${occupied}</div>
        <div class="stat-delta dn">${Math.round((occupied / total) * 100)}% floor occupancy rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Reserved Tables</div>
        <div class="stat-value" style="color:var(--yellow)">${reserved}</div>
        <div class="stat-delta neutral">Upcoming bookings assigned</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Needs Sanitizing / Cleaning</div>
        <div class="stat-value" style="color:var(--blue)">${cleaning}</div>
        <div class="stat-delta dn">Staff alerted</div>
      </div>
    </div>

    <!-- Section Header with Zone Filters & Add Table -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${selectedZone === 'all' ? 'active' : ''}" onclick="window.filterTableZone('all')">All Zones (${total})</button>
        <button class="ftab ${selectedZone === 'main dining' ? 'active' : ''}" onclick="window.filterTableZone('main dining')">Main Dining Hall</button>
        <button class="ftab ${selectedZone === 'patio & garden' ? 'active' : ''}" onclick="window.filterTableZone('patio & garden')">Patio &amp; Garden</button>
        <button class="ftab ${selectedZone === 'lounge area' ? 'active' : ''}" onclick="window.filterTableZone('lounge area')">Lounge Area</button>
        <button class="ftab ${selectedZone === 'bar counter' ? 'active' : ''}" onclick="window.filterTableZone('bar counter')">Bar Counter</button>
      </div>

      <button class="btn btn-primary btn-sm" onclick="window.openAddTableModal()">+ Add Table</button>
    </div>

    <!-- Table Grid Floor View -->
    <div class="table-grid">
      ${filtered.map(t => {
        const statusClass = `status-${t.status.toLowerCase()}`;
        return `
          <div class="table-card-item ${statusClass}">
            <div class="table-top">
              <div class="table-num">Table ${t.number}</div>
              <span class="table-zone-badge">${t.zone}</span>
            </div>

            <div class="table-meta">
              <span>👥 ${t.capacity} Seats</span>
              ${t.seatedMinutes ? `<span>&bull; Seated: ${t.seatedMinutes}m</span>` : ''}
            </div>

            <div class="table-customer-box">
              ${t.status === 'Occupied' ? `
                <div style="font-weight:600; color:var(--text);">${t.currentCustomer || 'Guest'}</div>
                <div style="font-size:11px; color:var(--muted); margin-top:2px;">
                  ${t.orderId ? `Order: ${t.orderId} &middot; ` : ''}<strong>₹${t.billAmount || 0}</strong>
                </div>
              ` : t.status === 'Reserved' ? `
                <div style="font-weight:600; color:var(--yellow);">${t.currentCustomer || 'Reserved'}</div>
                <div style="font-size:11px; color:var(--muted); margin-top:2px;">Scheduled guest arriving</div>
              ` : t.status === 'Cleaning' ? `
                <div style="color:var(--blue); font-weight:500;">Sanitizing in progress...</div>
              ` : `
                <div style="color:var(--green); font-weight:500;">Ready for Walk-in / Booking</div>
              `}
            </div>

            <div class="table-footer-actions">
              <!-- Quick Status Selector -->
              <select class="form-select" style="font-size:11px; padding:3px 6px; width:auto; border-radius:4px;" onchange="window.changeTableStatus('${t.id}', this.value)">
                <option value="Available" ${t.status === 'Available' ? 'selected' : ''}>Available</option>
                <option value="Occupied" ${t.status === 'Occupied' ? 'selected' : ''}>Occupied</option>
                <option value="Reserved" ${t.status === 'Reserved' ? 'selected' : ''}>Reserved</option>
                <option value="Cleaning" ${t.status === 'Cleaning' ? 'selected' : ''}>Cleaning</option>
              </select>

              <div style="display:flex; gap:4px;">
                <button class="btn btn-ghost btn-sm" title="Edit Table" onclick="window.openEditTableModal('${t.id}')">✏️</button>
                <button class="btn btn-ghost btn-sm" title="Delete Table" onclick="window.confirmDeleteTable('${t.id}')">🗑️</button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

window.filterTableZone = (zone) => {
  selectedZone = zone;
  renderTables();
};

window.changeTableStatus = (tableId, newStatus) => {
  let cust = null;
  if (newStatus === 'Occupied') {
    cust = prompt('Customer Name or Notes for Table:', 'Walk-in Guests');
    if (!cust) cust = 'Walk-in Guests';
  }
  store.updateTableStatus(tableId, newStatus, cust);
  toast.success(`Table updated to ${newStatus}`);
  renderTables();
};

window.openAddTableModal = () => {
  let modalEl = document.getElementById('modal-table-form');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-table-form';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Add New Table</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-table-form')">✕</button>
      </div>
      <form onsubmit="window.saveNewTable(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Table Number *</label>
              <input type="text" class="form-input" id="tbl-number" required placeholder="e.g. 13">
            </div>
            <div class="form-group">
              <label class="form-label">Capacity (Seats) *</label>
              <input type="number" min="1" max="20" class="form-input" id="tbl-capacity" required value="4">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zone / Area *</label>
              <select class="form-select" id="tbl-zone">
                <option value="Main Dining">Main Dining</option>
                <option value="Patio & Garden">Patio &amp; Garden</option>
                <option value="Lounge Area">Lounge Area</option>
                <option value="Bar Counter">Bar Counter</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Initial Status</label>
              <select class="form-select" id="tbl-status">
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-table-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Add Table</button>
        </div>
      </form>
    </div>
  `;
  modal.open('modal-table-form');
};

window.saveNewTable = (e) => {
  e.preventDefault();
  const number = document.getElementById('tbl-number').value.trim();
  const capacity = parseInt(document.getElementById('tbl-capacity').value, 10);
  const zone = document.getElementById('tbl-zone').value;
  const status = document.getElementById('tbl-status').value;

  const newTable = {
    id: 'T-' + (number.padStart(2, '0')),
    number: number,
    zone: zone,
    capacity: capacity,
    status: status,
    currentCustomer: null,
    orderId: null,
    billAmount: 0,
    seatedMinutes: 0
  };

  store.createTable(newTable);
  modal.close('modal-table-form');
  toast.success(`Table ${number} created successfully.`);
  renderTables();
};

window.openEditTableModal = (tableId) => {
  const state = store.getState();
  const tbl = state.tables.find(t => t.id === tableId);
  if (!tbl) return;

  let modalEl = document.getElementById('modal-table-form');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-table-form';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Edit Table ${tbl.number}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-table-form')">✕</button>
      </div>
      <form onsubmit="window.saveEditTable(event, '${tbl.id}')">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Table Number *</label>
              <input type="text" class="form-input" id="tbl-number" required value="${tbl.number}">
            </div>
            <div class="form-group">
              <label class="form-label">Capacity (Seats) *</label>
              <input type="number" min="1" max="20" class="form-input" id="tbl-capacity" required value="${tbl.capacity}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zone / Area *</label>
              <select class="form-select" id="tbl-zone">
                <option value="Main Dining" ${tbl.zone === 'Main Dining' ? 'selected' : ''}>Main Dining</option>
                <option value="Patio & Garden" ${tbl.zone === 'Patio & Garden' ? 'selected' : ''}>Patio &amp; Garden</option>
                <option value="Lounge Area" ${tbl.zone === 'Lounge Area' ? 'selected' : ''}>Lounge Area</option>
                <option value="Bar Counter" ${tbl.zone === 'Bar Counter' ? 'selected' : ''}>Bar Counter</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" id="tbl-status">
                <option value="Available" ${tbl.status === 'Available' ? 'selected' : ''}>Available</option>
                <option value="Occupied" ${tbl.status === 'Occupied' ? 'selected' : ''}>Occupied</option>
                <option value="Reserved" ${tbl.status === 'Reserved' ? 'selected' : ''}>Reserved</option>
                <option value="Cleaning" ${tbl.status === 'Cleaning' ? 'selected' : ''}>Cleaning</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-table-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Changes</button>
        </div>
      </form>
    </div>
  `;
  modal.open('modal-table-form');
};

window.saveEditTable = (e, tableId) => {
  e.preventDefault();
  const number = document.getElementById('tbl-number').value.trim();
  const capacity = parseInt(document.getElementById('tbl-capacity').value, 10);
  const zone = document.getElementById('tbl-zone').value;
  const status = document.getElementById('tbl-status').value;

  const state = store.getState();
  const tables = state.tables.map(t => {
    if (t.id === tableId) {
      return { ...t, number, capacity, zone, status };
    }
    return t;
  });
  store.saveState({ ...state, tables });
  modal.close('modal-table-form');
  toast.success(`Table ${number} updated.`);
  renderTables();
};

window.confirmDeleteTable = (tableId) => {
  modal.confirm({
    title: 'Delete Table',
    message: 'Are you sure you want to remove this table from the floor plan?',
    isDanger: true,
    confirmText: 'Delete Table',
    onConfirm: () => {
      store.deleteTable(tableId);
      toast.info('Table deleted from floor plan.');
      renderTables();
    }
  });
};

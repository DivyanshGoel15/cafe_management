/* ══════════════════════════════════════════════════════════════
   BREW & CO — TABLE ORDERING & STATIC QR MANAGEMENT
   Manage permanent static table standees, online ordering status,
   table routing & live metrics without dynamic barcode clutter
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let selectedZone = 'all';

export function renderQR() {
  const state = store.getState();
  const el = document.getElementById('view-qr-system');
  if (!el) return;

  const totalScans = state.qrCodes.reduce((sum, q) => sum + (q.totalScans || 0), 0);
  const scansToday = state.qrCodes.reduce((sum, q) => sum + (q.scansToday || 0), 0);
  const ordersToday = state.qrCodes.reduce((sum, q) => sum + (q.ordersToday || 0), 0);
  const revenueToday = state.qrCodes.reduce((sum, q) => sum + (q.revenueToday || 0), 0);

  let filtered = [...state.qrCodes];
  if (selectedZone !== 'all') {
    filtered = filtered.filter(q => q.zone.toLowerCase() === selectedZone.toLowerCase());
  }

  el.innerHTML = `
    <!-- Top Operational Metrics -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Active Table Standees</div>
        <div class="stat-value">${state.qrCodes.filter(q => q.status === 'Active').length} <span style="font-size:14px; font-weight:400; color:var(--muted);">/ ${state.qrCodes.length}</span></div>
        <div class="stat-delta up">Physical acrylic standees mapped</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">QR Scans Today</div>
        <div class="stat-value">${scansToday}</div>
        <div class="stat-delta up">+34 scans during peak rush</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Digital Orders Placed</div>
        <div class="stat-value">${ordersToday}</div>
        <div class="stat-delta up">Direct-to-kitchen routing</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Today's Digital Revenue</div>
        <div class="stat-value" style="color:var(--accent);">₹${revenueToday.toLocaleString('en-IN')}</div>
        <div class="stat-delta up">${Math.round((ordersToday / Math.max(scansToday, 1)) * 100)}% scan-to-order conversion</div>
      </div>
    </div>

    <!-- Permanent Static QR Standee Info Banner -->
    <div style="background:var(--card); border:1px solid var(--border); border-left:4px solid var(--accent); border-radius:10px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
      <div style="max-width:720px;">
        <div style="font-size:14.5px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:8px;">
          <span>📌 Permanent Static Table QR System</span>
          <span class="badge badge-green">Deployed on Tables</span>
        </div>
        <div style="font-size:12.5px; color:var(--muted); margin-top:4px; line-height:1.45;">
          Static QR code stickers are permanently affixed to acrylic standees at each cafe table. Customers scan the static code on their table to open the digital menu and place dine-in orders without waiting for a server. You can pause or activate ordering per table at any time.
        </div>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <button class="btn btn-outline btn-sm" onclick="window.openAddTableQRModal()">+ Map New Table</button>
      </div>
    </div>

    <!-- Controls Header & Zone Filters -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${selectedZone === 'all' ? 'active' : ''}" onclick="window.filterQRZone('all')">All Tables (${state.qrCodes.length})</button>
        <button class="ftab ${selectedZone === 'main dining' ? 'active' : ''}" onclick="window.filterQRZone('main dining')">Main Dining</button>
        <button class="ftab ${selectedZone === 'patio & garden' ? 'active' : ''}" onclick="window.filterQRZone('patio & garden')">Patio &amp; Garden</button>
        <button class="ftab ${selectedZone === 'lounge area' ? 'active' : ''}" onclick="window.filterQRZone('lounge area')">Lounge Area</button>
        <button class="ftab ${selectedZone === 'bar counter' ? 'active' : ''}" onclick="window.filterQRZone('bar counter')">Bar &amp; Counter</button>
      </div>
    </div>

    <!-- Table Ordering Management Cards Grid (Clean, No barcode canvas!) -->
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(310px, 1fr)); gap:18px;">
      ${filtered.map(q => {
        const isActive = q.status === 'Active';
        return `
          <div style="background:var(--card); border:1px solid ${isActive ? 'var(--border)' : '#E0DCD5'}; border-top:4px solid ${isActive ? 'var(--accent)' : '#9E9C99'}; border-radius:10px; padding:18px 20px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; transition:transform 0.15s ease, box-shadow 0.15s ease;">
            
            <!-- Table Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <div style="font-size:16px; font-weight:700; color:var(--text);">${q.table}</div>
                <div style="font-size:11.5px; color:var(--muted); margin-top:1px;">Zone: <strong>${q.zone}</strong></div>
              </div>
              <span class="badge ${isActive ? 'badge-green' : 'badge-grey'}">
                ${isActive ? '🟢 Online &amp; Ordering' : '⏸️ Ordering Paused'}
              </span>
            </div>

            <!-- Static Table Link Box -->
            <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:6px; padding:8px 10px; margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--muted); letter-spacing:0.5px;">Static Standee URL</span>
                <button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px; font-size:11px;" onclick="window.copyQRLink('${q.url}', '${q.table}')">📋 Copy</button>
              </div>
              <div style="font-family:ui-monospace, monospace; font-size:11.5px; color:var(--accent); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${q.url}">
                ${q.url}
              </div>
            </div>

            <!-- Key Table Stats Grid -->
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; background:#FAFAF9; border:1px solid var(--border); border-radius:6px; padding:10px; margin-bottom:16px; text-align:center;">
              <div>
                <div style="font-size:10.5px; color:var(--muted);">Scans Today</div>
                <div style="font-size:15px; font-weight:700; color:var(--text); margin-top:2px;">${q.scansToday || 0}</div>
              </div>
              <div>
                <div style="font-size:10.5px; color:var(--muted);">Orders Today</div>
                <div style="font-size:15px; font-weight:700; color:var(--text); margin-top:2px;">${q.ordersToday || 0}</div>
              </div>
              <div>
                <div style="font-size:10.5px; color:var(--muted);">Today's Sales</div>
                <div style="font-size:15px; font-weight:700; color:var(--accent); margin-top:2px;">₹${(q.revenueToday || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>

            <!-- Action Controls -->
            <div style="margin-top:auto; display:flex; gap:8px; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:12px;">
              <button class="btn btn-outline btn-sm" style="flex:1;" onclick="window.previewCustomerOrderPage('${q.id}', '${q.table}', '${q.url}')">
                📱 Preview Page
              </button>
              <button class="btn ${isActive ? 'btn-ghost' : 'btn-success'} btn-sm" style="flex:1;" onclick="window.toggleQRActive('${q.id}')">
                ${isActive ? '⏸️ Pause Table' : '▶️ Resume Table'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Customer Ordering Preview Modal -->
    <div class="modal-backdrop" id="modal-qr-order-preview">
      <div class="modal-box" style="max-width: 440px;">
        <div class="modal-header">
          <div>
            <div class="modal-title" id="preview-modal-table-title">Customer Dine-In Ordering</div>
            <div style="font-size:11.5px; color:var(--muted);" id="preview-modal-table-url"></div>
          </div>
          <button class="modal-close-btn" onclick="window.modal.close('modal-qr-order-preview')">✕</button>
        </div>
        <div class="modal-body" style="padding:16px; background:#F8F7F4;">
          <div style="background:#fff; border:1px solid var(--border); border-radius:10px; padding:16px; margin-bottom:14px; text-align:center;">
            <div style="font-size:24px; margin-bottom:4px;">☕</div>
            <div style="font-weight:700; font-size:16px;">Brew &amp; Co Artisanal Roastery</div>
            <div style="font-size:12px; color:var(--muted);">Dine-In Digital Menu &middot; Table Active</div>
          </div>

          <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--muted); margin-bottom:8px;">Popular Order Choices</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="background:#fff; border:1px solid var(--border); border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; font-size:13px;">Classic Cortado</div>
                <div style="font-size:11px; color:var(--muted);">Double shot espresso + textured milk</div>
                <div style="font-size:12px; font-weight:700; color:var(--accent); margin-top:2px;">₹240</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.toast.success('Added Classic Cortado to simulated table cart!')">+ Add</button>
            </div>
            <div style="background:#fff; border:1px solid var(--border); border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; font-size:13px;">Truffle Scrambled Brioche</div>
                <div style="font-size:11px; color:var(--muted);">Free-range eggs, white truffle oil</div>
                <div style="font-size:12px; font-weight:700; color:var(--accent); margin-top:2px;">₹410</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.toast.success('Added Truffle Scrambled Brioche to simulated table cart!')">+ Add</button>
            </div>
            <div style="background:#fff; border:1px solid var(--border); border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; font-size:13px;">Burnt Basque Cheesecake</div>
                <div style="font-size:11px; color:var(--muted);">Caramelized crust with berry compote</div>
                <div style="font-size:12px; font-weight:700; color:var(--accent); margin-top:2px;">₹340</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.toast.success('Added Cheesecake to simulated table cart!')">+ Add</button>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:12px; color:var(--muted);">Zero contact order flow</span>
          <button class="btn btn-primary btn-sm" onclick="window.toast.success('Order sent directly to KDS kitchen display!'); window.modal.close('modal-qr-order-preview');">Place Table Order</button>
        </div>
      </div>
    </div>
  `;
}

window.filterQRZone = (zone) => {
  selectedZone = zone;
  renderQR();
};

window.copyQRLink = (url, table) => {
  navigator.clipboard.writeText(url).then(() => {
    toast.success(`Copied static ordering link for ${table} to clipboard!`);
  }).catch(() => {
    toast.info(`Static link: ${url}`);
  });
};

window.toggleQRActive = (qrId) => {
  store.toggleQRStatus(qrId);
  const state = store.getState();
  const q = state.qrCodes.find(item => item.id === qrId);
  if (q && q.status === 'Active') {
    toast.success(`${q.table} is now ONLINE & accepting customer orders.`);
  } else {
    toast.info(`${q.table} online ordering has been paused.`);
  }
  renderQR();
};

window.previewCustomerOrderPage = (id, table, url) => {
  const titleEl = document.getElementById('preview-modal-table-title');
  const urlEl = document.getElementById('preview-modal-table-url');
  if (titleEl) titleEl.textContent = `Dine-In Customer Menu — ${table}`;
  if (urlEl) urlEl.textContent = url;
  modal.open('modal-qr-order-preview');
};

window.openAddTableQRModal = () => {
  let modalEl = document.getElementById('modal-add-table-qr');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-add-table-qr';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Map New Table Standee</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-add-table-qr')">✕</button>
      </div>
      <form onsubmit="window.saveNewTableQR(event)">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Table or Counter Name *</label>
            <input type="text" class="form-input" id="new-qr-table" required placeholder="e.g. Table 12, Rooftop Cabana 2">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zone *</label>
              <select class="form-select" id="new-qr-zone" required>
                <option value="Main Dining">Main Dining</option>
                <option value="Patio & Garden">Patio &amp; Garden</option>
                <option value="Lounge Area">Lounge Area</option>
                <option value="Bar Counter">Bar &amp; Counter</option>
                <option value="Takeaway Counter">Takeaway Counter</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Table Code Identifier</label>
              <input type="text" class="form-input" id="new-qr-code" placeholder="e.g. T12" oninput="window.updateGeneratedStaticUrl(this.value)">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Static Standee URL (Permanent)</label>
            <input type="text" class="form-input" id="new-qr-url" readonly value="https://brewandco.cafe/order?table=T12" style="background:#FAFAF9; font-family:monospace;">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-add-table-qr')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Table Standee</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-add-table-qr');
};

window.updateGeneratedStaticUrl = (code) => {
  const urlEl = document.getElementById('new-qr-url');
  if (urlEl) {
    const safeCode = (code || 'T12').trim().toUpperCase().replace(/\s+/g, '-');
    urlEl.value = `https://brewandco.cafe/order?table=${safeCode}`;
  }
};

window.saveNewTableQR = (e) => {
  e.preventDefault();
  const table = document.getElementById('new-qr-table').value.trim();
  const zone = document.getElementById('new-qr-zone').value;
  const url = document.getElementById('new-qr-url').value;

  const state = store.getState();
  const newId = `QR-${String(state.qrCodes.length + 1).padStart(2, '0')}`;

  store.addQRCode({
    id: newId,
    table,
    zone,
    status: 'Active',
    scansToday: 0,
    ordersToday: 0,
    revenueToday: 0,
    totalScans: 0,
    url
  });

  modal.close('modal-add-table-qr');
  toast.success(`Successfully mapped ${table} to static table standee!`);
  renderQR();
};

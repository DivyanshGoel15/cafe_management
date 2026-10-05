/* ══════════════════════════════════════════════════════════════
   BREW & CO — OFFERS & PROMOTIONS VIEW CONTROLLER
   Coupon codes, percentage/flat discounts & usage trackers
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let offerStatusFilter = 'all';

export function renderOffers() {
  const state = store.getState();
  const el = document.getElementById('view-offers');
  if (!el) return;

  let filtered = [...state.offers];
  if (offerStatusFilter !== 'all') {
    filtered = filtered.filter(o => o.status.toLowerCase() === offerStatusFilter.toLowerCase());
  }

  el.innerHTML = `
    <!-- Top Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Active Promotions</div>
        <div class="stat-value">${state.offers.filter(o => o.status === 'Active').length}</div>
        <div class="stat-delta up">Live on checkout &amp; WhatsApp</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Redemptions</div>
        <div class="stat-value">542</div>
        <div class="stat-delta up">+88 used this week</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Revenue Generated</div>
        <div class="stat-value">₹2.18L</div>
        <div class="stat-delta up">Average cart size ₹580</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Scheduled Campaigns</div>
        <div class="stat-value">${state.offers.filter(o => o.status === 'Scheduled').length}</div>
        <div class="stat-delta neutral">Upcoming festive discounts</div>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${offerStatusFilter === 'all' ? 'active' : ''}" onclick="window.filterOffers('all')">All Offers (${state.offers.length})</button>
        <button class="ftab ${offerStatusFilter === 'active' ? 'active' : ''}" onclick="window.filterOffers('active')">Active</button>
        <button class="ftab ${offerStatusFilter === 'scheduled' ? 'active' : ''}" onclick="window.filterOffers('scheduled')">Scheduled</button>
        <button class="ftab ${offerStatusFilter === 'expired' ? 'active' : ''}" onclick="window.filterOffers('expired')">Expired</button>
      </div>

      <button class="btn btn-primary btn-sm" onclick="window.openAddOfferModal()">+ Create Offer</button>
    </div>

    <!-- Offers Grid -->
    <div class="offers-grid">
      ${filtered.length === 0 ? `
        <div style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-icon">🎟️</div>
            <div class="empty-title">No offers found</div>
            <div class="empty-desc">No promotional codes match the selected tab.</div>
          </div>
        </div>
      ` : filtered.map(o => {
        const statusBadge = o.status === 'Active' ? 'badge-green' : o.status === 'Scheduled' ? 'badge-blue' : 'badge-grey';
        const percentUsed = Math.min(100, Math.round((o.usedCount / o.usageLimit) * 100));
        return `
          <div class="offer-card" style="opacity: ${o.status === 'Expired' ? 0.65 : 1};">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <span class="offer-code-pill">${o.code}</span>
              <span class="badge ${statusBadge}">${o.status}</span>
            </div>

            <div style="font-size:15px; font-weight:700; margin-bottom:4px; color:var(--text);">${o.title}</div>
            <div style="font-size:13px; color:var(--accent); font-weight:600; margin-bottom:12px;">
              ${o.discountType === 'percentage' ? `${o.discountValue}% OFF (Max ₹${o.maxDiscount})` : `Flat ₹${o.discountValue} OFF`}
            </div>

            <div style="background:#FAFAF9; padding:10px 12px; border-radius:6px; border:1px solid var(--border); margin-bottom:14px; font-size:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span class="td-muted">Min Order Value</span>
                <strong>₹${o.minOrder}</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span class="td-muted">Validity Range</span>
                <span>${o.startDate} to ${o.endDate}</span>
              </div>
            </div>

            <!-- Usage Progress Bar -->
            <div style="margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; font-size:11.5px; color:var(--muted); margin-bottom:4px;">
                <span>Usage: <strong>${o.usedCount} / ${o.usageLimit}</strong></span>
                <span>${percentUsed}%</span>
              </div>
              <div style="height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
                <div style="height:100%; width:${percentUsed}%; background:var(--accent); border-radius:3px;"></div>
              </div>
            </div>

            <!-- Card Footer -->
            <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px;">
              <button class="btn btn-ghost btn-sm" onclick="window.copyOfferCode('${o.code}')">📋 Copy Code</button>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-ghost btn-sm" onclick="window.toggleOfferActive('${o.id}')">
                  ${o.status === 'Active' ? 'Pause' : 'Activate'}
                </button>
                <button class="btn btn-ghost btn-sm" onclick="window.confirmDeleteOffer('${o.id}')">🗑️</button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

window.filterOffers = (status) => {
  offerStatusFilter = status;
  renderOffers();
};

window.copyOfferCode = (code) => {
  navigator.clipboard.writeText(code).then(() => {
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  }).catch(() => {
    toast.info(`Coupon: ${code}`);
  });
};

window.toggleOfferActive = (id) => {
  store.toggleOfferStatus(id);
  toast.info('Offer status updated.');
  renderOffers();
};

window.confirmDeleteOffer = (id) => {
  modal.confirm({
    title: 'Delete Offer',
    message: 'Are you sure you want to permanently delete this offer code?',
    isDanger: true,
    confirmText: 'Delete Offer',
    onConfirm: () => {
      store.deleteOffer(id);
      toast.info('Offer deleted.');
      renderOffers();
    }
  });
};

window.openAddOfferModal = () => {
  let modalEl = document.getElementById('modal-offer-form');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-offer-form';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Create Offer / Promo Code</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-offer-form')">✕</button>
      </div>
      <form onsubmit="window.saveNewOffer(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Coupon Code *</label>
              <input type="text" class="form-input" id="off-code" required placeholder="e.g. MONSOON20" style="text-transform:uppercase;">
            </div>
            <div class="form-group">
              <label class="form-label">Offer Title *</label>
              <input type="text" class="form-input" id="off-title" required placeholder="e.g. Monsoon Special 20% OFF">
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Discount Type *</label>
              <select class="form-select" id="off-type">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Discount Value *</label>
              <input type="number" min="1" class="form-input" id="off-value" required value="20">
            </div>
            <div class="form-group">
              <label class="form-label">Max Cap (₹)</label>
              <input type="number" min="1" class="form-input" id="off-max" value="150">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Min Order Value (₹) *</label>
              <input type="number" min="0" class="form-input" id="off-min" required value="300">
            </div>
            <div class="form-group">
              <label class="form-label">Total Usage Limit *</label>
              <input type="number" min="1" class="form-input" id="off-limit" required value="300">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date *</label>
              <input type="date" class="form-input" id="off-start" required value="2026-09-01">
            </div>
            <div class="form-group">
              <label class="form-label">End Date *</label>
              <input type="date" class="form-input" id="off-end" required value="2026-09-30">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-offer-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Create Offer</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-offer-form');
};

window.saveNewOffer = (e) => {
  e.preventDefault();
  const code = document.getElementById('off-code').value.trim().toUpperCase();
  const title = document.getElementById('off-title').value.trim();
  const discountType = document.getElementById('off-type').value;
  const discountValue = parseFloat(document.getElementById('off-value').value);
  const maxDiscount = parseFloat(document.getElementById('off-max').value) || discountValue;
  const minOrder = parseFloat(document.getElementById('off-min').value) || 0;
  const usageLimit = parseInt(document.getElementById('off-limit').value, 10);
  const startDate = document.getElementById('off-start').value;
  const endDate = document.getElementById('off-end').value;

  const newOffer = {
    id: 'OFF-' + Date.now(),
    code,
    title,
    discountType,
    discountValue,
    maxDiscount,
    minOrder,
    usageLimit,
    usedCount: 0,
    startDate,
    endDate,
    status: 'Active'
  };

  store.createOffer(newOffer);
  modal.close('modal-offer-form');
  toast.success(`Coupon ${code} created successfully.`);
  renderOffers();
};

/* ══════════════════════════════════════════════════════════════
   BREW & CO — REVIEWS & REPUTATION VIEW CONTROLLER
   Google, WhatsApp & QR feedback with AI-assisted replies
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let reviewSourceFilter = 'all';
let reviewRatingFilter = 'all';

export function renderReviews() {
  const state = store.getState();
  const el = document.getElementById('view-reviews');
  if (!el) return;

  let filtered = [...state.reviews];
  if (reviewSourceFilter !== 'all') {
    filtered = filtered.filter(r => r.source.toLowerCase() === reviewSourceFilter.toLowerCase());
  }
  if (reviewRatingFilter !== 'all') {
    filtered = filtered.filter(r => r.rating === parseInt(reviewRatingFilter, 10));
  }

  el.innerHTML = `
    <!-- Rating Breakdown Card -->
    <div class="rating-breakdown-card">
      <div style="text-align:center; min-width:140px;">
        <div class="rating-big-num">4.8</div>
        <div class="rating-stars">★★★★★</div>
        <div style="font-size:12px; color:var(--muted); margin-top:4px;">Based on 284 reviews</div>
      </div>

      <!-- Star Distribution Bars -->
      <div style="flex:1; display:flex; flex-direction:column; gap:6px; width:100%;">
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">5 Stars</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:82%; background:#2E7D55;"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">82%</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">4 Stars</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:12%; background:var(--accent);"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">12%</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">3 Stars</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:4%; background:#B8860B;"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">4%</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">2 Stars</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:1%; background:#C0392B;"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">1%</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">1 Star</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:1%; background:#C0392B;"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">1%</span>
        </div>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <div class="filter-tabs">
          <button class="ftab ${reviewSourceFilter === 'all' ? 'active' : ''}" onclick="window.filterReviewSource('all')">All Sources (${state.reviews.length})</button>
          <button class="ftab ${reviewSourceFilter === 'google' ? 'active' : ''}" onclick="window.filterReviewSource('google')">Google Maps</button>
          <button class="ftab ${reviewSourceFilter === 'whatsapp' ? 'active' : ''}" onclick="window.filterReviewSource('whatsapp')">WhatsApp</button>
          <button class="ftab ${reviewSourceFilter === 'dine-in qr' ? 'active' : ''}" onclick="window.filterReviewSource('dine-in qr')">Table QR</button>
        </div>

        <select class="form-select" style="width:auto; padding:5px 10px; font-size:12.5px;" onchange="window.filterReviewRating(this.value)">
          <option value="all">All Ratings</option>
          <option value="5">★★★★★ (5 Stars)</option>
          <option value="4">★★★★☆ (4 Stars)</option>
          <option value="3">★★★☆☆ (3 Stars)</option>
        </select>
      </div>

      <button class="btn btn-outline btn-sm" onclick="window.requestReviewsWhatsApp()">📢 Send Review Request Campaign</button>
    </div>

    <!-- Reviews List -->
    <div style="display:flex; flex-direction:column; gap:12px;">
      ${filtered.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">⭐</div>
          <div class="empty-title">No reviews found</div>
          <div class="empty-desc">No reviews match the current rating or source filter.</div>
        </div>
      ` : filtered.map(r => `
        <div class="review-item">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="cust-av" style="width:34px; height:34px; font-size:12px;">
                ${r.customer.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style="font-weight:700; font-size:14px;">${r.customer}</div>
                <div style="font-size:11.5px; color:var(--muted);">${r.date} &middot; via <span style="font-weight:600;">${r.source}</span></div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:8px;">
              <span class="rating-stars" style="font-size:14px;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
              <span class="badge ${r.status === 'Handled' ? 'badge-green' : 'badge-yellow'}">${r.status}</span>
            </div>
          </div>

          <p style="font-size:13.5px; color:var(--text); line-height:1.5; margin-bottom:12px;">${r.text}</p>

          <!-- Existing Reply if present -->
          ${r.reply ? `
            <div style="background:#FAFAF9; border-left:3px solid var(--accent); padding:10px 14px; border-radius:4px; font-size:12.5px; margin-bottom:10px;">
              <div style="font-weight:600; color:var(--text); font-size:11.5px; margin-bottom:2px;">Brew &amp; Co Response &middot; <span style="font-weight:400; color:var(--muted);">${r.repliedAt || 'Recently'}</span></div>
              <div style="color:var(--text-secondary);">${r.reply}</div>
            </div>
          ` : ''}

          <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid var(--border); padding-top:8px;">
            <button class="btn btn-ghost btn-sm" onclick="window.toggleReviewStatus('${r.id}')">
              ${r.status === 'Handled' ? 'Mark Pending' : 'Mark as Handled'}
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.openReplyModal('${r.id}')">
              ${r.reply ? 'Edit Reply' : '💬 Reply to Customer'}
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.filterReviewSource = (src) => {
  reviewSourceFilter = src;
  renderReviews();
};

window.filterReviewRating = (rating) => {
  reviewRatingFilter = rating;
  renderReviews();
};

window.toggleReviewStatus = (id) => {
  store.toggleReviewHandled(id);
  toast.info('Review status updated.');
  renderReviews();
};

window.requestReviewsWhatsApp = () => {
  toast.success('Automated WhatsApp review invitations sent to today\'s completed orders!');
};

window.openReplyModal = (reviewId) => {
  const state = store.getState();
  const r = state.reviews.find(item => item.id === reviewId);
  if (!r) return;

  let modalEl = document.getElementById('modal-review-reply');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-review-reply';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Reply to ${r.customer}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-review-reply')">✕</button>
      </div>
      <div class="modal-body">
        <div style="background:#FAFAF9; padding:10px 12px; border-radius:6px; font-size:12.5px; margin-bottom:12px; border:1px solid var(--border);">
          <div style="font-weight:600; margin-bottom:2px;">"${r.text}"</div>
          <div style="color:var(--muted); font-size:11px;">Rating: ${'★'.repeat(r.rating)} (${r.source})</div>
        </div>

        <!-- Quick AI Template Snippets -->
        <div style="font-size:11px; font-weight:700; color:var(--muted); margin-bottom:6px; text-transform:uppercase;">Quick AI Templates</div>
        <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:12px;">
          <button type="button" class="btn btn-outline btn-sm" style="text-align:left; justify-content:flex-start;" onclick="document.getElementById('review-reply-text').value='Thank you so much for the glowing review! We are delighted you enjoyed your time with us and cannot wait to welcome you back.'">
            ✨ Delighted &amp; Warm Thank You
          </button>
          <button type="button" class="btn btn-outline btn-sm" style="text-align:left; justify-content:flex-start;" onclick="document.getElementById('review-reply-text').value='Thank you for your valuable feedback. We sincerely apologize for any delay during peak hours and are taking steps to speed up service.'">
            🙏 Apologetic &amp; Solution-Oriented
          </button>
        </div>

        <div class="form-group">
          <label class="form-label">Your Response *</label>
          <textarea class="form-textarea" id="review-reply-text" rows="4" placeholder="Write personalized response...">${r.reply || ''}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-review-reply')">Cancel</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="window.submitReviewReply('${r.id}')">Publish Reply</button>
      </div>
    </div>
  `;

  modal.open('modal-review-reply');
};

window.submitReviewReply = (reviewId) => {
  const text = document.getElementById('review-reply-text').value.trim();
  if (!text) {
    toast.error('Reply text cannot be blank.');
    return;
  }

  store.replyReview(reviewId, text);
  modal.close('modal-review-reply');
  toast.success('Your response has been published!');
  renderReviews();
};

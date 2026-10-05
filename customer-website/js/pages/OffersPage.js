/**
 * Offers Page View
 * Shows active promotions, coupon code copier, terms modal and booking integration
 */
import { offersService } from '../services/offersService.js';
import { Toast } from '../components/Toast.js';

let activeOffersTab = 'active';

export async function renderOffersPage() {
  const [activeOffers, allOffers] = await Promise.all([
    offersService.getOffers(true),
    offersService.getOffers(false)
  ]);

  const displayedOffers = activeOffersTab === 'active' 
    ? activeOffers 
    : allOffers.filter(o => !o.isActive || new Date(o.validUntil) < new Date());

  return `
    <div style="background:var(--forest); color:#FFF; padding:60px 0 45px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Special Vouchers</span>
        <h1 style="color:#FFF; margin-bottom:12px;">Exclusive Offers &amp; Perks</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:1.1rem;">
          Enjoy promotional privileges on your morning artisanal coffee, group celebrations, and weekend sourdough dining.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- Offers Filter Tabs -->
        <div style="display:flex; justify-content:center; margin-bottom:36px;">
          <div class="tab-list">
            <button 
              class="tab-btn ${activeOffersTab === 'active' ? 'active' : ''}" 
              onclick="window.switchOffersTab('active')"
              id="tab-offers-active"
            >
              <span>Active Promotions (${activeOffers.length})</span>
            </button>
            <button 
              class="tab-btn ${activeOffersTab === 'expired' ? 'active' : ''}" 
              onclick="window.switchOffersTab('expired')"
              id="tab-offers-expired"
            >
              <span>Past / Expired Archive</span>
            </button>
          </div>
        </div>

        <div id="offers-list-container">
          ${renderOffersGrid(displayedOffers)}
        </div>

        <!-- How To Redeem Info Card -->
        <div style="margin-top:60px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:36px; box-shadow:var(--shadow-xs);">
          <div style="text-align:center; max-width:600px; margin:0 auto 28px;">
            <h3 style="font-size:1.4rem; color:var(--forest); margin-bottom:8px;">How to Redeem Your Perk</h3>
            <p style="font-size:0.92rem; color:var(--text-muted);">Simple steps to apply discounts during your visit or reservation.</p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:24px;">
            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--copper-dim); color:var(--copper); font-size:1.3rem; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-weight:700;">1</div>
              <h4 style="font-size:1.05rem; margin-bottom:6px;">Copy Coupon Code</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary);">Click the "Copy Code" button on any active offer card above.</p>
            </div>

            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--copper-dim); color:var(--copper); font-size:1.3rem; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-weight:700;">2</div>
              <h4 style="font-size:1.05rem; margin-bottom:6px;">Book Table Online</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary);">Paste the code in the promo box during table reservation checkout.</p>
            </div>

            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--copper-dim); color:var(--copper); font-size:1.3rem; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-weight:700;">3</div>
              <h4 style="font-size:1.05rem; margin-bottom:6px;">Show Code at Cafe</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary);">Or show the code directly to your barista or server when ordering at table.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderOffersGrid(offers) {
  if (offers.length === 0) {
    return `
      <div style="text-align:center; padding:60px 20px; background:#FFF; border:1px solid var(--border); border-radius:var(--radius-md);">
        <div style="font-size:3rem; margin-bottom:12px;">🎟️</div>
        <h3>No offers found in this category</h3>
        <p style="color:var(--text-muted); margin-bottom:16px;">Check our active promotions tab for current valid discounts.</p>
        <button class="btn btn-outline" onclick="window.switchOffersTab('active')">View Active Offers</button>
      </div>
    `;
  }

  return `
    <div class="offers-grid">
      ${offers.map(offer => `
        <div class="offer-card" style="background:${offer.bgGradient};">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span class="offer-badge">${offer.badge}</span>
              <span style="font-size:0.75rem; color:rgba(255,255,255,0.7);">${offer.validDays} • ${offer.validHours}</span>
            </div>
            <h3 class="offer-title">${offer.title}</h3>
            <div class="offer-discount">${offer.discountDisplay}</div>
            <p class="offer-desc">${offer.description}</p>
          </div>

          <div>
            <div class="offer-voucher-box">
              <div>
                <span style="font-size:0.75rem; text-transform:uppercase; color:rgba(255,255,255,0.6); display:block;">Promo Code</span>
                <span class="offer-code">${offer.code}</span>
              </div>
              <button class="btn btn-sm btn-outline-copper" style="color:#FFF; border-color:rgba(255,255,255,0.4);" onclick="window.copyOfferCode('${offer.code}')">
                Copy Code
              </button>
            </div>

            <!-- Terms Details Toggle -->
            <details style="margin-bottom:18px; font-size:0.8rem; color:rgba(255,255,255,0.8); cursor:pointer;">
              <summary style="font-weight:600; color:var(--copper-light); margin-bottom:6px;">View Terms &amp; Conditions</summary>
              <ul style="padding-left:18px; margin-top:6px; display:flex; flex-direction:column; gap:4px; color:rgba(255,255,255,0.7);">
                ${offer.terms.map(t => `<li>${t}</li>`).join('')}
                <li>Valid until ${offer.validUntil}</li>
                <li>Minimum spend: ₹${offer.minSpend}</li>
              </ul>
            </details>

            <a href="#/reservations?code=${offer.code}" class="btn btn-primary w-full" style="width:100%;">
              Book Table with ${offer.code} &rarr;
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Global offer copy handlers
if (typeof window !== 'undefined') {
  window.copyOfferCode = function(code) {
    navigator.clipboard?.writeText(code)
      .then(() => Toast.show(`Coupon code "${code}" copied to clipboard!`, 'success'))
      .catch(() => Toast.show(`Code: ${code}`, 'info'));
  };

  window.switchOffersTab = async function(tab) {
    activeOffersTab = tab;
    const container = document.getElementById('offers-list-container');
    if (!container) return;
    container.innerHTML = '<div style="text-align:center; padding:40px;"><div class="spinner spinner-copper"></div></div>';

    const [activeOffers, allOffers] = await Promise.all([
      offersService.getOffers(true),
      offersService.getOffers(false)
    ]);

    const displayedOffers = activeOffersTab === 'active' 
      ? activeOffers 
      : allOffers.filter(o => !o.isActive || new Date(o.validUntil) < new Date());

    container.innerHTML = renderOffersGrid(displayedOffers);

    const activeBtn = document.getElementById('tab-offers-active');
    const expiredBtn = document.getElementById('tab-offers-expired');
    if (activeBtn && expiredBtn) {
      activeBtn.classList.toggle('active', tab === 'active');
      expiredBtn.classList.toggle('active', tab === 'expired');
    }
  };
}

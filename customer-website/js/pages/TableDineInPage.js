/**
 * Table Dine-In Gateway Page View
 * Dedicated placeholder route for QR code scans (e.g. /table/7 or #/table/7)
 */
import { tableService } from '../services/tableService.js';
import { CAFE_INFO } from '../data/cafeData.js';
import { Toast } from '../components/Toast.js';

export async function renderTableDineInPage(params = {}) {
  const tableParam = params.tableId || '7';
  const tableInfo = await tableService.getTableInfo(tableParam);

  if (!tableInfo || !tableInfo.isValid) {
    return `
      <section class="section">
        <div class="container" style="max-width:560px; text-align:center;">
          <div class="card" style="padding:48px 30px;">
            <div style="font-size:3rem; margin-bottom:14px;">⚠️</div>
            <h2 style="color:var(--forest); margin-bottom:8px;">Unrecognized Table QR</h2>
            <p style="color:var(--text-muted); margin-bottom:24px;">
              Could not identify a table for reference "${tableParam}". Please ask your floor attendant for assistance.
            </p>
            <a href="#/menu" class="btn btn-primary">Browse Public Menu &rarr;</a>
          </div>
        </div>
      </section>
    `;
  }

  return `
    <div style="background:var(--forest); color:#FFF; padding:45px 0 35px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Dine-In Guest Gateway</span>
        <h1 style="color:#FFF; font-size:clamp(1.8rem, 3.5vw, 2.6rem); margin-bottom:6px;">
          ${tableInfo.welcomeTitle}
        </h1>
        <p style="color:rgba(255,255,255,0.8); font-size:1rem;">
          ${tableInfo.welcomeSubtitle}
        </p>
      </div>
    </div>

    <section class="section" style="padding-top:40px;">
      <div class="container">
        <div class="table-gateway-card">
          <div class="table-icon-circle">
            🍽️
          </div>

          <span class="table-badge-large" id="table-badge-display">
            Table #${tableInfo.tableNumber} • Active Session
          </span>

          <h2 style="font-size:1.6rem; color:var(--forest); margin-bottom:10px;">
            Enjoy Your Dine-In Meal
          </h2>

          <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:28px; line-height:1.5;">
            Browse our full food and specialty coffee catalog, check dietary ingredients, and prepare your order directly from your mobile device.
          </p>

          <!-- Primary CTA Button -->
          <div style="margin-bottom:28px;">
            <a href="#/menu?table=${tableInfo.tableNumber}&dineIn=true" class="btn btn-primary btn-lg" id="btn-view-order-menu" style="width:100%; font-size:1.1rem; padding:16px;">
              <span>🍽️ View Menu &amp; Order</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Floor Service Assistance Buttons -->
          <div style="border-top:1px dashed var(--border); padding-top:20px; text-align:left;">
            <h4 style="font-size:0.92rem; color:var(--forest); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">
              Quick Table Assistance
            </h4>
            <div class="table-service-actions">
              <button type="button" class="btn btn-outline btn-sm" onclick="window.callTableWaiter(${tableInfo.tableNumber})">
                🔔 Call Attendant
              </button>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.requestTableWater(${tableInfo.tableNumber})">
                💧 Request Mineral Water
              </button>
            </div>
          </div>

          <!-- Integration Architecture Notice -->
          <div style="margin-top:28px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 16px; font-size:0.8rem; color:var(--text-muted); text-align:left; display:flex; gap:10px; align-items:flex-start;">
            <span style="font-size:1.1rem; color:var(--copper);">ℹ️</span>
            <div>
              <strong>QR Dine-In Handoff:</strong> This gateway connects with the Cafe Aroma QR Dine-In Ordering &amp; POS Module to provide kitchen dispatch and live order tracking.
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Global table action handlers
if (typeof window !== 'undefined') {
  window.callTableWaiter = async function(tableNum) {
    try {
      await fetch('http://localhost:4000/api/table-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: parseInt(tableNum, 10),
          requestType: 'waiter',
          notes: `Dine-in guest at Table ${tableNum} called waiter.`
        })
      });
    } catch (e) {}
    Toast.show(`Attendant summoned for Table ${tableNum}. A team member will visit you shortly!`, 'info');
  };

  window.requestTableWater = async function(tableNum) {
    try {
      await fetch('http://localhost:4000/api/table-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: parseInt(tableNum, 10),
          requestType: 'water',
          notes: `Mineral water requested for Table ${tableNum}.`
        })
      });
    } catch (e) {}
    Toast.show(`Water request received for Table ${tableNum}. Refreshments on the way!`, 'success');
  };
}


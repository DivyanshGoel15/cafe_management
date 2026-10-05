/**
 * Terms & Conditions Page View
 */
import { CAFE_INFO } from '../data/cafeData.js';

export async function renderTermsPage() {
  return `
    <div style="background:var(--forest); color:#FFF; padding:50px 0 40px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Guest Agreement</span>
        <h1 style="color:#FFF; margin-bottom:8px;">Terms &amp; Conditions</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:0.95rem;">
          Effective: September 2026 • Governing table bookings, dine-in visits and digital vouchers.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container" style="max-width:820px;">
        <div class="card" style="padding:40px; line-height:1.7; font-size:0.95rem;">
          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">1. Reservation &amp; Seating Policy</h2>
          <p style="margin-bottom:20px;">
            Confirmed reservations are held for up to 15 minutes past scheduled arrival time. If your party is delayed, please notify our host desk via telephone at ${CAFE_INFO.contact.phoneDisplay}. While we strive to honor specific seating area requests (e.g. Courtyard Patio or Window Alcove), final table allocation is subject to live floor dynamics.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">2. Cancellations &amp; Modifications</h2>
          <p style="margin-bottom:20px;">
            Guests may cancel or modify reservations online or via phone at zero fee. We appreciate at least 2 hours notice for table cancellations to permit allocation to waiting guests.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">3. Food Allergens &amp; Dietary Notes</h2>
          <p style="margin-bottom:20px;">
            While we take meticulous precautions to prevent cross-contamination, our kitchen prepares dishes containing tree nuts, dairy, gluten, and eggs. Guests with severe allergies are requested to inform our team prior to ordering.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">4. Promotional Vouchers &amp; Discounts</h2>
          <p style="margin-bottom:24px;">
            Promotional codes must be applied or presented before final bill generation. Offers cannot be clubbed together unless explicitly specified.
          </p>

          <div style="border-top:1px dashed var(--border); padding-top:20px;">
            <a href="#/" class="btn btn-outline btn-sm">&larr; Return to Home</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

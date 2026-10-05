/**
 * Privacy Policy Page View
 */
import { CAFE_INFO } from '../data/cafeData.js';

export async function renderPrivacyPage() {
  return `
    <div style="background:var(--forest); color:#FFF; padding:50px 0 40px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Legal Integrity</span>
        <h1 style="color:#FFF; margin-bottom:8px;">Privacy Policy</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:0.95rem;">
          Last updated: September 2026 • Effective for all guests of ${CAFE_INFO.name}.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container" style="max-width:820px;">
        <div class="card" style="padding:40px; line-height:1.7; font-size:0.95rem;">
          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">1. Information We Collect</h2>
          <p style="margin-bottom:20px;">
            When you make a table reservation, submit a contact inquiry, or join the Aroma Coffee Club, we collect contact information including your full name, phone number, and optional email address. This information is exclusively utilized to verify table availability, send SMS confirmation alerts, and process dietary preferences.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">2. How Your Data is Used</h2>
          <p style="margin-bottom:20px;">
            Your personal information is used strictly to deliver hospitality services:
          </p>
          <ul style="padding-left:20px; margin-bottom:20px; display:flex; flex-direction:column; gap:8px;">
            <li>Dispatching booking confirmation, calendar invites, and table ready notices.</li>
            <li>Responding directly to inquiries regarding private events, catering, or culinary questions.</li>
            <li>Sending exclusive newsletter promotions and micro-lot coffee release announcements (only with opt-in consent).</li>
          </ul>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">3. Data Protection &amp; Confidentiality</h2>
          <p style="margin-bottom:20px;">
            We do not sell, rent, or trade your personal information to third-party advertisers. All customer data is safeguarded with modern TLS encryption standards.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">4. Contact &amp; Grievance Redressal</h2>
          <p style="margin-bottom:24px;">
            For privacy inquiries or to request deletion of your reservation history, contact our Data Governance Officer at 
            <a href="mailto:privacy@cafearoma.com" style="color:var(--copper); font-weight:600;">privacy@cafearoma.com</a>.
          </p>

          <div style="border-top:1px dashed var(--border); padding-top:20px;">
            <a href="#/" class="btn btn-outline btn-sm">&larr; Return to Home</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

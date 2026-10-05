/**
 * Contact & Location Page View
 * Location details, dynamic opening status, interactive map card, validated contact form, and FAQs
 */
import { CAFE_INFO, CAFE_FAQS } from '../data/cafeData.js';
import { cafeService } from '../services/cafeService.js';
import { contactService } from '../services/contactService.js';
import { Toast } from '../components/Toast.js';

export async function renderContactPage() {
  const status = cafeService.isOpenNow();

  return `
    <div style="background:var(--forest); color:#FFF; padding:60px 0 45px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Get in Touch</span>
        <h1 style="color:#FFF; margin-bottom:12px;">Visit Us in Connaught Place</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:1.1rem;">
          We are located at 12 Heritage Lane, Inner Circle. Drop by for a cup or send us a message for private event inquiries.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container contact-grid">
        <!-- Col 1: Location Info, Hours & Map -->
        <div>
          <div class="contact-info-list">
            <!-- Address Card -->
            <div class="contact-info-card">
              <div class="contact-info-icon">📍</div>
              <div>
                <h4 style="font-size:1.1rem; margin-bottom:4px; color:var(--forest);">Cafe Location</h4>
                <p style="font-size:0.92rem; margin-bottom:6px;">${CAFE_INFO.address.full}</p>
                <a href="${CAFE_INFO.address.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--copper); font-size:0.85rem; font-weight:600;">
                  Open in Google Maps &rarr;
                </a>
              </div>
            </div>

            <!-- Phone Card -->
            <div class="contact-info-card">
              <div class="contact-info-icon">📞</div>
              <div>
                <h4 style="font-size:1.1rem; margin-bottom:4px; color:var(--forest);">Reservations &amp; Floor</h4>
                <p style="font-size:0.92rem; margin-bottom:6px;">
                  <a href="tel:${CAFE_INFO.contact.phone}">${CAFE_INFO.contact.phoneDisplay}</a>
                </p>
                <span style="font-size:0.82rem; color:var(--text-muted);">Available daily from 8:00 AM to 11:00 PM</span>
              </div>
            </div>

            <!-- Email Card -->
            <div class="contact-info-card">
              <div class="contact-info-icon">✉️</div>
              <div>
                <h4 style="font-size:1.1rem; margin-bottom:4px; color:var(--forest);">Email Inquiries</h4>
                <p style="font-size:0.92rem; margin-bottom:4px;">
                  General: <a href="mailto:${CAFE_INFO.contact.email}" style="color:var(--copper);">${CAFE_INFO.contact.email}</a>
                </p>
                <p style="font-size:0.92rem;">
                  Events: <a href="mailto:events@cafearoma.com" style="color:var(--copper);">events@cafearoma.com</a>
                </p>
              </div>
            </div>

            <!-- Hours Card with Live Status -->
            <div class="contact-info-card">
              <div class="contact-info-icon">⏰</div>
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <h4 style="font-size:1.1rem; color:var(--forest);">Operating Schedule</h4>
                  <span class="badge ${status.isOpen ? 'badge-veg' : 'badge-nonveg'}">
                    <span class="status-dot ${status.isOpen ? 'open' : 'closed'}"></span>
                    ${status.statusText}
                  </span>
                </div>
                <div style="font-size:0.88rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:4px;">
                  <div style="display:flex; justify-content:space-between;">
                    <span>Monday – Thursday:</span>
                    <strong>8:00 AM – 11:00 PM</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span>Friday:</span>
                    <strong>8:00 AM – 11:30 PM</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span>Saturday – Sunday:</span>
                    <strong>7:30 AM – 11:30 PM</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Map Placeholder -->
          <div class="map-placeholder-box">
            <div class="map-pin">☕</div>
            <h4 style="color:var(--forest); margin-bottom:4px;">Cafe Aroma — Heritage Lane</h4>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Block A, Inner Circle, Connaught Place</p>
            <a href="${CAFE_INFO.address.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              🧭 Get Turn-by-Turn Directions
            </a>
          </div>
        </div>

        <!-- Col 2: Validated Contact Form -->
        <div>
          <div class="card" style="padding:36px; box-shadow:var(--shadow-md);">
            <h3 style="font-size:1.45rem; color:var(--forest); margin-bottom:8px;">Send Us a Message</h3>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:24px;">
              Have questions about menu allergens, private party bookings, coffee workshops, or corporate catering? Drop us a note.
            </p>

            <form id="contact-form" onsubmit="window.handleContactSubmit(event)">
              <div id="contact-feedback" style="display:none; padding:12px 16px; border-radius:var(--radius-sm); margin-bottom:20px; font-size:0.92rem;"></div>

              <div class="form-group">
                <label class="form-label" for="contact-name">Your Full Name <span class="required">*</span></label>
                <input type="text" id="contact-name" class="form-input" placeholder="e.g. Vikram Malhotra" required>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div class="form-group">
                  <label class="form-label" for="contact-email">Email Address <span class="required">*</span></label>
                  <input type="email" id="contact-email" class="form-input" placeholder="vikram@example.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-phone">Phone Number</label>
                  <input type="tel" id="contact-phone" class="form-input" placeholder="+91 98765 43210">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-subject">Inquiry Nature</label>
                <select id="contact-subject" class="form-select">
                  <option value="General Inquiry">General Question &amp; Feedback</option>
                  <option value="Private Dining & Events">Private Event / Banquet Booking</option>
                  <option value="Corporate Catering">Office &amp; Corporate Catering</option>
                  <option value="Coffee Workshop">Barista &amp; Coffee Cupping Workshop</option>
                  <option value="Press & Media">Press &amp; Media Collaboration</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-message">Your Message <span class="required">*</span></label>
                <textarea id="contact-message" class="form-textarea" rows="4" placeholder="Tell us how we can assist you..." required></textarea>
              </div>

              <button type="submit" class="btn btn-primary w-full" id="btn-submit-contact" style="width:100%; padding:14px;">
                <span>Send Message</span>
                <span>&rarr;</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Accordion Section -->
    <section class="section section-alt">
      <div class="container" style="max-width:840px;">
        <div class="section-header">
          <span class="section-tag">Frequently Asked</span>
          <h2 class="section-title">Common Questions</h2>
          <p class="section-subtitle">Everything you need to know about visiting Cafe Aroma.</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:14px;">
          ${CAFE_FAQS.map((faq, idx) => `
            <details class="card" style="padding:18px 24px; cursor:pointer;" ${idx === 0 ? 'open' : ''}>
              <summary style="font-weight:600; font-size:1.05rem; color:var(--forest); user-select:none;">
                ${faq.q}
              </summary>
              <p style="margin-top:12px; font-size:0.92rem; color:var(--text-secondary); line-height:1.6;">
                ${faq.a}
              </p>
            </details>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// Global contact form submission handler
if (typeof window !== 'undefined') {
  window.handleContactSubmit = async function(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-submit-contact');
    const feedback = document.getElementById('contact-feedback');

    const name = document.getElementById('contact-name')?.value?.trim();
    const email = document.getElementById('contact-email')?.value?.trim();
    const phone = document.getElementById('contact-phone')?.value?.trim();
    const subject = document.getElementById('contact-subject')?.value;
    const message = document.getElementById('contact-message')?.value?.trim();

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Dispatching Message...';
    }

    try {
      const res = await contactService.submitContact({ name, email, phone, subject, message });

      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = 'var(--veg-green-bg)';
        feedback.style.border = '1px solid var(--veg-green-border)';
        feedback.style.color = 'var(--veg-green)';
        feedback.innerHTML = `✓ ${res.message}`;
      }

      Toast.show(`Inquiry received! Reference: ${res.ticketId}`, 'success', 5000);
      document.getElementById('contact-form')?.reset();
    } catch (err) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = 'var(--nonveg-red-bg)';
        feedback.style.border = '1px solid var(--nonveg-red-border)';
        feedback.style.color = 'var(--nonveg-red)';
        feedback.textContent = err.message || 'Failed to submit form.';
      }
      Toast.show(err.message || 'Error submitting message.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Send Message</span> <span>&rarr;</span>';
      }
    }
  };
}

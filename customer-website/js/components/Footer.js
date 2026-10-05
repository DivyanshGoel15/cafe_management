/**
 * Footer Component
 */
import { CAFE_INFO } from '../data/cafeData.js';
import { Toast } from './Toast.js';

export function renderFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Contact -->
          <div class="footer-col-brand">
            <div class="brand-logo" style="margin-bottom:16px;">
              <div class="brand-emblem">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/>
                  <line x1="10" y1="1" x2="10" y2="4"/>
                  <line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <div class="brand-text-wrap">
                <span class="brand-name" style="color:#FFF;">${CAFE_INFO.name}</span>
                <span class="brand-tagline">Artisanal Coffee &amp; Kitchen</span>
              </div>
            </div>
            <p>${CAFE_INFO.tagline}. Single-origin estate roasts, scratch-made sourdough bakes, and soulful moments in Connaught Place.</p>
            <div style="font-size:0.88rem; color:rgba(255,255,255,0.7); display:flex; flex-direction:column; gap:6px;">
              <span>📍 ${CAFE_INFO.address.full}</span>
              <span>📞 <a href="tel:${CAFE_INFO.contact.phone}" style="color:var(--copper-light);">${CAFE_INFO.contact.phoneDisplay}</a></span>
              <span>✉️ <a href="mailto:${CAFE_INFO.contact.email}" style="color:var(--copper-light);">${CAFE_INFO.contact.email}</a></span>
            </div>
            <div class="footer-social-links">
              <a href="${CAFE_INFO.social.instagram}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">IG</a>
              <a href="${CAFE_INFO.social.facebook}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook">FB</a>
              <a href="${CAFE_INFO.contact.whatsappLink}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="WhatsApp">WA</a>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div>
            <h4 class="footer-col-title">Explore</h4>
            <ul class="footer-links">
              <li><a href="#/">Home</a></li>
              <li><a href="#/menu">Full Food &amp; Coffee Menu</a></li>
              <li><a href="#/about">Our Story &amp; Roastery</a></li>
              <li><a href="#/offers">Exclusive Offers</a></li>
              <li><a href="#/gallery">Cafe Photo Gallery</a></li>
              <li><a href="#/reservations">Book a Table Online</a></li>
              <li><a href="#/booking-confirmation">Check Booking Status</a></li>
            </ul>
          </div>

          <!-- Col 3: Operating Hours -->
          <div>
            <h4 class="footer-col-title">Opening Hours</h4>
            <div class="footer-hours-list">
              <div class="footer-hours-row">
                <span>Mon – Thu</span>
                <span>8:00 AM – 11:00 PM</span>
              </div>
              <div class="footer-hours-row">
                <span>Friday</span>
                <span>8:00 AM – 11:30 PM</span>
              </div>
              <div class="footer-hours-row">
                <span>Saturday</span>
                <span>7:30 AM – 11:30 PM</span>
              </div>
              <div class="footer-hours-row">
                <span>Sunday</span>
                <span>7:30 AM – 11:00 PM</span>
              </div>
            </div>
            <div style="margin-top:18px; padding:10px 14px; background:rgba(255,255,255,0.06); border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.1); font-size:0.8rem; color:rgba(255,255,255,0.75);">
              ☕ Kitchen last order: 45 mins prior to closing.
            </div>
          </div>

          <!-- Col 4: Newsletter & Club -->
          <div>
            <h4 class="footer-col-title">Aroma Coffee Club</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.65); margin-bottom:14px;">
              Subscribe for secret tasting invitations, seasonal micro-lot bean drops, and 15% off your next visit.
            </p>
            <form id="footer-newsletter-form" onsubmit="window.handleNewsletterSubmit(event)" style="display:flex; flex-direction:column; gap:10px;">
              <input type="email" id="newsletter-email" class="form-input" placeholder="Your email address" required style="background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2); color:#FFFFFF;">
              <button type="submit" class="btn btn-primary btn-sm" style="width:100%;">
                Subscribe to Aroma Club
              </button>
            </form>
          </div>
        </div>

        <!-- Footer Bottom Bar -->
        <div class="footer-bottom">
          <div>
            &copy; ${currentYear} ${CAFE_INFO.name}. All rights reserved. Handcrafted with passion in New Delhi.
          </div>
          <div class="footer-bottom-links">
            <a href="#/privacy">Privacy Policy</a>
            <a href="#/terms">Terms &amp; Conditions</a>
            <a href="#/contact">Find Us</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Mobile Fixed Bottom Action Bar -->
    <div class="mobile-bottom-bar" id="mobile-bottom-bar">
      <a href="#/menu" class="btn btn-outline" style="flex:1; padding:10px; font-size:0.88rem;">
        <span>🍽️ View Menu</span>
      </a>
      <a href="#/reservations" class="btn btn-primary" style="flex:1.2; padding:10px; font-size:0.88rem;">
        <span>Book Table</span>
      </a>
    </div>
  `;
}

// Global newsletter handler
if (typeof window !== 'undefined') {
  window.handleNewsletterSubmit = function(event) {
    event.preventDefault();
    const input = document.getElementById('newsletter-email');
    if (!input || !input.value) return;

    Toast.show(`Welcome to Aroma Club, ${input.value}! Check your inbox for your 15% discount voucher.`, 'success');
    input.value = '';
  };
}

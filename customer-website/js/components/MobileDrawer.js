/**
 * Mobile Drawer Navigation Component
 */
import { CAFE_INFO } from '../data/cafeData.js';

export function renderMobileDrawer() {
  return `
    <div class="drawer-backdrop" id="drawer-backdrop"></div>
    <aside class="mobile-drawer" id="mobile-drawer" aria-label="Mobile Navigation" aria-hidden="true">
      <div class="drawer-header">
        <div class="brand-text-wrap">
          <span class="brand-name" style="color:#FFF;">${CAFE_INFO.name}</span>
          <span class="brand-tagline">Connaught Place, Delhi</span>
        </div>
        <button class="drawer-close" id="drawer-close" aria-label="Close mobile menu">&times;</button>
      </div>

      <div class="drawer-body">
        <ul class="drawer-links">
          <li><a href="#/" class="drawer-link" data-route="/">Home <span>&rarr;</span></a></li>
          <li><a href="#/menu" class="drawer-link" data-route="/menu">Menu <span>&rarr;</span></a></li>
          <li><a href="#/about" class="drawer-link" data-route="/about">Our Story <span>&rarr;</span></a></li>
          <li><a href="#/offers" class="drawer-link" data-route="/offers">Current Offers <span>&rarr;</span></a></li>
          <li><a href="#/gallery" class="drawer-link" data-route="/gallery">Photo Gallery <span>&rarr;</span></a></li>
          <li><a href="#/contact" class="drawer-link" data-route="/contact">Location &amp; Contact <span>&rarr;</span></a></li>
        </ul>

        <div style="margin-top:auto; padding-top:16px;">
          <a href="#/reservations" class="btn btn-primary w-full" style="width:100%; text-align:center;">
            Book a Table
          </a>
        </div>
      </div>

      <div class="drawer-footer">
        <div class="drawer-contact-item">
          <span>📞</span>
          <a href="tel:${CAFE_INFO.contact.phone}">${CAFE_INFO.contact.phoneDisplay}</a>
        </div>
        <div class="drawer-contact-item">
          <span>📍</span>
          <span>${CAFE_INFO.address.street}, ${CAFE_INFO.address.locality}</span>
        </div>
        <div class="drawer-contact-item">
          <span>⏰</span>
          <span>Open Daily from 8:00 AM</span>
        </div>
      </div>
    </aside>
  `;
}

export function initMobileDrawer() {
  const toggleBtn = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggleBtn.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggleBtn.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close when clicking any nav link
  drawer.querySelectorAll('.drawer-link, .btn').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

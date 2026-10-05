/**
 * Navbar Component
 * Floating glassmorphic header with live opening hours indicator
 */
import { cafeService } from '../services/cafeService.js';
import { CAFE_INFO } from '../data/cafeData.js';

export function renderNavbar() {
  const status = cafeService.isOpenNow();

  return `
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header class="site-header" id="site-header">
      <div class="container nav-container">
        <!-- Brand Logo -->
        <a href="#/" class="brand-logo" id="nav-brand-logo" aria-label="Cafe Aroma Home">
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
            <span class="brand-name">${CAFE_INFO.name}</span>
            <span class="brand-tagline">Artisanal Coffee &amp; Kitchen</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="desktop-nav" aria-label="Primary Navigation">
          <ul class="nav-links">
            <li><a href="#/" class="nav-link" data-route="/">Home</a></li>
            <li><a href="#/menu" class="nav-link" data-route="/menu">Menu</a></li>
            <li><a href="#/about" class="nav-link" data-route="/about">Our Story</a></li>
            <li><a href="#/offers" class="nav-link" data-route="/offers">Offers</a></li>
            <li><a href="#/gallery" class="nav-link" data-route="/gallery">Gallery</a></li>
            <li><a href="#/contact" class="nav-link" data-route="/contact">Location &amp; Contact</a></li>
          </ul>
        </nav>

        <!-- Header Actions -->
        <div class="nav-actions">
          <div class="nav-status-badge" title="${status.hoursToday}">
            <span class="status-dot ${status.isOpen ? 'open' : 'closed'}"></span>
            <span>${status.statusText}</span>
          </div>
          <a href="#/reservations" class="btn btn-primary" id="btn-header-book">
            <span>Book a Table</span>
          </a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Open mobile menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function initNavbarInteractions() {
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

export function updateActiveNavLink(path) {
  const links = document.querySelectorAll('.nav-link, .drawer-link');
  const cleanPath = path.split('?')[0] || '/';

  links.forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === cleanPath || (route !== '/' && cleanPath.startsWith(route))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

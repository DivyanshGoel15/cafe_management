/**
 * Application Entry Point
 * Bootstraps components, attaches global modal/lightbox listeners, and initializes the router
 */
import { renderNavbar, initNavbarInteractions } from './components/Navbar.js';
import { renderMobileDrawer, initMobileDrawer } from './components/MobileDrawer.js';
import { renderFooter } from './components/Footer.js';
import { renderItemDetailModalMarkup, initItemDetailModal } from './components/ItemDetailModal.js';
import { renderLightboxMarkup, initLightbox } from './components/Lightbox.js';
import { router } from './router.js';

export function initApp() {
  const root = document.getElementById('app');
  if (!root) {
    console.error('Root element #app not found');
    return;
  }

  // Construct application layout shell
  root.innerHTML = `
    <!-- Top Navigation Header -->
    <div id="navbar-mount">${renderNavbar()}</div>

    <!-- Mobile Off-Canvas Drawer -->
    <div id="drawer-mount">${renderMobileDrawer()}</div>

    <!-- Main Content Container Driven by Router -->
    <main class="main-content" id="main-content" role="main">
      <div id="app-content"></div>
    </main>

    <!-- Global Item Customization Modal -->
    <div id="item-modal-mount">${renderItemDetailModalMarkup()}</div>

    <!-- Global Gallery Lightbox -->
    <div id="lightbox-mount">${renderLightboxMarkup()}</div>

    <!-- Footer & Mobile Bottom Bar -->
    <div id="footer-mount">${renderFooter()}</div>
  `;

  // Initialize interactive behaviors
  initNavbarInteractions();
  initMobileDrawer();
  initItemDetailModal();
  initLightbox();

  // Initialize client router
  router.init('app-content');
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

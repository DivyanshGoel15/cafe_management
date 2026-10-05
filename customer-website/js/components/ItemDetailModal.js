/**
 * Item Detail Modal Component
 * Displays rich ingredients, allergens, interactive add-on selection with live price calculation
 */
import { menuService } from '../services/menuService.js';
import { Toast } from './Toast.js';
import { CAFE_INFO } from '../data/cafeData.js';

let activeItem = null;
let selectedAddonIds = new Set();

export function renderItemDetailModalMarkup() {
  return `
    <div class="modal-backdrop" id="item-detail-modal-backdrop" aria-hidden="true">
      <div class="modal-dialog" style="max-width:760px;" role="dialog" aria-modal="true" aria-labelledby="item-modal-title">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <div id="modal-diet-indicator"></div>
            <h3 class="modal-title" id="item-modal-title">Item Details</h3>
          </div>
          <button class="modal-close" id="item-modal-close" aria-label="Close modal">&times;</button>
        </div>

        <div class="modal-body" id="item-modal-body">
          <!-- Dynamic Content Loaded Here -->
        </div>

        <div class="modal-footer" id="item-modal-footer">
          <!-- Actions & Live Price Total -->
        </div>
      </div>
    </div>
  `;
}

export function initItemDetailModal() {
  const backdrop = document.getElementById('item-detail-modal-backdrop');
  const closeBtn = document.getElementById('item-modal-close');

  if (!backdrop) return;

  function closeModal() {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // If the URL has an itemId hash, revert back to #/menu cleanly
    if (window.location.hash.startsWith('#/menu/')) {
      window.location.hash = '#/menu';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Attach global modal openers
  window.openItemModal = async function(itemId) {
    try {
      const item = await menuService.getItemById(itemId);
      activeItem = item;
      selectedAddonIds = new Set();

      const modalTitle = document.getElementById('item-modal-title');
      const dietIndicator = document.getElementById('modal-diet-indicator');
      const body = document.getElementById('item-modal-body');
      const footer = document.getElementById('item-modal-footer');

      if (modalTitle) modalTitle.textContent = item.name;
      if (dietIndicator) {
        dietIndicator.className = item.isVeg ? 'veg-indicator' : 'nonveg-indicator';
        dietIndicator.title = item.isVeg ? 'Vegetarian' : 'Non-Vegetarian';
      }

      body.innerHTML = `
        <div class="item-detail-grid">
          <div class="item-detail-img-wrap">
            <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
            ${!item.isAvailable ? '<div style="position:absolute; inset:0; background:rgba(0,0,0,0.65); color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:700; letter-spacing:0.1em;">CURRENTLY SOLD OUT</div>' : ''}
          </div>

          <div class="item-detail-info">
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
              ${item.tags.map(t => `<span class="badge badge-copper">${t}</span>`).join('')}
              <span class="badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}">${item.isVeg ? 'Pure Veg' : 'Non-Veg'}</span>
            </div>

            <p class="item-detail-desc">${item.description}</p>

            <div class="item-spec-box">
              <div class="item-spec-item">
                <strong>Prep Time</strong>
                <span>⏱️ ${item.prepTime || '12-15 mins'}</span>
              </div>
              <div class="item-spec-item">
                <strong>Calories</strong>
                <span>🔥 ${item.calories || '350 kcal'}</span>
              </div>
              <div class="item-spec-item">
                <strong>Rating</strong>
                <span>★ ${item.rating} (${item.reviewsCount})</span>
              </div>
            </div>

            <!-- Ingredients -->
            <div style="margin-bottom:18px;">
              <strong style="display:block; font-size:0.8rem; text-transform:uppercase; color:var(--forest); margin-bottom:6px;">Key Ingredients</strong>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${item.ingredients.map(ing => `<span style="font-size:0.8rem; background:var(--bg); border:1px solid var(--border); padding:3px 8px; border-radius:var(--radius-xs);">${ing}</span>`).join('')}
              </div>
            </div>

            <!-- Allergens -->
            ${item.allergens && item.allergens.length > 0 ? `
              <div style="margin-bottom:18px;">
                <strong style="display:block; font-size:0.8rem; text-transform:uppercase; color:var(--nonveg-red); margin-bottom:4px;">Allergen Information</strong>
                <span style="font-size:0.82rem; color:var(--text-secondary);">Contains: ${item.allergens.join(', ')}</span>
              </div>
            ` : `
              <div style="margin-bottom:18px;">
                <span style="font-size:0.82rem; color:var(--veg-green); font-weight:500;">✓ No major allergens reported</span>
              </div>
            `}

            <!-- Add-ons Selection -->
            ${item.addons && item.addons.length > 0 ? `
              <div class="addons-section">
                <div class="addons-title">Customizations &amp; Add-ons</div>
                ${item.addons.map(ad => `
                  <label class="addon-row">
                    <div style="display:flex; align-items:center;">
                      <input type="checkbox" value="${ad.id}" data-price="${ad.price}" onchange="window.handleModalAddonChange(event)">
                      <span>${ad.name}</span>
                    </div>
                    <span style="font-weight:600; color:var(--copper);">+${CAFE_INFO.currency}${ad.price}</span>
                  </label>
                `).join('')}
              </div>
            ` : ''}

            <!-- Special Instructions Note -->
            <div>
              <label class="form-label" style="font-size:0.8rem;">Special Preparation Note (Optional)</label>
              <input type="text" class="form-input" id="item-special-notes" placeholder="e.g. Less spicy, extra hot, oat milk..." style="padding:8px 12px; font-size:0.85rem;">
            </div>
          </div>
        </div>
      `;

      updateModalFooter();

      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } catch (err) {
      console.error(err);
      Toast.show('Failed to load item details.', 'error');
    }
  };

  window.handleModalAddonChange = function(event) {
    const addonId = event.target.value;
    if (event.target.checked) {
      selectedAddonIds.add(addonId);
    } else {
      selectedAddonIds.delete(addonId);
    }
    updateModalFooter();
  };

  function updateModalFooter() {
    const footer = document.getElementById('item-modal-footer');
    if (!footer || !activeItem) return;

    let total = activeItem.price;
    if (activeItem.addons) {
      activeItem.addons.forEach(ad => {
        if (selectedAddonIds.has(ad.id)) {
          total += ad.price;
        }
      });
    }

    if (!activeItem.isAvailable) {
      footer.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Current Price</div>
            <div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--text-muted);">${CAFE_INFO.currency}${total}</div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-outline btn-sm" onclick="window.copyItemShareLink('${activeItem.id}')">Share</button>
            <button class="btn btn-secondary disabled" disabled>Sold Out Today</button>
          </div>
        </div>
      `;
      return;
    }

    footer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
        <div>
          <div style="font-size:0.8rem; color:var(--text-muted);">Total with Add-ons</div>
          <div style="font-family:var(--font-serif); font-size:1.45rem; font-weight:700; color:var(--copper);">${CAFE_INFO.currency}${total}</div>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline btn-sm" onclick="window.copyItemShareLink('${activeItem.id}')">
            🔗 Share
          </button>
          <a href="#/reservations?item=${encodeURIComponent(activeItem.name)}" class="btn btn-primary" onclick="document.getElementById('item-detail-modal-backdrop').classList.remove('is-open')">
            Book Table to Taste
          </a>
        </div>
      </div>
    `;
  }

  window.copyItemShareLink = function(itemId) {
    const url = `${window.location.origin}${window.location.pathname}#/menu/${itemId}`;
    navigator.clipboard?.writeText(url)
      .then(() => Toast.show('Menu item link copied to clipboard!', 'success'))
      .catch(() => Toast.show(`Share URL: ${url}`, 'info'));
  };
}

/**
 * Menu Page View
 * Complete interactive menu experience with live search, dietary filters, sorting, and item detail integration
 */
import { menuService } from '../services/menuService.js';
import { CAFE_INFO } from '../data/cafeData.js';

let currentFilters = {
  categoryId: 'all',
  search: '',
  isVeg: null,
  sortBy: 'popular',
  onlyAvailable: false
};

export async function renderMenuPage(params = {}) {
  // Read params from query string if available
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  if (urlParams.get('category')) {
    currentFilters.categoryId = urlParams.get('category');
  }
  if (urlParams.get('search')) {
    currentFilters.search = urlParams.get('search');
  }

  const [categories, items] = await Promise.all([
    menuService.getCategories(),
    menuService.getItems(currentFilters)
  ]);

  return `
    <!-- Header Banner -->
    <div style="background:var(--forest); color:#FFF; padding:50px 0 40px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Culinary Creations</span>
        <h1 style="color:#FFF; margin-bottom:12px;">The Complete Menu</h1>
        <p style="color:rgba(255,255,255,0.75); max-width:600px; margin:0 auto;">
          Handcrafted artisanal coffee, 36-hour slow-fermented sourdough pizzas, wholesome grain bowls, and decadent bakes.
        </p>
      </div>
    </div>

    <!-- Interactive Menu Section -->
    <section class="section" style="padding-top:36px;">
      <div class="container">
        <!-- Controls & Filters Bar -->
        <div style="background:#FFF; border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; box-shadow:var(--shadow-xs); margin-bottom:32px;">
          <!-- Row 1: Search & Quick Filters -->
          <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-bottom:16px;">
            <!-- Live Search -->
            <div style="flex:1; min-width:240px; position:relative;">
              <input 
                type="text" 
                id="menu-search-input" 
                class="form-input" 
                placeholder="Search food, ingredients, coffee..." 
                value="${escapeHtml(currentFilters.search)}"
                style="padding-left:40px;"
                oninput="window.handleMenuSearch(this.value)"
              >
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:1.1rem; pointer-events:none;">🔍</span>
              ${currentFilters.search ? `
                <button onclick="window.clearMenuSearch()" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:1.1rem;">&times;</button>
              ` : ''}
            </div>

            <!-- Dietary Toggle -->
            <div style="display:flex; background:var(--bg); padding:4px; border-radius:var(--radius-sm); border:1px solid var(--border);">
              <button 
                class="btn btn-sm ${currentFilters.isVeg === null ? 'btn-secondary' : 'btn-ghost'}" 
                onclick="window.setDietFilter(null)"
                id="diet-filter-all"
              >
                All
              </button>
              <button 
                class="btn btn-sm ${currentFilters.isVeg === true ? 'btn-secondary' : 'btn-ghost'}" 
                onclick="window.setDietFilter(true)"
                id="diet-filter-veg"
              >
                🌱 Veg Only
              </button>
              <button 
                class="btn btn-sm ${currentFilters.isVeg === false ? 'btn-secondary' : 'btn-ghost'}" 
                onclick="window.setDietFilter(false)"
                id="diet-filter-nonveg"
              >
                🍗 Non-Veg
              </button>
            </div>

            <!-- Sort By Dropdown -->
            <div style="min-width:170px;">
              <select id="menu-sort-select" class="form-select" onchange="window.setMenuSort(this.value)">
                <option value="popular" ${currentFilters.sortBy === 'popular' ? 'selected' : ''}>Sort: Most Popular</option>
                <option value="rating" ${currentFilters.sortBy === 'rating' ? 'selected' : ''}>Sort: Top Rated</option>
                <option value="price-asc" ${currentFilters.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-desc" ${currentFilters.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
              </select>
            </div>

            <!-- In-Stock Toggle -->
            <label style="display:flex; align-items:center; gap:8px; font-size:0.88rem; cursor:pointer; user-select:none;">
              <input 
                type="checkbox" 
                id="menu-avail-toggle" 
                ${currentFilters.onlyAvailable ? 'checked' : ''} 
                onchange="window.setMenuAvailOnly(this.checked)"
                style="width:16px; height:16px; accent-color:var(--copper);"
              >
              <span>Available Now</span>
            </label>
          </div>

          <!-- Row 2: Category Filter Pills -->
          <div class="tab-list">
            ${categories.map(cat => `
              <button 
                class="tab-btn ${currentFilters.categoryId === cat.id ? 'active' : ''}" 
                id="tab-cat-${cat.id}"
                onclick="window.setMenuCategory('${cat.id}')"
              >
                <span>${cat.shortName || cat.name}</span>
                <span class="tab-badge">${cat.count}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Active Filters Indicator / Count -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <div style="font-size:0.95rem; color:var(--text-secondary);">
            Showing <strong style="color:var(--forest);">${items.length}</strong> creations
            ${currentFilters.categoryId !== 'all' ? ` in <em>${getCategoryName(categories, currentFilters.categoryId)}</em>` : ''}
            ${currentFilters.search ? ` matching "<em>${escapeHtml(currentFilters.search)}</em>"` : ''}
          </div>
          ${(currentFilters.categoryId !== 'all' || currentFilters.search || currentFilters.isVeg !== null || currentFilters.onlyAvailable) ? `
            <button class="btn btn-ghost btn-sm" onclick="window.resetMenuFilters()" style="color:var(--copper); font-size:0.85rem;">
              Reset Filters ↺
            </button>
          ` : ''}
        </div>

        <!-- Items Grid or Empty State -->
        <div id="menu-items-container">
          ${renderItemsGrid(items)}
        </div>
      </div>
    </section>
  `;
}

function renderItemsGrid(items) {
  if (items.length === 0) {
    return `
      <div style="text-align:center; padding:60px 20px; background:#FFF; border:1px solid var(--border); border-radius:var(--radius-md);">
        <div style="font-size:3rem; margin-bottom:16px;">🔍</div>
        <h3 style="margin-bottom:8px;">No matching menu creations found</h3>
        <p style="color:var(--text-muted); margin-bottom:20px;">Try adjusting your search terms or dietary filters.</p>
        <button class="btn btn-outline" onclick="window.resetMenuFilters()">Clear All Filters</button>
      </div>
    `;
  }

  return `
    <div class="menu-grid">
      ${items.map(item => `
        <article class="menu-item-card ${!item.isAvailable ? 'is-unavailable' : ''}" id="menu-card-${item.id}">
          <div class="menu-item-image-wrap" onclick="window.openItemModal('${item.id}')" style="cursor:pointer;">
            <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
            <div class="menu-item-badges">
              <span class="badge ${item.tags.includes('Bestseller') ? 'badge-copper' : (item.tags.includes("Chef's Special") ? 'badge-gold' : 'badge-forest')}">
                ${item.tags[0] || 'Artisanal'}
              </span>
              <span class="badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}">
                ${item.isVeg ? 'Veg' : 'Non-Veg'}
              </span>
            </div>
          </div>
          <div class="menu-item-body">
            <div class="menu-item-header">
              <h3 class="menu-item-name" onclick="window.openItemModal('${item.id}')" style="cursor:pointer;">
                ${item.name}
              </h3>
              <span class="menu-item-price">${CAFE_INFO.currency}${item.price}</span>
            </div>
            <p class="menu-item-desc">${item.description}</p>
            <div class="menu-item-meta">
              <span>⏱️ ${item.prepTime}</span>
              <span>🔥 ${item.calories}</span>
              <span>★ ${item.rating} (${item.reviewsCount})</span>
            </div>
            <div class="menu-item-footer">
              <button class="btn btn-outline btn-sm" onclick="window.openItemModal('${item.id}')" id="btn-info-${item.id}">
                ${item.addons && item.addons.length > 0 ? 'Customise' : 'View Details'}
              </button>
              ${item.isAvailable ? `
                <a href="#/reservations?item=${encodeURIComponent(item.name)}" class="btn btn-primary btn-sm" id="btn-order-${item.id}">
                  Taste in Cafe
                </a>
              ` : `
                <button class="btn btn-secondary btn-sm disabled" disabled>
                  Sold Out Today
                </button>
              `}
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function getCategoryName(categories, id) {
  const c = categories.find(cat => cat.id === id);
  return c ? c.name : id;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Global filter event handlers
if (typeof window !== 'undefined') {
  let searchDebounce = null;
  window.handleMenuSearch = function(val) {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(async () => {
      currentFilters.search = val;
      await refreshMenuDisplay();
    }, 250);
  };

  window.clearMenuSearch = async function() {
    currentFilters.search = '';
    const input = document.getElementById('menu-search-input');
    if (input) input.value = '';
    await refreshMenuDisplay();
  };

  window.setMenuCategory = async function(catId) {
    currentFilters.categoryId = catId;
    await refreshMenuDisplay();
  };

  window.setDietFilter = async function(vegVal) {
    currentFilters.isVeg = vegVal;
    await refreshMenuDisplay();
  };

  window.setMenuSort = async function(sortVal) {
    currentFilters.sortBy = sortVal;
    await refreshMenuDisplay();
  };

  window.setMenuAvailOnly = async function(checked) {
    currentFilters.onlyAvailable = checked;
    await refreshMenuDisplay();
  };

  window.resetMenuFilters = async function() {
    currentFilters = {
      categoryId: 'all',
      search: '',
      isVeg: null,
      sortBy: 'popular',
      onlyAvailable: false
    };
    const input = document.getElementById('menu-search-input');
    if (input) input.value = '';
    const sortSelect = document.getElementById('menu-sort-select');
    if (sortSelect) sortSelect.value = 'popular';
    const availToggle = document.getElementById('menu-avail-toggle');
    if (availToggle) availToggle.checked = false;
    await refreshMenuDisplay();
  };

  async function refreshMenuDisplay() {
    const container = document.getElementById('menu-items-container');
    if (!container) return;
    container.innerHTML = '<div style="text-align:center; padding:40px;"><div class="spinner spinner-copper"></div></div>';
    const items = await menuService.getItems(currentFilters);
    container.innerHTML = renderItemsGrid(items);

    // Update active category tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const btnId = btn.id;
      if (btnId === `tab-cat-${currentFilters.categoryId}`) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update dietary buttons
    const allBtn = document.getElementById('diet-filter-all');
    const vegBtn = document.getElementById('diet-filter-veg');
    const nonvegBtn = document.getElementById('diet-filter-nonveg');
    if (allBtn && vegBtn && nonvegBtn) {
      allBtn.className = `btn btn-sm ${currentFilters.isVeg === null ? 'btn-secondary' : 'btn-ghost'}`;
      vegBtn.className = `btn btn-sm ${currentFilters.isVeg === true ? 'btn-secondary' : 'btn-ghost'}`;
      nonvegBtn.className = `btn btn-sm ${currentFilters.isVeg === false ? 'btn-secondary' : 'btn-ghost'}`;
    }
  }
}

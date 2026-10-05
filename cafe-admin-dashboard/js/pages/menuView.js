/* ══════════════════════════════════════════════════════════════
   BREW & CO — MENU MANAGEMENT VIEW CONTROLLER
   Categories, Veg/Non-Veg indicators, live toggles & JSON sync
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let menuCategory = 'all';
let menuSearch = '';
let dietaryFilter = 'all';

export function renderMenu() {
  const state = store.getState();
  const el = document.getElementById('view-menu');
  if (!el) return;

  const categories = ['all', 'Coffee', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

  let filtered = [...state.menuItems];
  if (menuCategory !== 'all') {
    filtered = filtered.filter(m => m.category.toLowerCase() === menuCategory.toLowerCase());
  }
  if (dietaryFilter === 'veg') {
    filtered = filtered.filter(m => m.isVeg);
  } else if (dietaryFilter === 'non-veg') {
    filtered = filtered.filter(m => !m.isVeg);
  }
  if (menuSearch.trim()) {
    const q = menuSearch.toLowerCase().trim();
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }

  el.innerHTML = `
    <!-- Top Bar with Category Filter Tabs & Actions -->
    <div class="section-header">
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <div class="filter-tabs">
          ${categories.map(c => `
            <button class="ftab ${menuCategory.toLowerCase() === c.toLowerCase() ? 'active' : ''}" onclick="window.filterMenuCategory('${c}')">
              ${c === 'all' ? 'All Items (' + state.menuItems.length + ')' : c}
            </button>
          `).join('')}
        </div>

        <select class="form-select" style="width:auto; padding:5px 10px; font-size:12.5px;" onchange="window.filterDietary(this.value)">
          <option value="all">All Dietary</option>
          <option value="veg">🟢 Veg Only</option>
          <option value="non-veg">🔴 Non-Veg Only</option>
        </select>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search menu items..." value="${menuSearch}" oninput="window.searchMenuItems(this.value)">
        </div>

        <button class="btn btn-primary btn-sm" onclick="window.openAddMenuItemModal()">+ Add Item</button>
      </div>
    </div>

    <!-- Menu Cards Grid -->
    <div class="menu-grid">
      ${filtered.length === 0 ? `
        <div style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-icon">☕</div>
            <div class="empty-title">No menu items found</div>
            <div class="empty-desc">No items match the selected category or search keyword.</div>
          </div>
        </div>
      ` : filtered.map(m => `
        <div class="menu-item-card" style="opacity: ${m.available ? 1 : 0.65};">
          <div class="mi-badge-wrap">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="diet-indicator ${m.isVeg ? 'veg' : 'non-veg'}" title="${m.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
              <span class="badge badge-grey" style="font-size:11px;">${m.category}</span>
            </div>
            ${m.isPopular ? `<span class="badge badge-yellow" style="font-size:10px;">★ Bestseller</span>` : ''}
          </div>

          <div class="mi-name">${m.name}</div>
          <div class="mi-desc">${m.description}</div>

          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div class="mi-price">₹${m.price}</div>
            <span style="font-size:11px; color:var(--muted); background:#FAFAF9; padding:2px 6px; border-radius:4px;">⏱️ ${m.prepTime}</span>
          </div>

          <div class="mi-footer">
            <div style="display:flex; align-items:center; gap:8px;">
              <label class="toggle">
                <input type="checkbox" ${m.available ? 'checked' : ''} onchange="window.toggleItemStock('${m.id}', this.checked)">
                <span class="toggle-slider"></span>
              </label>
              <span style="font-size:12px; font-weight:500; color:${m.available ? 'var(--green)' : 'var(--muted)'};">
                ${m.available ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div style="display:flex; gap:4px;">
              <button class="btn btn-ghost btn-sm" title="Edit Item" onclick="window.openEditMenuItemModal('${m.id}')">✏️</button>
              <button class="btn btn-ghost btn-sm" title="Delete Item" onclick="window.confirmDeleteMenuItem('${m.id}')">🗑️</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.filterMenuCategory = (cat) => {
  menuCategory = cat;
  renderMenu();
};

window.filterDietary = (diet) => {
  dietaryFilter = diet;
  renderMenu();
};

window.searchMenuItems = (q) => {
  menuSearch = q;
  renderMenu();
};

window.toggleItemStock = (id, checked) => {
  store.toggleMenuAvailability(id, checked);
  toast.info(`Updated stock availability for item`);
  renderMenu();
};

window.exportMenuJSON = () => {
  const state = store.getState();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.menuItems, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', 'brew_and_co_menu.json');
  dlAnchor.click();
  toast.success('Exported clean menu JSON for Customer Website integration!');
};

window.openAddMenuItemModal = () => {
  let modalEl = document.getElementById('modal-menu-form');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-menu-form';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box modal-lg">
      <div class="modal-header">
        <div class="modal-title">+ Add Menu Item</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-menu-form')">✕</button>
      </div>
      <form onsubmit="window.saveNewMenuItem(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Item Name *</label>
              <input type="text" class="form-input" id="menu-name" required placeholder="e.g. Avocado Toast">
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="menu-cat">
                <option value="Coffee">Coffee</option>
                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Price (₹) *</label>
              <input type="number" min="1" step="1" class="form-input" id="menu-price" required placeholder="240">
            </div>
            <div class="form-group">
              <label class="form-label">Prep Time *</label>
              <input type="text" class="form-input" id="menu-preptime" required value="10 mins">
            </div>
            <div class="form-group">
              <label class="form-label">Dietary Type *</label>
              <select class="form-select" id="menu-veg">
                <option value="veg">🟢 Vegetarian</option>
                <option value="non-veg">🔴 Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-textarea" id="menu-desc" required placeholder="Describe ingredients, preparation, taste notes..."></textarea>
          </div>

          <div style="display:flex; gap:16px; align-items:center; margin-top:8px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="menu-popular">
              <span style="font-size:13px; font-weight:500;">Mark as Chef's Special / Popular</span>
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="menu-available" checked>
              <span style="font-size:13px; font-weight:500;">Currently In Stock</span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-menu-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Add Item to Menu</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-menu-form');
};

window.saveNewMenuItem = (e) => {
  e.preventDefault();
  const name = document.getElementById('menu-name').value.trim();
  const category = document.getElementById('menu-cat').value;
  const price = parseFloat(document.getElementById('menu-price').value);
  const prepTime = document.getElementById('menu-preptime').value.trim();
  const isVeg = document.getElementById('menu-veg').value === 'veg';
  const desc = document.getElementById('menu-desc').value.trim();
  const isPopular = document.getElementById('menu-popular').checked;
  const available = document.getElementById('menu-available').checked;

  const newItem = {
    id: 'MNU-' + (Math.floor(20 + Math.random() * 80)),
    name,
    category,
    price,
    cost: Math.round(price * 0.35),
    isVeg,
    prepTime,
    isPopular,
    available,
    description: desc
  };

  store.createMenuItem(newItem);
  modal.close('modal-menu-form');
  toast.success(`"${name}" added to menu under ${category}.`);
  renderMenu();
};

window.openEditMenuItemModal = (id) => {
  const state = store.getState();
  const item = state.menuItems.find(m => m.id === id);
  if (!item) return;

  let modalEl = document.getElementById('modal-menu-form');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-menu-form';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box modal-lg">
      <div class="modal-header">
        <div class="modal-title">Edit Item — ${item.name}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-menu-form')">✕</button>
      </div>
      <form onsubmit="window.saveEditMenuItem(event, '${item.id}')">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Item Name *</label>
              <input type="text" class="form-input" id="menu-name" required value="${item.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="menu-cat">
                <option value="Coffee" ${item.category === 'Coffee' ? 'selected' : ''}>Coffee</option>
                <option value="Starters" ${item.category === 'Starters' ? 'selected' : ''}>Starters</option>
                <option value="Main Course" ${item.category === 'Main Course' ? 'selected' : ''}>Main Course</option>
                <option value="Desserts" ${item.category === 'Desserts' ? 'selected' : ''}>Desserts</option>
                <option value="Beverages" ${item.category === 'Beverages' ? 'selected' : ''}>Beverages</option>
              </select>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Price (₹) *</label>
              <input type="number" min="1" step="1" class="form-input" id="menu-price" required value="${item.price}">
            </div>
            <div class="form-group">
              <label class="form-label">Prep Time *</label>
              <input type="text" class="form-input" id="menu-preptime" required value="${item.prepTime}">
            </div>
            <div class="form-group">
              <label class="form-label">Dietary Type *</label>
              <select class="form-select" id="menu-veg">
                <option value="veg" ${item.isVeg ? 'selected' : ''}>🟢 Vegetarian</option>
                <option value="non-veg" ${!item.isVeg ? 'selected' : ''}>🔴 Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-textarea" id="menu-desc" required>${item.description}</textarea>
          </div>

          <div style="display:flex; gap:16px; align-items:center; margin-top:8px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="menu-popular" ${item.isPopular ? 'checked' : ''}>
              <span style="font-size:13px; font-weight:500;">Mark as Chef's Special / Popular</span>
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="menu-available" ${item.available ? 'checked' : ''}>
              <span style="font-size:13px; font-weight:500;">Currently In Stock</span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-menu-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Changes</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-menu-form');
};

window.saveEditMenuItem = (e, id) => {
  e.preventDefault();
  const name = document.getElementById('menu-name').value.trim();
  const category = document.getElementById('menu-cat').value;
  const price = parseFloat(document.getElementById('menu-price').value);
  const prepTime = document.getElementById('menu-preptime').value.trim();
  const isVeg = document.getElementById('menu-veg').value === 'veg';
  const desc = document.getElementById('menu-desc').value.trim();
  const isPopular = document.getElementById('menu-popular').checked;
  const available = document.getElementById('menu-available').checked;

  store.updateMenuItem({
    id,
    name,
    category,
    price,
    cost: Math.round(price * 0.35),
    isVeg,
    prepTime,
    isPopular,
    available,
    description: desc
  });

  modal.close('modal-menu-form');
  toast.success(`Updated "${name}"`);
  renderMenu();
};

window.confirmDeleteMenuItem = (id) => {
  modal.confirm({
    title: 'Delete Menu Item',
    message: 'Are you sure you want to remove this item from the cafe menu?',
    isDanger: true,
    confirmText: 'Delete Item',
    onConfirm: () => {
      store.deleteMenuItem(id);
      toast.info('Item removed from menu.');
      renderMenu();
    }
  });
};

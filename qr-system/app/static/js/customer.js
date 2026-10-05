/**
 * CAFE AROMA - DINE-IN CUSTOMER ORDERING LOGIC
 * Standalone Mobile-First Client Controller
 */

(function () {
  'use strict';

  // --- State ---
  let currentTableId = 'table_1';
  let currentSessionId = '';
  let customerId = '';
  let customerName = 'Guest';
  let menuData = null;
  let activeCategory = 'all';
  let currentCart = null;
  let activeOrderId = null;
  let orderPollingInterval = null;

  // Currently customizing item temp state
  let customizingItem = null;
  let customizingQty = 1;
  let selectedAddonIds = new Set();

  // --- Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    initTableFromUrl();
    initCustomerId();
    setupEventListeners();
    fetchMenuAndInitSession();
  });

  // 1. Resolve Table ID from URL
  function initTableFromUrl() {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    if (path.includes('/table/')) {
      const parts = path.split('/table/');
      if (parts[1]) {
        currentTableId = parts[1].replace(/\/$/, '');
      }
    } else if (urlParams.get('table')) {
      currentTableId = urlParams.get('table');
    }
  }

  // 2. Resolve anonymous Customer Identifier
  function initCustomerId() {
    let savedId = localStorage.getItem('aroma_customer_id');
    if (!savedId) {
      savedId = 'cust_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('aroma_customer_id', savedId);
    }
    customerId = savedId;

    const savedName = localStorage.getItem('aroma_customer_name');
    if (savedName) {
      customerName = savedName;
      const guestInput = document.getElementById('guestNameInput');
      if (guestInput) guestInput.value = savedName;
    }
  }

  // 3. Fetch Table Menu and Join/Create Dine-In Table Session
  async function fetchMenuAndInitSession() {
    try {
      // Join Table Session
      const sessionRes = await fetch('/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_id: currentTableId,
          customer_name: customerName,
          customer_id: customerId
        })
      });

      if (!sessionRes.ok) {
        throw new Error('Failed to join table session');
      }

      const sessionData = await sessionRes.json();
      currentSessionId = sessionData.table_session.session_id;
      currentTableId = sessionData.table.table_id;

      // Update UI Header
      document.getElementById('tableNumberLabel').textContent = `Table ${sessionData.table.table_number}`;
      document.getElementById('sessionTag').textContent = `Table ${sessionData.table.table_number} • Session #${currentSessionId.split('_').pop()}`;
      document.getElementById('customerTag').textContent = `👤 ${customerName}`;
      document.getElementById('cartTableInfo').textContent = `Table ${sessionData.table.table_number}`;

      // Fetch Menu
      const menuRes = await fetch(`/tables/${currentTableId}/menu`);
      if (!menuRes.ok) throw new Error('Failed to load menu');
      menuData = await menuRes.json();

      renderCategories(menuData.categories);
      renderMenuItems();
      await refreshCart();
      checkExistingOrder();
    } catch (err) {
      showToast(err.message, 'error');
      const menuLoading = document.getElementById('menuLoading');
      if (menuLoading) {
        menuLoading.innerHTML = `<p style="color:#ef4444;">Unable to load table menu. Please scan table QR again.</p>`;
      }
    }
  }

  // 4. Render Category Filter Pills
  function renderCategories(categories) {
    const nav = document.getElementById('categoryNav');
    if (!nav) return;

    let html = `<button class="category-pill active" data-cat="all">All Items</button>`;
    categories.forEach(cat => {
      html += `<button class="category-pill" data-cat="${cat.category_id}">${cat.name}</button>`;
    });
    nav.innerHTML = html;

    nav.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        nav.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-cat');
        renderMenuItems();
      });
    });
  }

  // 5. Render Menu Items with Real-Time Availability and Veg badges
  function renderMenuItems() {
    const container = document.getElementById('menuContent');
    if (!container || !menuData) return;

    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const vegOnly = document.getElementById('vegOnlyToggle').checked;

    let filteredCategories = menuData.categories.map(cat => {
      let items = cat.items.filter(item => {
        const matchesCategory = activeCategory === 'all' || cat.category_id === activeCategory;
        const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
        const matchesVeg = !vegOnly || item.is_veg;
        return matchesCategory && matchesSearch && matchesVeg;
      });
      return { ...cat, items };
    }).filter(cat => cat.items.length > 0);

    if (filteredCategories.length === 0) {
      container.innerHTML = `
        <div class="loading-state">
          <div style="font-size:36px;">🔍</div>
          <p>No dishes found matching your selection.</p>
        </div>
      `;
      return;
    }

    let html = '';
    filteredCategories.forEach(cat => {
      html += `
        <section class="category-section" id="sec_${cat.category_id}">
          <div class="section-header">
            <h2 class="category-title">${cat.name}</h2>
            ${cat.description ? `<p class="category-desc">${cat.description}</p>` : ''}
          </div>
          <div class="items-grid">
      `;

      cat.items.forEach(item => {
        const cartQty = getCartItemQty(item.item_id);
        const isUnavailable = !item.is_available;

        html += `
          <div class="dish-card ${isUnavailable ? 'unavailable' : ''}" data-id="${item.item_id}">
            <div class="dish-details">
              <div>
                <div class="dish-header-row">
                  <span class="diet-indicator ${item.is_veg ? 'veg' : 'non-veg'}" title="${item.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                  <h3 class="dish-title">${item.name}</h3>
                </div>
                <p class="dish-desc">${item.description}</p>
              </div>
              
              <div class="dish-bottom-row">
                <span class="dish-price">₹${item.price.toFixed(2)}</span>
                ${item.addons && item.addons.length > 0 ? `<span class="dish-addons-badge">Customizable</span>` : ''}
              </div>
            </div>

            <div class="dish-image-wrap">
              <img class="dish-image" src="${item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'">
              
              ${isUnavailable ? `
                <div class="unavailable-pill">Currently unavailable</div>
              ` : `
                <div class="dish-action-container">
                  ${cartQty > 0 ? `
                    <div class="item-stepper">
                      <button type="button" class="btn-step-minus" data-id="${item.item_id}">−</button>
                      <span>${cartQty}</span>
                      <button type="button" class="btn-step-plus" data-id="${item.item_id}">+</button>
                    </div>
                  ` : `
                    <button type="button" class="btn-add-item" data-id="${item.item_id}">
                      <span>ADD</span>
                      ${item.addons && item.addons.length > 0 ? `<small style="font-size:10px;">+</small>` : ''}
                    </button>
                  `}
                </div>
              `}
            </div>
          </div>
        `;
      });

      html += `</div></section>`;
    });

    container.innerHTML = html;
    attachDishListeners();
  }

  function getCartItemQty(itemId) {
    if (!currentCart || !currentCart.items) return 0;
    return currentCart.items
      .filter(ci => ci.item_id === itemId)
      .reduce((sum, ci) => sum + ci.quantity, 0);
  }

  function attachDishListeners() {
    // Add Item click
    document.querySelectorAll('.btn-add-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = btn.getAttribute('data-id');
        handleItemAdd(itemId);
      });
    });

    // Stepper Plus
    document.querySelectorAll('.btn-step-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = btn.getAttribute('data-id');
        handleItemAdd(itemId);
      });
    });

    // Stepper Minus
    document.querySelectorAll('.btn-step-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = btn.getAttribute('data-id');
        handleItemDecrement(itemId);
      });
    });
  }

  function findItemById(itemId) {
    if (!menuData) return null;
    for (const cat of menuData.categories) {
      for (const itm of cat.items) {
        if (itm.item_id === itemId) return itm;
      }
    }
    return null;
  }

  // 6. Handle Adding or Customizing Item
  function handleItemAdd(itemId) {
    const item = findItemById(itemId);
    if (!item) return;

    if (!item.is_available) {
      showToast(`${item.name} is currently unavailable`, 'error');
      return;
    }

    if (item.addons && item.addons.length > 0) {
      openCustomizationModal(item);
    } else {
      // Direct add
      addItemToCartBackend(item.item_id, 1, [], '');
    }
  }

  function handleItemDecrement(itemId) {
    if (!currentCart || !currentCart.items) return;
    const cartItem = currentCart.items.find(ci => ci.item_id === itemId);
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      removeCartItemBackend(cartItem.cart_item_id);
    } else {
      updateCartItemBackend(cartItem.cart_item_id, cartItem.quantity - 1);
    }
  }

  // 7. Customization Modal Logic
  function openCustomizationModal(item) {
    customizingItem = item;
    customizingQty = 1;
    selectedAddonIds = new Set();

    document.getElementById('customItemName').textContent = item.name;
    document.getElementById('customItemBasePrice').textContent = `₹${item.price.toFixed(2)}`;
    document.getElementById('customItemDesc').textContent = item.description;
    document.getElementById('customQtyVal').textContent = '1';
    document.getElementById('itemCustomNotes').value = '';

    const addonList = document.getElementById('addonList');
    if (item.addons && item.addons.length > 0) {
      document.getElementById('addonSection').style.display = 'block';
      let html = '';
      item.addons.forEach(addon => {
        html += `
          <label class="addon-option-label">
            <div class="addon-left">
              <input type="checkbox" class="addon-check" value="${addon.addon_id}" data-price="${addon.price}">
              <span class="addon-name">${addon.name}</span>
            </div>
            <span class="addon-price">+₹${addon.price.toFixed(2)}</span>
          </label>
        `;
      });
      addonList.innerHTML = html;

      addonList.querySelectorAll('.addon-check').forEach(chk => {
        chk.addEventListener('change', () => {
          if (chk.checked) {
            selectedAddonIds.add(chk.value);
          } else {
            selectedAddonIds.delete(chk.value);
          }
          updateCustomModalTotal();
        });
      });
    } else {
      document.getElementById('addonSection').style.display = 'none';
    }

    updateCustomModalTotal();
    document.getElementById('customizeModal').style.display = 'flex';
  }

  function updateCustomModalTotal() {
    if (!customizingItem) return;
    let total = customizingItem.price;

    selectedAddonIds.forEach(addonId => {
      const addon = customizingItem.addons.find(a => a.addon_id === addonId);
      if (addon) total += addon.price;
    });

    total = total * customizingQty;
    document.getElementById('customFinalTotal').textContent = `₹${total.toFixed(2)}`;
  }

  // 8. Backend Cart Operations (Strict Server-Side Price & Availability Calculation)
  async function addItemToCartBackend(itemId, quantity, addonIds, notes) {
    try {
      const res = await fetch('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          table_id: currentTableId,
          item_id: itemId,
          quantity: quantity,
          addon_ids: addonIds,
          notes: notes
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Could not add item to cart');
      }

      currentCart = await res.json();
      renderMenuItems();
      updateCartUI();
      showToast('Item added to order', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function updateCartItemBackend(cartItemId, newQty) {
    try {
      const res = await fetch(`/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          quantity: newQty
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Could not update item');
      }

      currentCart = await res.json();
      renderMenuItems();
      updateCartUI();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function removeCartItemBackend(cartItemId) {
    try {
      const res = await fetch(`/cart/${cartItemId}?customer_id=${customerId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Could not remove item');
      }

      currentCart = await res.json();
      renderMenuItems();
      updateCartUI();
      showToast('Item removed', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function refreshCart() {
    try {
      const res = await fetch(`/cart/${customerId}`);
      if (res.ok) {
        currentCart = await res.json();
        updateCartUI();
      }
    } catch (err) {
      console.warn('Cart refresh failed', err);
    }
  }

  // 9. Update Cart Drawer and Floating Bar UI
  function updateCartUI() {
    const totalItems = currentCart && currentCart.items
      ? currentCart.items.reduce((s, i) => s + i.quantity, 0)
      : 0;

    const finalTotal = currentCart ? currentCart.final_total : 0.0;

    // Badges & Floating bar
    document.getElementById('cartCountBadge').textContent = totalItems;
    const floatingBar = document.getElementById('floatingCartBar');

    if (totalItems > 0) {
      floatingBar.style.display = 'flex';
      document.getElementById('floatingCartCount').textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
      document.getElementById('floatingCartTotal').textContent = `₹${finalTotal.toFixed(2)}`;
    } else {
      floatingBar.style.display = 'none';
    }

    // Modal Cart items list
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;

    if (!currentCart || !currentCart.items || currentCart.items.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 30px 10px; color: #94a3b8;">
          <p style="font-size: 32px; margin-bottom: 8px;">🛒</p>
          <p>Your dine-in cart is empty.</p>
        </div>
      `;
      document.getElementById('btnProceedToPay').disabled = true;
    } else {
      document.getElementById('btnProceedToPay').disabled = false;
      let html = '';
      currentCart.items.forEach(ci => {
        const addonsText = ci.selected_addons && ci.selected_addons.length > 0
          ? ci.selected_addons.map(a => `+ ${a.name}`).join(', ')
          : '';

        html += `
          <div class="cart-item-row" data-id="${ci.cart_item_id}">
            <div class="cart-item-info">
              <h4 class="cart-item-title">${ci.item_name}</h4>
              ${addonsText ? `<div class="cart-item-addons">${addonsText}</div>` : ''}
              ${ci.notes ? `<div class="cart-item-notes">Note: "${ci.notes}"</div>` : ''}
              <div class="cart-item-price">₹${ci.item_total.toFixed(2)}</div>
            </div>
            
            <div class="cart-item-controls">
              <button class="btn-delete-cart-item" data-id="${ci.cart_item_id}" title="Remove">✕</button>
              <div class="item-stepper">
                <button type="button" class="btn-cart-minus" data-id="${ci.cart_item_id}">−</button>
                <span>${ci.quantity}</span>
                <button type="button" class="btn-cart-plus" data-id="${ci.cart_item_id}">+</button>
              </div>
            </div>
          </div>
        `;
      });
      cartItemsList.innerHTML = html;

      // Cart items listener
      cartItemsList.querySelectorAll('.btn-cart-plus').forEach(b => {
        b.addEventListener('click', () => {
          const cId = b.getAttribute('data-id');
          const ci = currentCart.items.find(x => x.cart_item_id === cId);
          if (ci) updateCartItemBackend(cId, ci.quantity + 1);
        });
      });

      cartItemsList.querySelectorAll('.btn-cart-minus').forEach(b => {
        b.addEventListener('click', () => {
          const cId = b.getAttribute('data-id');
          const ci = currentCart.items.find(x => x.cart_item_id === cId);
          if (ci) {
            if (ci.quantity <= 1) removeCartItemBackend(cId);
            else updateCartItemBackend(cId, ci.quantity - 1);
          }
        });
      });

      cartItemsList.querySelectorAll('.btn-delete-cart-item').forEach(b => {
        b.addEventListener('click', () => {
          removeCartItemBackend(b.getAttribute('data-id'));
        });
      });
    }

    // Bill Summary
    document.getElementById('summarySubtotal').textContent = `₹${(currentCart ? currentCart.subtotal : 0).toFixed(2)}`;
    document.getElementById('summaryTaxes').textContent = `₹${(currentCart ? currentCart.tax_amount : 0).toFixed(2)}`;
    
    const serviceRow = document.getElementById('serviceChargeRow');
    if (currentCart && currentCart.service_charge > 0) {
      serviceRow.style.display = 'flex';
      document.getElementById('summaryService').textContent = `₹${currentCart.service_charge.toFixed(2)}`;
    } else {
      serviceRow.style.display = 'none';
    }

    document.getElementById('summaryFinalTotal').textContent = `₹${finalTotal.toFixed(2)}`;
    document.getElementById('btnPayAmount').textContent = `₹${finalTotal.toFixed(2)}`;
  }

  // 10. Simulated Payment Flow
  function openPaymentModal() {
    if (!currentCart || currentCart.final_total <= 0) return;
    document.getElementById('simPayAmount').textContent = `₹${currentCart.final_total.toFixed(2)}`;
    const alertBox = document.getElementById('paymentStatusAlert');
    alertBox.style.display = 'none';
    document.getElementById('paymentModal').style.display = 'flex';
  }

  async function handleSimulatePayment(result) {
    const alertBox = document.getElementById('paymentStatusAlert');
    alertBox.style.display = 'none';

    // Save guest name if entered
    const nameVal = document.getElementById('guestNameInput').value.trim();
    if (nameVal) {
      customerName = nameVal;
      localStorage.setItem('aroma_customer_name', customerName);
      document.getElementById('customerTag').textContent = `👤 ${customerName}`;
    }

    const phoneVal = document.getElementById('guestPhoneInput').value.trim();
    const notesVal = document.getElementById('cartKitchenNotes').value.trim();

    try {
      // Step 1: Create Payment intent
      const payRes = await fetch('/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          table_id: currentTableId,
          session_id: currentSessionId,
          customer_name: customerName,
          customer_phone: phoneVal || null,
          notes: notesVal || null,
          simulation_result: result
        })
      });

      if (!payRes.ok) {
        const err = await payRes.json();
        throw new Error(err.detail || 'Payment gateway failed');
      }

      const payment = await payRes.json();

      if (payment.status !== 'success') {
        // Payment Failed simulation
        alertBox.className = 'payment-status-alert fail';
        alertBox.textContent = `Payment Failed (${payment.status}). Order was NOT submitted to kitchen. Please retry.`;
        alertBox.style.display = 'block';
        showToast('Payment Failed. Kitchen order was not placed.', 'error');
        return;
      }

      // Step 2: Payment Succeeded -> Submit Order
      const orderRes = await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          table_id: currentTableId,
          session_id: currentSessionId,
          payment_id: payment.payment_id,
          customer_name: customerName,
          customer_phone: phoneVal || null,
          notes: notesVal || null
        })
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.detail || 'Order placement failed');
      }

      const order = await orderRes.json();
      activeOrderId = order.order_id;
      localStorage.setItem('aroma_active_order_id', activeOrderId);

      // Close Cart & Payment Modals
      document.getElementById('paymentModal').style.display = 'none';
      document.getElementById('cartModal').style.display = 'none';

      // Refresh cart (which is now cleared by server)
      await refreshCart();
      renderMenuItems();

      showToast(`Order Confirmed! ${order.order_number}`, 'success');
      openOrderTrackingModal(order);
      startOrderPolling();
    } catch (err) {
      alertBox.className = 'payment-status-alert fail';
      alertBox.textContent = err.message;
      alertBox.style.display = 'block';
      showToast(err.message, 'error');
    }
  }

  // 11. Live Order Tracking
  function openOrderTrackingModal(order) {
    document.getElementById('trackOrderTitle').textContent = `Table ${order.table_number} Order`;
    document.getElementById('trackOrderNumber').textContent = `#${order.order_number}`;
    document.getElementById('currentStatusText').textContent = order.status;
    document.getElementById('trackOrderTotal').textContent = `₹${order.total_amount.toFixed(2)}`;

    updateStepperUI(order.status);

    // Items list
    const itemsList = document.getElementById('trackItemsList');
    let html = '';
    order.items.forEach(oi => {
      const addons = oi.selected_addons && oi.selected_addons.length > 0
        ? ` (${oi.selected_addons.map(a => a.name).join(', ')})`
        : '';
      html += `
        <div class="track-item-row">
          <span><strong>${oi.quantity}x</strong> ${oi.item_name}${addons}</span>
          <span>₹${oi.item_total.toFixed(2)}</span>
        </div>
      `;
    });
    itemsList.innerHTML = html;

    // Show floating notice
    const notice = document.getElementById('activeOrderNotice');
    notice.style.display = 'flex';
    document.getElementById('activeOrderText').textContent = `Active Order #${order.order_number} (${order.status})`;

    document.getElementById('trackingModal').style.display = 'flex';
  }

  function updateStepperUI(status) {
    const steps = ['Received', 'Confirmed', 'Preparing', 'Ready', 'Served'];
    const currentIdx = steps.indexOf(status);

    steps.forEach((st, idx) => {
      const node = document.getElementById(`step${st}`);
      if (!node) return;

      node.classList.remove('active', 'completed');
      if (idx < currentIdx) {
        node.classList.add('completed');
      } else if (idx === currentIdx) {
        node.classList.add('active');
      }
    });

    // Connecting lines
    for (let i = 1; i <= 4; i++) {
      const line = document.getElementById(`line${i}`);
      if (line) {
        if (i <= currentIdx) line.classList.add('completed');
        else line.classList.remove('completed');
      }
    }
  }

  function startOrderPolling() {
    if (orderPollingInterval) clearInterval(orderPollingInterval);
    orderPollingInterval = setInterval(async () => {
      if (!activeOrderId) return;
      try {
        const res = await fetch(`/orders/${activeOrderId}`);
        if (res.ok) {
          const order = await res.json();
          document.getElementById('currentStatusText').textContent = order.status;
          document.getElementById('activeOrderText').textContent = `Active Order #${order.order_number} (${order.status})`;
          updateStepperUI(order.status);

          if (order.status === 'Served' || order.status === 'Completed') {
            // Reached final state
            clearInterval(orderPollingInterval);
          }
        }
      } catch (e) {
        console.warn('Order polling error', e);
      }
    }, 4000);
  }

  async function checkExistingOrder() {
    const savedOrderId = localStorage.getItem('aroma_active_order_id');
    if (!savedOrderId) return;

    try {
      const res = await fetch(`/orders/${savedOrderId}`);
      if (res.ok) {
        const order = await res.json();
        if (order.status !== 'Completed' && order.status !== 'Cancelled') {
          activeOrderId = order.order_id;
          const notice = document.getElementById('activeOrderNotice');
          notice.style.display = 'flex';
          document.getElementById('activeOrderText').textContent = `Active Order #${order.order_number} (${order.status})`;
          startOrderPolling();
        }
      }
    } catch (e) {
      console.warn('Could not restore active order', e);
    }
  }

  // 12. Quick Assistance & Bill Request Handlers
  async function submitTableRequest(type) {
    try {
      if (type === 'Request Bill') {
        const res = await fetch('/bill-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table_id: currentTableId,
            session_id: currentSessionId,
            customer_id: customerId,
            customer_name: customerName
          })
        });
        if (!res.ok) throw new Error('Could not request bill');
        showToast('Bill request sent to staff. We will bring your bill shortly.', 'success');
      } else {
        const res = await fetch('/table-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table_id: currentTableId,
            session_id: currentSessionId,
            customer_id: customerId,
            request_type: type
          })
        });
        if (!res.ok) throw new Error('Could not submit request');
        showToast(`Request sent: ${type}`, 'success');
      }
      document.getElementById('assistanceModal').style.display = 'none';
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // 13. UI Setup & Event Listeners
  function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    searchInput.addEventListener('input', () => {
      clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
      renderMenuItems();
    });
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      renderMenuItems();
    });

    // Veg Only
    document.getElementById('vegOnlyToggle').addEventListener('change', () => {
      renderMenuItems();
    });

    // Open/Close Cart
    document.getElementById('cartBtn').addEventListener('click', () => {
      document.getElementById('cartModal').style.display = 'flex';
    });
    document.getElementById('viewCartFloatingBtn').addEventListener('click', () => {
      document.getElementById('cartModal').style.display = 'flex';
    });
    document.getElementById('closeCartBtn').addEventListener('click', () => {
      document.getElementById('cartModal').style.display = 'none';
    });

    // Customization Modal Controls
    document.getElementById('closeCustomizeBtn').addEventListener('click', () => {
      document.getElementById('customizeModal').style.display = 'none';
    });
    document.getElementById('customQtyPlus').addEventListener('click', () => {
      customizingQty++;
      document.getElementById('customQtyVal').textContent = customizingQty;
      updateCustomModalTotal();
    });
    document.getElementById('customQtyMinus').addEventListener('click', () => {
      if (customizingQty > 1) {
        customizingQty--;
        document.getElementById('customQtyVal').textContent = customizingQty;
        updateCustomModalTotal();
      }
    });
    document.getElementById('addCustomizedToCartBtn').addEventListener('click', () => {
      if (!customizingItem) return;
      const notes = document.getElementById('itemCustomNotes').value.trim();
      addItemToCartBackend(
        customizingItem.item_id,
        customizingQty,
        Array.from(selectedAddonIds),
        notes
      );
      document.getElementById('customizeModal').style.display = 'none';
    });

    // Guest Details Collapsible
    document.getElementById('guestDetailsToggle').addEventListener('click', () => {
      const fields = document.getElementById('guestFields');
      fields.style.display = fields.style.display === 'none' ? 'flex' : 'none';
    });

    // Proceed to Payment
    document.getElementById('btnProceedToPay').addEventListener('click', () => {
      openPaymentModal();
    });
    document.getElementById('closePaymentBtn').addEventListener('click', () => {
      document.getElementById('paymentModal').style.display = 'none';
    });

    // Payment Simulation Buttons
    document.getElementById('btnSimulateSuccess').addEventListener('click', () => {
      handleSimulatePayment('success');
    });
    document.getElementById('btnSimulateFailure').addEventListener('click', () => {
      handleSimulatePayment('failed');
    });
    document.getElementById('btnSimulatePending').addEventListener('click', () => {
      handleSimulatePayment('pending');
    });

    // Order Tracking Modal
    document.getElementById('btnTrackOrder').addEventListener('click', async () => {
      if (!activeOrderId) return;
      const res = await fetch(`/orders/${activeOrderId}`);
      if (res.ok) {
        const order = await res.json();
        openOrderTrackingModal(order);
      }
    });
    document.getElementById('closeTrackingBtn').addEventListener('click', () => {
      document.getElementById('trackingModal').style.display = 'none';
    });
    document.getElementById('btnOrderMore').addEventListener('click', () => {
      document.getElementById('trackingModal').style.display = 'none';
    });

    // Service & Waiter Assistance Buttons
    document.getElementById('btnCallWaiter').addEventListener('click', () => {
      submitTableRequest('Call Waiter');
    });
    document.getElementById('btnRequestWater').addEventListener('click', () => {
      submitTableRequest('Request Water');
    });
    document.getElementById('btnRequestBill').addEventListener('click', () => {
      submitTableRequest('Request Bill');
    });

    document.querySelectorAll('.assist-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        submitTableRequest(type);
      });
    });
    document.getElementById('closeAssistanceBtn').addEventListener('click', () => {
      document.getElementById('assistanceModal').style.display = 'none';
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    });
  }

  // 14. Toast Notification Utility
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

})();

/**
 * CAFE AROMA - KITCHEN DISPLAY SYSTEM (KDS) LOGIC
 * Real-time Order Stream, Table Assistance, and Dynamic Menu Availability Switchboard
 */

(function () {
  'use strict';

  // --- State ---
  let activeTab = 'orders';
  let activeFilter = 'all';
  let kitchenOrders = [];
  let tableRequests = [];
  let billRequests = [];
  let menuCategories = [];
  let knownOrderIds = new Set();
  let pollInterval = null;

  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initFilters();
    fetchAllData();
    pollInterval = setInterval(fetchAllData, 4000);
  });

  // 1. Navigation Tabs
  function initTabs() {
    document.querySelectorAll('.kds-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.kds-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeTab = tab.getAttribute('data-tab');

        document.getElementById('viewOrders').style.display = activeTab === 'orders' ? 'block' : 'none';
        document.getElementById('viewRequests').style.display = activeTab === 'requests' ? 'block' : 'none';
        document.getElementById('viewAvailability').style.display = activeTab === 'availability' ? 'block' : 'none';

        if (activeTab === 'availability' && menuCategories.length === 0) {
          fetchMenuAvailability();
        }
      });
    });

    document.getElementById('btnRefreshKds').addEventListener('click', () => {
      fetchAllData();
      showToast('KDS refreshed', 'info');
    });
  }

  // 2. Order Filters
  function initFilters() {
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.getAttribute('data-filter');
        renderOrdersGrid();
      });
    });

    const menuSearch = document.getElementById('menuSearchInput');
    if (menuSearch) {
      menuSearch.addEventListener('input', () => {
        renderMenuAvailability();
      });
    }
  }

  // 3. Polling & Data Retrieval
  async function fetchAllData() {
    await Promise.all([
      fetchOrders(),
      fetchRequests()
    ]);
  }

  async function fetchOrders() {
    try {
      const res = await fetch('/kitchen/orders');
      if (res.ok) {
        const orders = await res.json();
        
        // Detect new order for audio alert
        if (knownOrderIds.size > 0) {
          const newOrders = orders.filter(o => !knownOrderIds.has(o.order_id));
          if (newOrders.length > 0) {
            playNewOrderChime();
            showToast(`New Order #${newOrders[0].order_number} received for Table ${newOrders[0].table_number}!`, 'warning');
          }
        }

        kitchenOrders = orders;
        knownOrderIds = new Set(orders.map(o => o.order_id));
        updateOrderCounts();
        renderOrdersGrid();
      }
    } catch (e) {
      console.warn('Error fetching kitchen orders', e);
    }
  }

  async function fetchRequests() {
    try {
      const [tRes, bRes] = await Promise.all([
        fetch('/table-requests'),
        fetch('/bill-requests')
      ]);

      if (tRes.ok) {
        tableRequests = await tRes.json();
      }
      if (bRes.ok) {
        billRequests = await bRes.json();
      }

      updateRequestCounts();
      renderRequestsView();
    } catch (e) {
      console.warn('Error fetching requests', e);
    }
  }

  async function fetchMenuAvailability() {
    try {
      const res = await fetch('/tables/table_1/menu');
      if (res.ok) {
        const data = await res.json();
        menuCategories = data.categories || [];
        renderMenuAvailability();
      }
    } catch (e) {
      console.warn('Error fetching menu for availability', e);
    }
  }

  // 4. Render Orders Grid
  function renderOrdersGrid() {
    const grid = document.getElementById('ordersGrid');
    if (!grid) return;

    let filtered = kitchenOrders.filter(o => {
      if (activeFilter === 'all') return true;
      return o.status === activeFilter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="kds-empty-state">
          <div class="empty-icon">🍽️</div>
          <h3>No orders matching "${activeFilter}"</h3>
          <p>Orders will show up dynamically when confirmed.</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(order => {
      const timeAgo = formatTimeAgo(order.created_at);
      const statusClass = `status-${order.status.toLowerCase().replace(' ', '-')}`;

      // Status action button
      let actionBtn = '';
      if (order.status === 'Confirmed' || order.status === 'Received') {
        actionBtn = `<button class="btn-status-action to-prep" data-id="${order.order_id}" data-next="Preparing">Start Preparing →</button>`;
      } else if (order.status === 'Preparing') {
        actionBtn = `<button class="btn-status-action to-ready" data-id="${order.order_id}" data-next="Ready">Mark Ready ✓</button>`;
      } else if (order.status === 'Ready') {
        actionBtn = `<button class="btn-status-action to-served" data-id="${order.order_id}" data-next="Served">Mark Served 🍽️</button>`;
      }

      let itemsHtml = '';
      order.items.forEach(it => {
        const addons = it.selected_addons && it.selected_addons.length > 0
          ? `<div class="ticket-item-addons">${it.selected_addons.map(a => `+ ${a.name}`).join(', ')}</div>`
          : '';
        const note = it.notes ? `<div class="ticket-item-note">Note: "${it.notes}"</div>` : '';

        itemsHtml += `
          <div class="ticket-item-row">
            <span class="ticket-item-qty">${it.quantity}x</span>
            <div class="ticket-item-details">
              <div class="ticket-item-name">${it.item_name}</div>
              ${addons}
              ${note}
            </div>
          </div>
        `;
      });

      html += `
        <div class="order-ticket" data-order-id="${order.order_id}">
          <div class="ticket-header">
            <span class="ticket-table-badge">Table ${order.table_number}</span>
            <div class="ticket-meta">
              <div class="ticket-order-id">#${order.order_number}</div>
              <div class="ticket-time">${timeAgo}</div>
            </div>
          </div>
          
          <div class="ticket-body">
            <div class="ticket-customer-row">
              <span>👤 ${order.customer_name}</span>
              <span>Paid ₹${order.total_amount.toFixed(2)}</span>
            </div>

            <div class="ticket-items-list">
              ${itemsHtml}
            </div>

            ${order.notes ? `
              <div class="ticket-notes-box">
                <strong>Table Note:</strong> ${order.notes}
              </div>
            ` : ''}
          </div>

          <div class="ticket-footer">
            <span class="ticket-status-pill ${statusClass}">${order.status}</span>
            ${actionBtn}
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    // Attach Status Action buttons
    grid.querySelectorAll('.btn-status-action').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orderId = btn.getAttribute('data-id');
        const nextStatus = btn.getAttribute('data-next');
        await updateOrderStatus(orderId, nextStatus);
      });
    });
  }

  async function updateOrderStatus(orderId, nextStatus) {
    try {
      const res = await fetch(`/kitchen/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!res.ok) throw new Error('Status update failed');
      showToast(`Order status updated to "${nextStatus}"`, 'success');
      await fetchOrders();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  // 5. Render Requests View
  function renderRequestsView() {
    const tableList = document.getElementById('tableRequestsList');
    const billList = document.getElementById('billRequestsList');
    if (!tableList || !billList) return;

    // Table requests
    const pendingTable = tableRequests.filter(r => r.status !== 'Completed');
    if (pendingTable.length === 0) {
      tableList.innerHTML = `<p style="color:#64748b; padding:20px 0; text-align:center;">No pending table calls.</p>`;
    } else {
      let html = '';
      pendingTable.forEach(req => {
        html += `
          <div class="request-card">
            <div class="request-info">
              <span class="req-table">Table ${req.table_number}</span>
              <span class="req-type">${req.request_type}</span>
              <span class="req-time">${formatTimeAgo(req.created_at)}</span>
            </div>
            <div class="req-actions">
              ${req.status === 'Pending' ? `
                <button class="btn-req-ack" data-id="${req.request_id}">Acknowledge</button>
              ` : ''}
              <button class="btn-req-done" data-id="${req.request_id}">Done ✓</button>
            </div>
          </div>
        `;
      });
      tableList.innerHTML = html;

      tableList.querySelectorAll('.btn-req-ack').forEach(b => {
        b.addEventListener('click', async () => {
          await updateTableReq(b.getAttribute('data-id'), 'Acknowledged');
        });
      });
      tableList.querySelectorAll('.btn-req-done').forEach(b => {
        b.addEventListener('click', async () => {
          await updateTableReq(b.getAttribute('data-id'), 'Completed');
        });
      });
    }

    // Bill requests
    const pendingBills = billRequests.filter(b => b.status !== 'Completed');
    if (pendingBills.length === 0) {
      billList.innerHTML = `<p style="color:#64748b; padding:20px 0; text-align:center;">No pending bill requests.</p>`;
    } else {
      let html = '';
      pendingBills.forEach(bill => {
        html += `
          <div class="request-card">
            <div class="request-info">
              <span class="req-table">Table ${bill.table_number} • Bill</span>
              <span class="req-type">Total: ₹${bill.total_amount.toFixed(2)} (${bill.customer_name})</span>
              <span class="req-time">${formatTimeAgo(bill.created_at)}</span>
            </div>
            <div class="req-actions">
              ${bill.status === 'Pending' ? `
                <button class="btn-req-ack" data-id="${bill.bill_request_id}">Preparing</button>
              ` : ''}
              <button class="btn-req-done" data-id="${bill.bill_request_id}">Delivered ✓</button>
            </div>
          </div>
        `;
      });
      billList.innerHTML = html;

      billList.querySelectorAll('.btn-req-ack').forEach(b => {
        b.addEventListener('click', async () => {
          await updateBillReq(b.getAttribute('data-id'), 'Preparing');
        });
      });
      billList.querySelectorAll('.btn-req-done').forEach(b => {
        b.addEventListener('click', async () => {
          await updateBillReq(b.getAttribute('data-id'), 'Completed');
        });
      });
    }
  }

  async function updateTableReq(reqId, status) {
    try {
      await fetch(`/table-requests/${reqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchRequests();
    } catch (e) {
      console.warn(e);
    }
  }

  async function updateBillReq(reqId, status) {
    try {
      await fetch(`/bill-requests/${reqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchRequests();
    } catch (e) {
      console.warn(e);
    }
  }

  // 6. Dynamic Menu Availability Switchboard
  function renderMenuAvailability() {
    const container = document.getElementById('menuAvailabilityList');
    if (!container) return;

    const searchTerm = (document.getElementById('menuSearchInput')?.value || '').toLowerCase().trim();

    let allItems = [];
    menuCategories.forEach(cat => {
      cat.items.forEach(itm => {
        allItems.push({ ...itm, category_name: cat.name });
      });
    });

    if (searchTerm) {
      allItems = allItems.filter(i => i.name.toLowerCase().includes(searchTerm) || i.category_name.toLowerCase().includes(searchTerm));
    }

    let html = '';
    allItems.forEach(item => {
      html += `
        <div class="avail-card ${!item.is_available ? 'is-off' : ''}" id="avail_card_${item.item_id}">
          <div class="avail-info">
            <img class="avail-thumb" src="${item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'}" alt="${item.name}">
            <div>
              <div class="avail-title">${item.name}</div>
              <div class="avail-cat">${item.category_name} • ₹${item.price.toFixed(2)}</div>
            </div>
          </div>
          <div>
            <label class="switch">
              <input type="checkbox" class="toggle-availability" data-id="${item.item_id}" ${item.is_available ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Attach Toggle event listeners
    container.querySelectorAll('.toggle-availability').forEach(toggle => {
      toggle.addEventListener('change', async (e) => {
        const itemId = toggle.getAttribute('data-id');
        const isAvailable = toggle.checked;
        await setItemAvailability(itemId, isAvailable);
      });
    });
  }

  async function setItemAvailability(itemId, isAvailable) {
    try {
      const res = await fetch(`/menu/items/${itemId}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: isAvailable })
      });

      if (!res.ok) throw new Error('Could not update item availability');
      const updated = await res.json();

      // Update in memory
      menuCategories.forEach(c => {
        c.items.forEach(i => {
          if (i.item_id === itemId) i.is_available = isAvailable;
        });
      });

      const card = document.getElementById(`avail_card_${itemId}`);
      if (card) {
        if (!isAvailable) card.classList.add('is-off');
        else card.classList.remove('is-off');
      }

      showToast(`'${updated.name}' marked ${isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}`, isAvailable ? 'success' : 'warning');
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  // 7. Badge & Counter Utilities
  function updateOrderCounts() {
    const active = kitchenOrders.filter(o => o.status !== 'Served' && o.status !== 'Completed');
    document.getElementById('badgeActiveOrders').textContent = active.length;
    document.getElementById('filterCountAll').textContent = kitchenOrders.length;
    document.getElementById('filterCountConfirmed').textContent = kitchenOrders.filter(o => o.status === 'Confirmed' || o.status === 'Received').length;
    document.getElementById('filterCountPreparing').textContent = kitchenOrders.filter(o => o.status === 'Preparing').length;
    document.getElementById('filterCountReady').textContent = kitchenOrders.filter(o => o.status === 'Ready').length;
  }

  function updateRequestCounts() {
    const pendingT = tableRequests.filter(r => r.status !== 'Completed').length;
    const pendingB = billRequests.filter(b => b.status !== 'Completed').length;
    const total = pendingT + pendingB;

    document.getElementById('badgeRequests').textContent = total;
    document.getElementById('countTableRequests').textContent = `${pendingT} pending`;
    document.getElementById('countBillRequests').textContent = `${pendingB} pending`;
  }

  function formatTimeAgo(isoString) {
    if (!isoString) return '';
    const diff = Math.floor((new Date() - new Date(isoString)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  }

  function playNewOrderChime() {
    const chk = document.getElementById('chkAudioAlert');
    if (!chk || !chk.checked) return;

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      // Audio autoplay policy
    }
  }

  function showToast(msg, type = 'info') {
    const container = document.getElementById('kdsToastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'kds-toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

})();

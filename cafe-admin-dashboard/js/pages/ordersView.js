/* ══════════════════════════════════════════════════════════════
   BREW & CO — ORDERS MANAGEMENT VIEW CONTROLLER
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let currentFilter = 'all';
let currentTypeFilter = 'all';
let searchQuery = '';
let selectedOrderId = null;

export function renderOrders() {
  const state = store.getState();
  const el = document.getElementById('view-orders');
  if (!el) return;

  // Filter orders
  let filtered = [...state.orders];
  if (currentFilter !== 'all') {
    filtered = filtered.filter(o => o.status.toLowerCase() === currentFilter.toLowerCase());
  }
  if (currentTypeFilter !== 'all') {
    filtered = filtered.filter(o => o.type.toLowerCase() === currentTypeFilter.toLowerCase());
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.items.some(i => i.name.toLowerCase().includes(q))
    );
  }

  el.innerHTML = `
    <div class="section-header">
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <!-- Status Tabs -->
        <div class="filter-tabs" id="order-status-tabs">
          <button class="ftab ${currentFilter === 'all' ? 'active' : ''}" onclick="window.filterOrdersByStatus('all')">All (${state.orders.length})</button>
          <button class="ftab ${currentFilter === 'pending' ? 'active' : ''}" onclick="window.filterOrdersByStatus('pending')">Pending</button>
          <button class="ftab ${currentFilter === 'confirmed' ? 'active' : ''}" onclick="window.filterOrdersByStatus('confirmed')">Confirmed</button>
          <button class="ftab ${currentFilter === 'preparing' ? 'active' : ''}" onclick="window.filterOrdersByStatus('preparing')">Preparing</button>
          <button class="ftab ${currentFilter === 'ready' ? 'active' : ''}" onclick="window.filterOrdersByStatus('ready')">Ready</button>
          <button class="ftab ${currentFilter === 'completed' ? 'active' : ''}" onclick="window.filterOrdersByStatus('completed')">Completed</button>
          <button class="ftab ${currentFilter === 'cancelled' ? 'active' : ''}" onclick="window.filterOrdersByStatus('cancelled')">Cancelled</button>
        </div>

        <!-- Order Type Filter -->
        <select class="form-select" style="width: auto; padding: 5px 10px; font-size: 12.5px;" onchange="window.filterOrdersByType(this.value)">
          <option value="all" ${currentTypeFilter === 'all' ? 'selected' : ''}>All Types</option>
          <option value="dine-in" ${currentTypeFilter === 'dine-in' ? 'selected' : ''}>Dine-in</option>
          <option value="takeaway" ${currentTypeFilter === 'takeaway' ? 'selected' : ''}>Takeaway</option>
          <option value="delivery" ${currentTypeFilter === 'delivery' ? 'selected' : ''}>Delivery</option>
        </select>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search order ID, guest..." value="${searchQuery}" oninput="window.searchOrders(this.value)">
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.openNewOrderModal()">+ New Order</button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Type / Table</th>
              <th>Items Summary</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="9">
                  <div class="empty-state">
                    <div class="empty-icon">🛍️</div>
                    <div class="empty-title">No orders found</div>
                    <div class="empty-desc">No orders match your filter criteria or search keyword.</div>
                    <button class="btn btn-outline btn-sm" onclick="window.filterOrdersByStatus('all')">Reset Filters</button>
                  </div>
                </td>
              </tr>
            ` : filtered.map(o => `
              <tr>
                <td class="td-mono td-bold">${o.id}</td>
                <td>
                  <div class="td-bold">${o.customer}</div>
                  <div class="td-muted" style="font-size:11.5px;">${o.phone}</div>
                </td>
                <td>
                  <span class="badge ${o.type === 'Dine-in' ? 'badge-blue' : o.type === 'Takeaway' ? 'badge-yellow' : 'badge-purple'}">${o.type}</span>
                  <div style="font-size:11px; color:var(--muted); margin-top:2px;">${o.table}</div>
                </td>
                <td class="td-muted" style="max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                  ${o.items.map(i => `${i.name} (${i.qty})`).join(', ')}
                </td>
                <td class="td-bold">₹${o.total}</td>
                <td>
                  <span class="badge ${o.paymentStatus === 'Paid' ? 'badge-green' : 'badge-yellow'}">${o.paymentStatus}</span>
                  <div style="font-size:11px; color:var(--muted); margin-top:2px;">${o.paymentMethod}</div>
                </td>
                <td>${window.getOrderStatusBadge(o.status)}</td>
                <td class="td-muted">${o.time}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="window.openOrderDetails('${o.id}')">View</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Order Details Drawer Panel -->
    <div class="drawer-panel" id="order-details-drawer">
      <div class="drawer-header">
        <div>
          <div class="modal-title" id="drawer-order-id">Order Details</div>
          <div style="font-size:12px; color:var(--muted); margin-top:2px;" id="drawer-order-time"></div>
        </div>
        <button class="modal-close-btn" onclick="window.modal.closeDrawer('order-details-drawer')">✕</button>
      </div>

      <div class="drawer-body" id="drawer-order-content"></div>

      <div class="drawer-footer" id="drawer-order-footer"></div>
    </div>
  `;
}

// Global hooks for orders
window.filterOrdersByStatus = (status) => {
  currentFilter = status;
  renderOrders();
};

window.filterOrdersByType = (type) => {
  currentTypeFilter = type;
  renderOrders();
};

window.searchOrders = (query) => {
  searchQuery = query;
  renderOrders();
};

window.getOrderStatusBadge = (status) => {
  const map = {
    Pending: 'badge-yellow',
    Confirmed: 'badge-blue',
    Preparing: 'badge-purple',
    Ready: 'badge-green',
    Completed: 'badge-green',
    Cancelled: 'badge-red'
  };
  return `<span class="badge ${map[status] || 'badge-grey'}">${status}</span>`;
};

window.openOrderDetails = (orderId) => {
  selectedOrderId = orderId;
  const state = store.getState();
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('drawer-order-id').textContent = `${order.id} — ${order.type}`;
  document.getElementById('drawer-order-time').textContent = `Placed at ${order.time}, ${order.date}`;

  const steps = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'];
  const currentIndex = steps.indexOf(order.status);

  document.getElementById('drawer-order-content').innerHTML = `
    <!-- Status Progression Stepper -->
    ${order.status !== 'Cancelled' ? `
      <div class="order-stepper">
        ${steps.map((st, i) => `
          <div class="order-step ${i < currentIndex ? 'completed' : i === currentIndex ? 'current' : ''}">
            <div class="order-step-num">${i < currentIndex ? '✓' : i + 1}</div>
            <div class="order-step-label">${st}</div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div style="background:var(--red-bg); color:var(--red); padding:10px 14px; border-radius:6px; margin-bottom:18px; font-weight:600;">
        ⚠️ This order was cancelled.
      </div>
    `}

    <!-- Customer Card -->
    <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:8px; padding:12px 14px; margin-bottom:16px;">
      <div style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase;">Customer Details</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
        <div style="font-weight:700; font-size:14px;">${order.customer}</div>
        <div style="font-size:13px; color:var(--muted);">${order.phone}</div>
      </div>
      <div style="font-size:12px; color:var(--muted); margin-top:4px;">Location: <strong>${order.table}</strong></div>
      ${order.notes ? `<div style="font-size:12px; color:var(--accent); margin-top:6px; background:var(--accent-dim); padding:4px 8px; border-radius:4px;">📝 Note: ${order.notes}</div>` : ''}
    </div>

    <!-- Ordered Items -->
    <div style="font-size:12px; font-weight:600; color:var(--muted); margin-bottom:6px; text-transform:uppercase;">Ordered Items</div>
    <div class="order-items-list">
      ${order.items.map(item => `
        <div class="order-item-row">
          <div>
            <div style="font-weight:600;">${item.name}</div>
            <div style="font-size:11px; color:var(--muted);">₹${item.price} × ${item.qty}</div>
          </div>
          <div style="font-weight:700;">₹${item.total || (item.price * item.qty)}</div>
        </div>
      `).join('')}
    </div>

    <!-- Financial Breakdown -->
    <div class="order-totals-summary">
      <div class="order-total-line">
        <span>Subtotal</span>
        <span>₹${order.subtotal}</span>
      </div>
      <div class="order-total-line">
        <span>GST (5%)</span>
        <span>₹${order.tax}</span>
      </div>
      <div class="order-total-line">
        <span>Service Charge</span>
        <span>₹${order.serviceCharge}</span>
      </div>
      ${order.discount > 0 ? `
        <div class="order-total-line" style="color:var(--green);">
          <span>Discount Applied</span>
          <span>-₹${order.discount}</span>
        </div>
      ` : ''}
      <div class="order-total-line order-total-grand">
        <span>Total Payable</span>
        <span>₹${order.total}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; font-size:12px;">
        <span>Payment Method: <strong>${order.paymentMethod}</strong></span>
        <span class="badge ${order.paymentStatus === 'Paid' ? 'badge-green' : 'badge-yellow'}">${order.paymentStatus}</span>
      </div>
    </div>
  `;

  // Drawer Footer Actions
  let nextActionBtn = '';
  if (order.status === 'Pending') {
    nextActionBtn = `<button class="btn btn-primary btn-sm" onclick="window.updateOrderStatus('${order.id}', 'Confirmed')">Confirm Order</button>`;
  } else if (order.status === 'Confirmed') {
    nextActionBtn = `<button class="btn btn-primary btn-sm" onclick="window.updateOrderStatus('${order.id}', 'Preparing')">Send to Kitchen</button>`;
  } else if (order.status === 'Preparing') {
    nextActionBtn = `<button class="btn btn-success btn-sm" onclick="window.updateOrderStatus('${order.id}', 'Ready')">Mark Ready for Serving</button>`;
  } else if (order.status === 'Ready') {
    nextActionBtn = `<button class="btn btn-success btn-sm" onclick="window.updateOrderStatus('${order.id}', 'Completed')">Mark Completed / Delivered</button>`;
  }

  document.getElementById('drawer-order-footer').innerHTML = `
    <button class="btn btn-ghost btn-sm" onclick="window.printReceipt('${order.id}')">🖨️ Print Receipt / KOT</button>
    ${order.status !== 'Completed' && order.status !== 'Cancelled' ? `
      <button class="btn btn-danger-ghost btn-sm" onclick="window.cancelOrderConfirm('${order.id}')">Cancel Order</button>
    ` : ''}
    ${nextActionBtn}
  `;

  modal.openDrawer('order-details-drawer');
};

window.updateOrderStatus = (orderId, newStatus) => {
  store.updateOrderStatus(orderId, newStatus);
  toast.success(`Order ${orderId} updated to ${newStatus}`);
  window.openOrderDetails(orderId);
  renderOrders();
};

window.cancelOrderConfirm = (orderId) => {
  modal.confirm({
    title: 'Cancel Order',
    message: `Are you sure you want to cancel order ${orderId}? This cannot be undone.`,
    isDanger: true,
    confirmText: 'Yes, Cancel Order',
    onConfirm: () => {
      store.updateOrderStatus(orderId, 'Cancelled');
      toast.warning(`Order ${orderId} has been cancelled.`);
      modal.closeDrawer('order-details-drawer');
      renderOrders();
    }
  });
};

window.printReceipt = (orderId) => {
  toast.info(`Receipt and Kitchen Order Ticket (KOT) dispatched to Thermal Printer for ${orderId}`);
};

// Modal for Creating New Order
window.openNewOrderModal = () => {
  const state = store.getState();
  const availableTables = state.tables.filter(t => t.status === 'Available');

  let modalEl = document.getElementById('modal-new-order');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-new-order';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box modal-lg">
      <div class="modal-header">
        <div class="modal-title">+ Create New Order</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-new-order')">✕</button>
      </div>
      <form id="form-new-order" onsubmit="window.submitNewOrder(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Customer Name *</label>
              <input type="text" class="form-input" id="order-cust-name" required placeholder="e.g. Vikram Sharma">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="order-cust-phone" required placeholder="e.g. 9876543210">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Order Type</label>
              <select class="form-select" id="order-type-select" onchange="window.toggleTableSelector(this.value)">
                <option value="Dine-in">Dine-in</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
            <div class="form-group" id="group-order-table">
              <label class="form-label">Assign Table</label>
              <select class="form-select" id="order-table-select">
                <option value="Table 1">Table 1 (2 Seats)</option>
                <option value="Table 4">Table 4 (6 Seats)</option>
                <option value="Table 5">Table 5 (2 Seats)</option>
                <option value="Table 8">Table 8 (6 Seats)</option>
                <option value="Bar Counter">Bar Counter</option>
              </select>
            </div>
          </div>

          <!-- Item Selector -->
          <div style="font-size:12.5px; font-weight:700; margin:14px 0 8px;">Select Menu Items</div>
          <div style="max-height:180px; overflow-y:auto; border:1px solid var(--border); border-radius:6px; padding:10px;" id="order-item-checkboxes">
            ${state.menuItems.filter(m => m.available).map(m => `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f0f0f0;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" class="order-item-cb" value="${m.id}" data-name="${m.name}" data-price="${m.price}" onchange="window.recalcNewOrderTotal()">
                  <span><strong>${m.name}</strong> <span style="font-size:11px; color:var(--muted)">(${m.category})</span></span>
                </label>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-weight:600; color:var(--accent);">₹${m.price}</span>
                  <input type="number" min="1" max="10" value="1" class="form-input item-qty-input" style="width:50px; padding:2px 6px; font-size:12px;" onchange="window.recalcNewOrderTotal()">
                </div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top:14px; padding:10px 14px; background:#FAFAF9; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:12px; color:var(--muted);">Estimated Subtotal</div>
              <div style="font-size:18px; font-weight:700; color:var(--text);" id="new-order-total-preview">₹0</div>
            </div>
            <div style="display:flex; gap:10px;">
              <select class="form-select" id="order-payment-method" style="width:auto;">
                <option value="UPI">UPI / GPay</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Cash">Cash at Counter</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-new-order')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Place Order</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-new-order');
};

window.toggleTableSelector = (type) => {
  const grp = document.getElementById('group-order-table');
  if (grp) {
    grp.style.display = type === 'Dine-in' ? 'block' : 'none';
  }
};

window.recalcNewOrderTotal = () => {
  let subtotal = 0;
  const checkboxes = document.querySelectorAll('.order-item-cb:checked');
  checkboxes.forEach(cb => {
    const price = parseFloat(cb.dataset.price);
    const row = cb.closest('div');
    const qtyInput = row.querySelector('.item-qty-input');
    const qty = parseInt(qtyInput ? qtyInput.value : 1, 10);
    subtotal += price * qty;
  });
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;
  const el = document.getElementById('new-order-total-preview');
  if (el) el.textContent = `₹${total} (incl. 5% GST)`;
};

window.submitNewOrder = (e) => {
  e.preventDefault();
  const name = document.getElementById('order-cust-name').value.trim();
  const phone = document.getElementById('order-cust-phone').value.trim();
  const type = document.getElementById('order-type-select').value;
  const table = type === 'Dine-in' ? document.getElementById('order-table-select').value : (type === 'Takeaway' ? 'Pickup Counter' : 'Online / Delivery');
  const payMethod = document.getElementById('order-payment-method').value;

  const selectedItems = [];
  let subtotal = 0;
  document.querySelectorAll('.order-item-cb:checked').forEach(cb => {
    const itemName = cb.dataset.name;
    const price = parseFloat(cb.dataset.price);
    const row = cb.closest('div');
    const qty = parseInt(row.querySelector('.item-qty-input').value, 10) || 1;
    const lineTotal = price * qty;
    subtotal += lineTotal;
    selectedItems.push({ name: itemName, qty, price, total: lineTotal });
  });

  if (selectedItems.length === 0) {
    toast.error('Please select at least one menu item.');
    return;
  }

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  const newId = 'ORD-' + Math.floor(5530 + Math.random() * 800);

  const newOrder = {
    id: newId,
    customer: name,
    phone: phone,
    type: type,
    table: table,
    items: selectedItems,
    subtotal: subtotal,
    tax: tax,
    serviceCharge: 0,
    discount: 0,
    total: total,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: payMethod,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    date: '2026-08-31',
    notes: 'POS Order'
  };

  store.createOrder(newOrder);
  modal.close('modal-new-order');
  toast.success(`Order ${newId} created successfully for ${name}`);
  renderOrders();
};

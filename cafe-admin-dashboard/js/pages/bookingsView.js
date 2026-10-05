/* ══════════════════════════════════════════════════════════════
   BREW & CO — BOOKINGS & RESERVATIONS VIEW CONTROLLER
   List & Calendar views with table assignment & status actions
   ══════════════════════════════════════════════════════════════ */

import { store, getTodayDateString, getOffsetDateString } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let bookingFilter = 'all';
let viewMode = 'list'; // 'list' or 'calendar'
let bookingSearch = '';
let activeBookingId = null;

export function renderBookings() {
  const state = store.getState();
  const el = document.getElementById('view-bookings');
  if (!el) return;

  const todayStr = getTodayDateString();
  const todayBookings = state.bookings.filter(b => b.date === todayStr);

  let filtered = [...state.bookings];
  if (bookingFilter === 'today') {
    filtered = filtered.filter(b => b.date === todayStr);
  } else if (bookingFilter === 'upcoming') {
    filtered = filtered.filter(b => b.date > todayStr);
  } else if (bookingFilter === 'confirmed') {
    filtered = filtered.filter(b => b.status === 'Confirmed' || b.status === 'Seated');
  } else if (bookingFilter === 'pending') {
    filtered = filtered.filter(b => b.status === 'Pending');
  } else if (bookingFilter === 'cancelled') {
    filtered = filtered.filter(b => b.status === 'Cancelled');
  }

  if (bookingSearch.trim()) {
    const q = bookingSearch.toLowerCase().trim();
    filtered = filtered.filter(b => 
      b.id.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.phone.includes(q)
    );
  }

  const todayFormatted = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  el.innerHTML = `
    <!-- Today's Reservations Highlight Card -->
    <div style="background:var(--card); border:1px solid var(--border); border-left:4px solid var(--accent); border-radius:10px; padding:16px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <div style="font-size:15px; font-weight:700; color:var(--text);">Today's Reservations Overview &middot; ${todayFormatted}</div>
        <div style="font-size:12px; color:var(--muted); margin-top:2px;">
          ${todayBookings.length} total scheduled today &middot; ${todayBookings.filter(b => b.status === 'Seated').length} currently seated &middot; ${todayBookings.filter(b => b.status === 'Confirmed').length} upcoming today
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-outline btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}" onclick="window.switchBookingView('list')">📋 List View</button>
        <button class="btn btn-outline btn-sm ${viewMode === 'calendar' ? 'btn-primary' : ''}" onclick="window.switchBookingView('calendar')">📅 Calendar View</button>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${bookingFilter === 'all' ? 'active' : ''}" onclick="window.filterBookings('all')">All (${state.bookings.length})</button>
        <button class="ftab ${bookingFilter === 'today' ? 'active' : ''}" onclick="window.filterBookings('today')">Today (${todayBookings.length})</button>
        <button class="ftab ${bookingFilter === 'upcoming' ? 'active' : ''}" onclick="window.filterBookings('upcoming')">Upcoming</button>
        <button class="ftab ${bookingFilter === 'pending' ? 'active' : ''}" onclick="window.filterBookings('pending')">Pending Action</button>
        <button class="ftab ${bookingFilter === 'confirmed' ? 'active' : ''}" onclick="window.filterBookings('confirmed')">Confirmed</button>
        <button class="ftab ${bookingFilter === 'cancelled' ? 'active' : ''}" onclick="window.filterBookings('cancelled')">Cancelled</button>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search guest name, phone..." value="${bookingSearch}" oninput="window.searchBookings(this.value)">
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.openNewBookingModal()">+ New Booking</button>
      </div>
    </div>

    <!-- View Content (List or Calendar) -->
    ${viewMode === 'list' ? `
      <div class="table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest</th>
                <th>Phone</th>
                <th>Date &amp; Time</th>
                <th>Party Size</th>
                <th>Assigned Table</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="9">
                    <div class="empty-state">
                      <div class="empty-icon">📅</div>
                      <div class="empty-title">No bookings found</div>
                      <div class="empty-desc">No bookings match the selected filter.</div>
                    </div>
                  </td>
                </tr>
              ` : filtered.map(b => `
                <tr>
                  <td class="td-mono td-bold">${b.id}</td>
                  <td class="td-bold">${b.name}</td>
                  <td class="td-muted">${b.phone}</td>
                  <td>
                    <div><strong>${b.date}</strong></div>
                    <div style="font-size:11.5px; color:var(--muted);">${b.time}</div>
                  </td>
                  <td><span class="badge badge-grey">${b.guests} Guests</span></td>
                  <td>
                    <span style="font-weight:600; color:${b.table === 'Unassigned' ? 'var(--red)' : 'var(--text)'};">
                      ${b.table}
                    </span>
                  </td>
                  <td><span class="badge ${b.channel === 'WhatsApp' ? 'badge-green' : 'badge-blue'}">${b.channel}</span></td>
                  <td>${window.getBookingStatusBadge(b.status)}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.openBookingDetails('${b.id}')">Manage</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : `
      <!-- Calendar Grid Preview -->
      <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:20px;">
        <div style="font-size:14px; font-weight:700; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
          <span>Schedule Calendar — Upcoming 7 Days</span>
          <span style="font-size:12px; color:var(--muted);">Today: ${todayFormatted}</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:8px;">
          ${[0, 1, 2, 3, 4, 5, 6].map(offset => {
            const dateStr = getOffsetDateString(offset);
            const d = new Date();
            d.setDate(d.getDate() + offset);
            const dayLabel = offset === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' });
            const dateNum = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            const dayBookings = state.bookings.filter(b => b.date === dateStr);
            return `
              <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:8px; padding:10px; min-height:160px;">
                <div style="font-weight:700; font-size:12px; margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:4px; color:${offset === 0 ? 'var(--accent)' : 'var(--text)'};">
                  ${dayLabel} <span style="font-size:10.5px; font-weight:400; color:var(--muted)">(${dateNum})</span>
                </div>
                ${dayBookings.length === 0 ? `<div style="font-size:11px; color:var(--muted);">No bookings</div>` : dayBookings.map(b => `
                  <div style="background:#fff; border:1px solid var(--border); border-left:3px solid var(--accent); border-radius:4px; padding:5px 7px; margin-bottom:6px; cursor:pointer;" onclick="window.openBookingDetails('${b.id}')">
                    <div style="font-size:11.5px; font-weight:600;">${b.time} &middot; ${b.name}</div>
                    <div style="font-size:10.5px; color:var(--muted);">${b.guests} guests &bull; ${b.table}</div>
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `}

    <!-- Booking Details Modal -->
    <div class="modal-backdrop" id="modal-booking-details">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" id="booking-modal-title">Booking Details</div>
          <button class="modal-close-btn" onclick="window.modal.close('modal-booking-details')">✕</button>
        </div>
        <div class="modal-body" id="booking-modal-body"></div>
        <div class="modal-footer" id="booking-modal-footer"></div>
      </div>
    </div>
  `;
}

window.switchBookingView = (mode) => {
  viewMode = mode;
  renderBookings();
};

window.filterBookings = (f) => {
  bookingFilter = f;
  renderBookings();
};

window.searchBookings = (q) => {
  bookingSearch = q;
  renderBookings();
};

window.getBookingStatusBadge = (status) => {
  const map = {
    Confirmed: 'badge-green',
    Seated: 'badge-blue',
    Pending: 'badge-yellow',
    Completed: 'badge-grey',
    Cancelled: 'badge-red',
    'No-show': 'badge-red'
  };
  return `<span class="badge ${map[status] || 'badge-grey'}">${status}</span>`;
};

window.openBookingDetails = (bookingId) => {
  activeBookingId = bookingId;
  const state = store.getState();
  const booking = state.bookings.find(b => b.id === bookingId);
  if (!booking) return;

  document.getElementById('booking-modal-title').textContent = `${booking.id} — ${booking.name}`;

  document.getElementById('booking-modal-body').innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <div>
        <div style="font-size:16px; font-weight:700;">${booking.name}</div>
        <div style="font-size:12.5px; color:var(--muted);">${booking.phone} &middot; ${booking.email || 'No email provided'}</div>
      </div>
      <div>${window.getBookingStatusBadge(booking.status)}</div>
    </div>

    <div class="form-row" style="background:#FAFAF9; padding:12px; border-radius:8px; border:1px solid var(--border); margin-bottom:16px;">
      <div>
        <label class="form-label" style="font-size:11px; color:var(--muted); margin-bottom:4px;">Time Slot</label>
        <input type="text" class="form-input" id="edit-booking-time" style="padding:5px 8px; font-size:13px; font-weight:600;" value="${booking.time}" onchange="window.saveBookingModification('${booking.id}')">
      </div>
      <div>
        <label class="form-label" style="font-size:11px; color:var(--muted); margin-bottom:4px;">Date</label>
        <input type="date" class="form-input" id="edit-booking-date" style="padding:5px 8px; font-size:12px;" value="${booking.date}" onchange="window.saveBookingModification('${booking.id}')">
      </div>
      <div>
        <label class="form-label" style="font-size:11px; color:var(--muted); margin-bottom:4px;">Party Size</label>
        <input type="number" min="1" max="25" class="form-input" id="edit-booking-guests" style="padding:5px 8px; font-size:13px; font-weight:600;" value="${booking.guests}" onchange="window.saveBookingModification('${booking.id}')">
      </div>
    </div>

    <!-- Table Assignment Form -->
    <div class="form-group">
      <label class="form-label">Assign Table</label>
      <select class="form-select" id="booking-assign-table" onchange="window.assignTableToBooking('${booking.id}', this.value)">
        <option value="Unassigned" ${booking.table === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
        ${state.tables.map(t => `
          <option value="Table ${t.number}" ${booking.table === 'Table ' + t.number ? 'selected' : ''}>
            Table ${t.number} (${t.capacity} Seats - ${t.zone}) - ${t.status}
          </option>
        `).join('')}
      </select>
    </div>

    ${booking.specialRequests ? `
      <div style="margin-top:10px; background:var(--accent-dim); padding:10px 12px; border-radius:6px; font-size:12.5px;">
        <strong>Special Request:</strong> ${booking.specialRequests}
      </div>
    ` : ''}

    <div style="margin-top:14px; font-size:11.5px; color:var(--muted);">
      Channel: <strong>${booking.channel}</strong> &middot; Automated notifications active.
    </div>
  `;

  // Status Action Buttons
  document.getElementById('booking-modal-footer').innerHTML = `
    ${booking.status === 'Pending' ? `
      <button class="btn btn-primary btn-sm" onclick="window.updateBookingStatusAction('${booking.id}', 'Confirmed')">Confirm Booking</button>
      <button class="btn btn-danger-ghost btn-sm" onclick="window.updateBookingStatusAction('${booking.id}', 'Cancelled')">Reject</button>
    ` : booking.status === 'Confirmed' ? `
      <button class="btn btn-success btn-sm" onclick="window.updateBookingStatusAction('${booking.id}', 'Seated')">Seat Guests Now</button>
      <button class="btn btn-danger-ghost btn-sm" onclick="window.updateBookingStatusAction('${booking.id}', 'Cancelled')">Cancel Booking</button>
    ` : booking.status === 'Seated' ? `
      <button class="btn btn-primary btn-sm" onclick="window.updateBookingStatusAction('${booking.id}', 'Completed')">Mark Completed</button>
    ` : ''}
    <button class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-booking-details')">Close</button>
  `;

  modal.open('modal-booking-details');
};

window.saveBookingModification = (bookingId) => {
  const time = document.getElementById('edit-booking-time').value.trim();
  const date = document.getElementById('edit-booking-date').value;
  const guests = parseInt(document.getElementById('edit-booking-guests').value, 10);
  store.updateBooking(bookingId, { time, date, guests });
  toast.success(`Booking ${bookingId} updated to ${time}`);
  renderBookings();
};

window.assignTableToBooking = (bookingId, tableValue) => {
  store.assignBookingTable(bookingId, tableValue);
  toast.success(`Assigned ${tableValue} to booking ${bookingId}`);
  renderBookings();
};

window.updateBookingStatusAction = (bookingId, newStatus) => {
  store.updateBookingStatus(bookingId, newStatus);
  toast.success(`Booking ${bookingId} status changed to ${newStatus}`);
  modal.close('modal-booking-details');
  renderBookings();
};

// Create New Booking Modal
window.openNewBookingModal = () => {
  const state = store.getState();
  let modalEl = document.getElementById('modal-new-booking');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-new-booking';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ New Reservation</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-new-booking')">✕</button>
      </div>
      <form onsubmit="window.saveNewBooking(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Guest Name *</label>
              <input type="text" class="form-input" id="book-name" required placeholder="e.g. Deepali Sen">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="book-phone" required placeholder="e.g. 9876500000">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date *</label>
              <input type="date" class="form-input" id="book-date" required value="${getTodayDateString()}">
            </div>
            <div class="form-group">
              <label class="form-label">Time Slot *</label>
              <input type="time" class="form-input" id="book-time" required value="19:30">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Number of Guests *</label>
              <input type="number" min="1" max="25" class="form-input" id="book-guests" required value="2">
            </div>
            <div class="form-group">
              <label class="form-label">Table</label>
              <select class="form-select" id="book-table">
                <option value="Unassigned">Unassigned (Assign Later)</option>
                ${state.tables.map(t => `<option value="Table ${t.number}">Table ${t.number} (${t.capacity} seats)</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Special Requests / Occasion</label>
            <textarea class="form-textarea" id="book-requests" placeholder="e.g. High chair needed, anniversary flower decoration on table..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-new-booking')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Confirm Booking</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-new-booking');
};

window.saveNewBooking = (e) => {
  e.preventDefault();
  const name = document.getElementById('book-name').value.trim();
  const phone = document.getElementById('book-phone').value.trim();
  const date = document.getElementById('book-date').value;
  const time = document.getElementById('book-time').value;
  const guests = parseInt(document.getElementById('book-guests').value, 10);
  const table = document.getElementById('book-table').value;
  const requests = document.getElementById('book-requests').value.trim();

  const newId = 'RES-' + Math.floor(2415 + Math.random() * 800);

  const newBooking = {
    id: newId,
    name: name,
    phone: phone,
    email: '',
    date: date,
    time: time,
    guests: guests,
    table: table,
    status: 'Confirmed',
    channel: 'Walk-in / Phone',
    specialRequests: requests
  };

  store.createBooking(newBooking);
  modal.close('modal-new-booking');
  toast.success(`Reservation ${newId} confirmed for ${name}`);
  renderBookings();
};

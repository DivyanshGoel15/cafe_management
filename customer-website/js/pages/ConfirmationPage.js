/**
 * Booking Confirmation & Status Lookup View
 * Shows confirmed booking details, calendar export, modification, cancellation, and lookup tool
 */
import { bookingService } from '../services/bookingService.js';
import { CAFE_INFO } from '../data/cafeData.js';
import { Toast } from '../components/Toast.js';

export async function renderConfirmationPage() {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const bookingId = urlParams.get('id');

  let booking = null;
  if (bookingId) {
    booking = await bookingService.getBooking(bookingId);
  }

  return `
    <div style="background:var(--forest); color:#FFF; padding:50px 0 40px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Reservation Central</span>
        <h1 style="color:#FFF; margin-bottom:10px;">Booking Status &amp; Details</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:580px; margin:0 auto; font-size:1.05rem;">
          View confirmation details, sync to your personal calendar, or manage existing table reservations.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container" style="max-width:820px;">
        ${booking ? renderBookingDetailsCard(booking) : renderLookupForm()}
      </div>
    </section>
  `;
}

function renderBookingDetailsCard(b) {
  const isCancelled = b.status === 'CANCELLED';

  return `
    <div class="confirmation-card">
      <div class="confirmation-header">
        <div class="confirmation-icon" style="${isCancelled ? 'background:var(--nonveg-red-bg); border-color:var(--nonveg-red-border); color:var(--nonveg-red);' : ''}">
          ${isCancelled ? '✕' : '✓'}
        </div>
        <h2 style="font-size:1.8rem; margin-bottom:6px; color:var(--forest);">
          ${isCancelled ? 'Reservation Cancelled' : 'Table Confirmed!'}
        </h2>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          ${isCancelled 
            ? 'This reservation was successfully cancelled. We hope to welcome you another time.' 
            : `We are delighted to host you at ${CAFE_INFO.name}. A confirmation SMS has been dispatched.`}
        </p>
        <div class="booking-ref-badge" id="conf-booking-id">
          Booking ID: ${b.id}
        </div>
      </div>

      <!-- Details Summary Table -->
      <div class="confirmation-details-list">
        <div class="conf-detail-row">
          <span class="conf-detail-label">Cafe Destination</span>
          <span class="conf-detail-value">${CAFE_INFO.name} — ${CAFE_INFO.address.locality}</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Guest Name</span>
          <span class="conf-detail-value" id="conf-guest-name">${escapeHtml(b.customerName)}</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Date &amp; Time</span>
          <span class="conf-detail-value" id="conf-datetime">${formatDateDisplay(b.date)} at ${b.time}</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Party Size</span>
          <span class="conf-detail-value" id="conf-guests">${b.guests} ${b.guests === 1 ? 'Guest' : 'Guests'}</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Assigned Seating</span>
          <span class="conf-detail-value">${b.area || 'Courtyard Patio'} (Table ${b.tableNumber || 7})</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Contact Phone</span>
          <span class="conf-detail-value">${escapeHtml(b.phone)}</span>
        </div>
        ${b.specialRequest ? `
          <div class="conf-detail-row">
            <span class="conf-detail-label">Special Requests</span>
            <span class="conf-detail-value">${escapeHtml(b.specialRequest)}</span>
          </div>
        ` : ''}
        <div class="conf-detail-row">
          <span class="conf-detail-label">Status</span>
          <span class="badge ${isCancelled ? 'badge-nonveg' : 'badge-veg'}">
            ${b.status}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      ${!isCancelled ? `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">
          <button class="btn btn-outline" onclick="window.downloadIcsCalendar('${b.id}')">
            📅 Download .ICS Calendar
          </button>
          <a href="${getGoogleCalendarUrl(b)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
            🗓️ Add to Google Calendar
          </a>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; padding-top:20px; border-top:1px dashed var(--border);">
          <div style="display:flex; gap:10px;">
            <button class="btn btn-ghost btn-sm" onclick="window.openModifyBookingModal('${b.id}')" style="color:var(--copper);">
              ✏️ Modify Time / Guests
            </button>
            <button class="btn btn-ghost btn-sm" onclick="window.confirmCancelBooking('${b.id}')" style="color:var(--nonveg-red);">
              ✕ Cancel Reservation
            </button>
          </div>
          <a href="#/menu" class="btn btn-primary btn-sm">
            Explore Menu in Advance &rarr;
          </a>
        </div>
      ` : `
        <div style="text-align:center; padding-top:16px;">
          <a href="#/reservations" class="btn btn-primary">
            Make a New Reservation &rarr;
          </a>
        </div>
      `}

      <!-- Direction and Contact Guidance -->
      <div style="margin-top:32px; background:var(--bg); border-radius:var(--radius-sm); padding:16px; font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
        <strong>Need help or running late?</strong> Call our floor host at 
        <a href="tel:${CAFE_INFO.contact.phone}" style="color:var(--copper); font-weight:600;">${CAFE_INFO.contact.phoneDisplay}</a>. 
        Tables are held for up to 15 minutes past scheduled arrival time. Complimentary valet parking is available at the entrance.
      </div>
    </div>
  `;
}

function renderLookupForm() {
  return `
    <div class="card" style="padding:40px; box-shadow:var(--shadow-md);">
      <div style="text-align:center; margin-bottom:28px;">
        <div style="font-size:2.5rem; margin-bottom:12px;">🔎</div>
        <h2 style="font-size:1.6rem; color:var(--forest); margin-bottom:6px;">Find Your Table Reservation</h2>
        <p style="color:var(--text-muted); font-size:0.95rem;">Enter your 7-character Booking Reference (e.g. BK-82914) or contact phone number.</p>
      </div>

      <form id="lookup-booking-form" onsubmit="window.handleLookupSubmit(event)" style="max-width:480px; margin:0 auto;">
        <div class="form-group">
          <label class="form-label">Booking Reference or Phone Number</label>
          <input 
            type="text" 
            id="lookup-query-input" 
            class="form-input" 
            placeholder="e.g. BK-82914 or 9811234567" 
            required
            style="font-size:1.05rem; padding:14px;"
          >
        </div>

        <button type="submit" class="btn btn-primary w-full" style="width:100%; margin-top:8px;">
          Check Reservation Status &rarr;
        </button>
      </form>

      <div style="margin-top:32px; text-align:center; font-size:0.88rem; color:var(--text-muted);">
        Don't have a reservation yet? 
        <a href="#/reservations" style="color:var(--copper); font-weight:600; text-decoration:underline;">
          Book a table online in 60 seconds &rarr;
        </a>
      </div>
    </div>
  `;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function getGoogleCalendarUrl(b) {
  const title = encodeURIComponent(`Reservation at ${CAFE_INFO.name}`);
  const details = encodeURIComponent(`Table Reservation for ${b.guests} guests (Booking ID: ${b.id}). Address: ${CAFE_INFO.address.full}. Phone: ${CAFE_INFO.contact.phone}`);
  const location = encodeURIComponent(CAFE_INFO.address.full);
  
  // Format dates: YYYYMMDDTHHMMSS
  const dateClean = b.date.replace(/-/g, '');
  const [h, m] = b.time.split(':');
  const startH = h.padStart(2, '0');
  const endH = String(Number(h) + 2).padStart(2, '0');
  const dates = `${dateClean}T${startH}${m}00/${dateClean}T${endH}${m}00`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Global confirmation action handlers
if (typeof window !== 'undefined') {
  window.handleLookupSubmit = async function(e) {
    e.preventDefault();
    const query = document.getElementById('lookup-query-input')?.value?.trim();
    if (!query) return;

    if (query.toUpperCase().startsWith('BK-')) {
      const b = await bookingService.getBooking(query);
      if (b) {
        window.location.hash = `#/booking-confirmation?id=${b.id}`;
      } else {
        Toast.show(`No reservation found matching "${query}".`, 'error');
      }
    } else {
      const results = await bookingService.findBookingsByPhone(query);
      if (results.length > 0) {
        window.location.hash = `#/booking-confirmation?id=${results[0].id}`;
      } else {
        Toast.show(`No reservations found for phone number "${query}".`, 'error');
      }
    }
  };

  window.downloadIcsCalendar = function(bookingId) {
    bookingService.getBooking(bookingId).then(b => {
      if (!b) return;
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Cafe Aroma//Table Reservation//EN",
        "BEGIN:VEVENT",
        `UID:${b.id}@cafearoma.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `SUMMARY:Table at ${CAFE_INFO.name}`,
        `DESCRIPTION:Reservation for ${b.guests} guests. Reference: ${b.id}. Phone: ${CAFE_INFO.contact.phone}`,
        `LOCATION:${CAFE_INFO.address.full}`,
        `DTSTART:${b.date.replace(/-/g, '')}T${b.time.replace(':', '')}00`,
        `DTEND:${b.date.replace(/-/g, '')}T${String(Number(b.time.split(':')[0]) + 2).padStart(2, '0')}${b.time.split(':')[1]}00`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `CafeAroma_Reservation_${b.id}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Toast.show('Calendar event file downloaded!', 'success');
    });
  };

  window.confirmCancelBooking = function(bookingId) {
    if (confirm('Are you sure you wish to cancel this table reservation?')) {
      bookingService.cancelBooking(bookingId).then(() => {
        Toast.show('Reservation cancelled successfully.', 'info');
        window.location.hash = `#/booking-confirmation?id=${bookingId}`;
      }).catch(err => {
        Toast.show(err.message || 'Failed to cancel reservation.', 'error');
      });
    }
  };

  window.openModifyBookingModal = function(bookingId) {
    const newGuests = prompt("Enter new party size (e.g. 4):");
    if (!newGuests) return;
    const num = parseInt(newGuests, 10);
    if (isNaN(num) || num < 1 || num > 16) {
      alert("Please enter a valid guest count between 1 and 16.");
      return;
    }

    bookingService.updateBooking(bookingId, { guests: num }).then(() => {
      Toast.show(`Booking party updated to ${num} guests!`, 'success');
      window.location.hash = `#/booking-confirmation?id=${bookingId}`;
      window.location.reload();
    }).catch(err => {
      Toast.show(err.message || 'Failed to update booking.', 'error');
    });
  };
}

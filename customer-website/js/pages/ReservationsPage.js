/**
 * Reservations / Book a Table Page View
 * Complete stepped booking flow with realistic availability verification
 */
import { bookingService } from '../services/bookingService.js';
import { Toast } from '../components/Toast.js';

let bookingState = {
  step: 1,
  guests: 2,
  date: '',
  time: '19:30',
  area: 'any',
  name: '',
  phone: '',
  email: '',
  specialRequest: '',
  occasion: 'Casual Dining',
  couponCode: '',
  isChecking: false,
  errorMsg: ''
};

export async function renderReservationsPage(params = {}) {
  // Read prefilled params from query
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  if (urlParams.get('code')) {
    bookingState.couponCode = urlParams.get('code');
  }
  if (urlParams.get('item')) {
    bookingState.specialRequest = `Requesting to taste: ${urlParams.get('item')}`;
  }

  // Set default date to today or tomorrow
  if (!bookingState.date) {
    const today = new Date().toISOString().split('T')[0];
    bookingState.date = today;
  }

  const timeSlots = bookingService.getTimeSlots();
  const seatingAreas = bookingService.getSeatingAreas();
  const todayStr = new Date().toISOString().split('T')[0];

  return `
    <div style="background:var(--forest); color:#FFF; padding:60px 0 45px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Table Reservations</span>
        <h1 style="color:#FFF; margin-bottom:12px;">Reserve Your Experience</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:1.1rem;">
          Instant table confirmation with real-time seat availability. Zero booking fee, free cancellation anytime.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container booking-container">
        <div class="booking-card">
          <!-- Step Progress Indicator -->
          <div class="booking-steps-bar">
            <div class="booking-step-node ${bookingState.step === 1 ? 'active' : (bookingState.step > 1 ? 'completed' : '')}" onclick="window.goToBookingStep(1)">
              <div class="step-circle">${bookingState.step > 1 ? '✓' : '1'}</div>
              <span class="step-label">Party &amp; Date</span>
            </div>
            <div class="booking-step-node ${bookingState.step === 2 ? 'active' : (bookingState.step > 2 ? 'completed' : '')}" onclick="window.goToBookingStep(2)">
              <div class="step-circle">${bookingState.step > 2 ? '✓' : '2'}</div>
              <span class="step-label">Time &amp; Area</span>
            </div>
            <div class="booking-step-node ${bookingState.step === 3 ? 'active' : (bookingState.step > 3 ? 'completed' : '')}" onclick="window.goToBookingStep(3)">
              <div class="step-circle">${bookingState.step > 3 ? '✓' : '3'}</div>
              <span class="step-label">Guest Details</span>
            </div>
            <div class="booking-step-node ${bookingState.step === 4 ? 'active' : ''}">
              <div class="step-circle">4</div>
              <span class="step-label">Confirm</span>
            </div>
          </div>

          <!-- Error Alert Banner -->
          <div id="booking-error-box" style="display:${bookingState.errorMsg ? 'block' : 'none'}; background:var(--nonveg-red-bg); border:1px solid var(--nonveg-red-border); color:var(--nonveg-red); padding:12px 16px; border-radius:var(--radius-sm); margin-bottom:24px; font-weight:500; font-size:0.92rem;">
            ${bookingState.errorMsg}
          </div>

          <!-- Form Content Container -->
          <div id="booking-step-content">
            ${renderCurrentStepContent(timeSlots, seatingAreas, todayStr)}
          </div>
        </div>

        <!-- Check Existing Booking Banner -->
        <div style="text-align:center; margin-top:32px; font-size:0.92rem; color:var(--text-muted);">
          Already have a reservation with us? 
          <a href="#/booking-confirmation" style="color:var(--copper); font-weight:600; text-decoration:underline;">
            Look up your booking status or modify details &rarr;
          </a>
        </div>
      </div>
    </section>
  `;
}

function renderCurrentStepContent(timeSlots, seatingAreas, todayStr) {
  if (bookingState.step === 1) {
    return `
      <div>
        <h3 style="margin-bottom:20px; color:var(--forest);">Step 1: Party Size &amp; Date</h3>

        <!-- Guest Count Selector -->
        <div class="form-group">
          <label class="form-label">Number of Guests</label>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            ${[1, 2, 3, 4, 5, 6, 8, 10].map(g => `
              <button 
                type="button"
                class="btn ${bookingState.guests === g ? 'btn-secondary' : 'btn-outline'}" 
                style="min-width:54px; height:48px; border-radius:var(--radius-sm);"
                onclick="window.selectBookingGuests(${g})"
              >
                ${g} ${g === 1 ? 'Guest' : 'Guests'}
              </button>
            `).join('')}
          </div>
          <span class="form-help" style="margin-top:6px;">For parties greater than 10 guests, a private salon alcove will be requested.</span>
        </div>

        <!-- Date Picker with Quick Selectors -->
        <div class="form-group" style="margin-top:24px;">
          <label class="form-label">Select Date <span class="required">*</span></label>
          <div style="display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-ghost" onclick="window.selectQuickDate(0)">Today</button>
            <button type="button" class="btn btn-sm btn-ghost" onclick="window.selectQuickDate(1)">Tomorrow</button>
            <button type="button" class="btn btn-sm btn-ghost" onclick="window.selectQuickDate(2)">Day After</button>
          </div>
          <input 
            type="date" 
            id="booking-date" 
            class="form-input" 
            value="${bookingState.date}" 
            min="${todayStr}"
            onchange="bookingState.date = this.value"
            style="max-width:320px;"
          >
        </div>

        <div style="margin-top:36px; display:flex; justify-content:flex-end;">
          <button type="button" class="btn btn-primary" onclick="window.validateStep1AndProceed()">
            Continue to Time Selection &rarr;
          </button>
        </div>
      </div>
    `;
  }

  if (bookingState.step === 2) {
    return `
      <div>
        <h3 style="margin-bottom:20px; color:var(--forest);">Step 2: Choose Preferred Time Slot</h3>

        <div class="form-group">
          <label class="form-label">Available Seating Times for ${bookingState.guests} Guests on ${bookingState.date}</label>
          <div class="slot-grid" style="margin-top:8px;">
            ${timeSlots.map(slot => `
              <div 
                class="slot-btn ${bookingState.time === slot.time ? 'selected' : ''}" 
                onclick="window.selectBookingTime('${slot.time}')"
                role="button"
                tabindex="0"
              >
                <span class="slot-time">${slot.label}</span>
                <span class="slot-session">${slot.session}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-group" style="margin-top:28px;">
          <label class="form-label">Seating Atmosphere Preference</label>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${seatingAreas.map(area => `
              <label class="card" style="padding:14px; display:flex; align-items:flex-start; gap:12px; cursor:pointer; border-color:${bookingState.area === area.id ? 'var(--copper)' : 'var(--border)'}; background:${bookingState.area === area.id ? 'rgba(184, 115, 51, 0.04)' : '#FFF'};">
                <input 
                  type="radio" 
                  name="booking-area" 
                  value="${area.id}" 
                  ${bookingState.area === area.id ? 'checked' : ''}
                  onchange="bookingState.area = this.value; window.updateBookingStepUI();"
                  style="margin-top:3px; accent-color:var(--copper);"
                >
                <div>
                  <strong style="color:var(--forest); font-size:0.95rem;">${area.name}</strong>
                  <p style="font-size:0.84rem; color:var(--text-muted); margin:0;">${area.desc}</p>
                </div>
              </label>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:36px; display:flex; justify-content:space-between;">
          <button type="button" class="btn btn-outline" onclick="window.goToBookingStep(1)">&larr; Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateStep2AndProceed()">
            Continue to Guest Details &rarr;
          </button>
        </div>
      </div>
    `;
  }

  if (bookingState.step === 3) {
    return `
      <div>
        <h3 style="margin-bottom:20px; color:var(--forest);">Step 3: Guest &amp; Occasion Information</h3>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <div class="form-group">
            <label class="form-label">Full Name <span class="required">*</span></label>
            <input 
              type="text" 
              id="booking-name" 
              class="form-input" 
              placeholder="e.g. Ananya Sharma" 
              value="${escapeHtml(bookingState.name)}"
              oninput="bookingState.name = this.value"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number <span class="required">*</span></label>
            <input 
              type="tel" 
              id="booking-phone" 
              class="form-input" 
              placeholder="e.g. +91 98765 43210" 
              value="${escapeHtml(bookingState.phone)}"
              oninput="bookingState.phone = this.value"
              required
            >
            <span class="form-help">We send an instant SMS booking confirmation.</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <div class="form-group">
            <label class="form-label">Email Address (Optional)</label>
            <input 
              type="email" 
              id="booking-email" 
              class="form-input" 
              placeholder="name@example.com" 
              value="${escapeHtml(bookingState.email)}"
              oninput="bookingState.email = this.value"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Special Occasion</label>
            <select class="form-select" onchange="bookingState.occasion = this.value">
              <option value="Casual Dining" ${bookingState.occasion === 'Casual Dining' ? 'selected' : ''}>Casual Dining</option>
              <option value="Birthday Celebration" ${bookingState.occasion === 'Birthday Celebration' ? 'selected' : ''}>Birthday Celebration</option>
              <option value="Anniversary" ${bookingState.occasion === 'Anniversary' ? 'selected' : ''}>Anniversary</option>
              <option value="Business Meeting / Co-Working" ${bookingState.occasion === 'Business Meeting / Co-Working' ? 'selected' : ''}>Business / Co-Working</option>
              <option value="First Date" ${bookingState.occasion === 'First Date' ? 'selected' : ''}>Date Night</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Special Seating or Dietary Notes (Optional)</label>
          <textarea 
            class="form-textarea" 
            rows="2" 
            placeholder="e.g. High chair needed, window seat preferred, celebrating Rahul's birthday..."
            oninput="bookingState.specialRequest = this.value"
          >${escapeHtml(bookingState.specialRequest)}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Promotional Coupon Code</label>
          <div style="display:flex; gap:10px;">
            <input 
              type="text" 
              class="form-input" 
              placeholder="e.g. MORNING20 or CELEBRATE" 
              value="${escapeHtml(bookingState.couponCode)}"
              oninput="bookingState.couponCode = this.value.toUpperCase()"
              style="text-transform:uppercase; max-width:260px;"
            >
          </div>
        </div>

        <div style="margin-top:36px; display:flex; justify-content:space-between;">
          <button type="button" class="btn btn-outline" onclick="window.goToBookingStep(2)">&larr; Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateStep3AndProceed()">
            Review &amp; Verify Availability &rarr;
          </button>
        </div>
      </div>
    `;
  }

  // Step 4: Verification & Confirm
  return `
    <div>
      <h3 style="margin-bottom:20px; color:var(--forest);">Step 4: Review &amp; Check Availability</h3>

      <div class="card" style="background:var(--bg); border:1px solid var(--border); margin-bottom:24px;">
        <h4 style="margin-bottom:14px; color:var(--forest);">Reservation Summary</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.92rem;">
          <div><strong style="color:var(--text-muted);">Date:</strong> ${bookingState.date}</div>
          <div><strong style="color:var(--text-muted);">Time:</strong> ${bookingState.time}</div>
          <div><strong style="color:var(--text-muted);">Party Size:</strong> ${bookingState.guests} Guests</div>
          <div><strong style="color:var(--text-muted);">Area:</strong> ${bookingState.area === 'any' ? 'Best Available' : bookingState.area}</div>
          <div><strong style="color:var(--text-muted);">Guest Name:</strong> ${escapeHtml(bookingState.name)}</div>
          <div><strong style="color:var(--text-muted);">Phone:</strong> ${escapeHtml(bookingState.phone)}</div>
          ${bookingState.occasion ? `<div><strong style="color:var(--text-muted);">Occasion:</strong> ${escapeHtml(bookingState.occasion)}</div>` : ''}
          ${bookingState.couponCode ? `<div><strong style="color:var(--copper);">Offer Code:</strong> ${escapeHtml(bookingState.couponCode)}</div>` : ''}
        </div>
      </div>

      <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:28px; line-height:1.5;">
        🔒 By clicking "Confirm Reservation", our live booking system verifies table availability against current cafe floor occupancy and holds your table for 15 minutes past reservation time.
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button type="button" class="btn btn-outline" onclick="window.goToBookingStep(3)">&larr; Edit Details</button>
        <button 
          type="button" 
          class="btn btn-primary btn-lg" 
          id="btn-confirm-booking" 
          onclick="window.executeBookingVerification()"
          ${bookingState.isChecking ? 'disabled' : ''}
        >
          ${bookingState.isChecking ? '<span class="spinner"></span> Checking Availability...' : 'Confirm Table Reservation ✓'}
        </button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Global booking interaction handlers
if (typeof window !== 'undefined') {
  window.selectBookingGuests = function(num) {
    bookingState.guests = num;
    window.updateBookingStepUI();
  };

  window.selectQuickDate = function(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    bookingState.date = d.toISOString().split('T')[0];
    const input = document.getElementById('booking-date');
    if (input) input.value = bookingState.date;
  };

  window.selectBookingTime = function(timeStr) {
    bookingState.time = timeStr;
    window.updateBookingStepUI();
  };

  window.goToBookingStep = function(stepNum) {
    bookingState.errorMsg = '';
    bookingState.step = stepNum;
    window.updateBookingStepUI();
  };

  window.validateStep1AndProceed = function() {
    bookingState.errorMsg = '';
    const dateInput = document.getElementById('booking-date');
    if (dateInput) bookingState.date = dateInput.value;

    if (!bookingState.date) {
      bookingState.errorMsg = 'Please select a reservation date.';
      window.updateBookingStepUI();
      return;
    }
    bookingState.step = 2;
    window.updateBookingStepUI();
  };

  window.validateStep2AndProceed = function() {
    bookingState.errorMsg = '';
    if (!bookingState.time) {
      bookingState.errorMsg = 'Please pick a time slot.';
      window.updateBookingStepUI();
      return;
    }
    bookingState.step = 3;
    window.updateBookingStepUI();
  };

  window.validateStep3AndProceed = function() {
    bookingState.errorMsg = '';
    const nameInput = document.getElementById('booking-name');
    const phoneInput = document.getElementById('booking-phone');
    if (nameInput) bookingState.name = nameInput.value;
    if (phoneInput) bookingState.phone = phoneInput.value;

    if (!bookingState.name || bookingState.name.trim().length < 2) {
      bookingState.errorMsg = 'Please enter your full name.';
      window.updateBookingStepUI();
      return;
    }

    if (!bookingState.phone || bookingState.phone.trim().length < 8) {
      bookingState.errorMsg = 'Please enter a valid phone number for booking updates.';
      window.updateBookingStepUI();
      return;
    }

    bookingState.step = 4;
    window.updateBookingStepUI();
  };

  window.executeBookingVerification = async function() {
    bookingState.errorMsg = '';
    bookingState.isChecking = true;
    window.updateBookingStepUI();

    try {
      // Step 1: Check realistic availability
      const avail = await bookingService.checkAvailability({
        date: bookingState.date,
        time: bookingState.time,
        guests: bookingState.guests,
        area: bookingState.area
      });

      if (!avail.available) {
        bookingState.isChecking = false;
        bookingState.errorMsg = avail.message || 'Sorry, this time slot is fully committed. Please select an adjacent time.';
        bookingState.step = 2; // Jump back to time selection
        window.updateBookingStepUI();
        return;
      }

      // Step 2: Confirm booking
      const newBooking = await bookingService.createBooking({
        name: bookingState.name,
        phone: bookingState.phone,
        email: bookingState.email,
        date: bookingState.date,
        time: bookingState.time,
        guests: bookingState.guests,
        area: bookingState.area,
        specialRequest: bookingState.specialRequest,
        couponCode: bookingState.couponCode
      });

      Toast.show(`Reservation Confirmed! Ref: ${newBooking.id}`, 'success', 5000);

      // Reset state and redirect to confirmation view
      bookingState = {
        step: 1,
        guests: 2,
        date: '',
        time: '19:30',
        area: 'any',
        name: '',
        phone: '',
        email: '',
        specialRequest: '',
        occasion: 'Casual Dining',
        couponCode: '',
        isChecking: false,
        errorMsg: ''
      };

      window.location.hash = `#/booking-confirmation?id=${newBooking.id}`;
    } catch (err) {
      console.error(err);
      bookingState.isChecking = false;
      bookingState.errorMsg = err.message || 'An error occurred while verifying reservation.';
      window.updateBookingStepUI();
    }
  };

  window.updateBookingStepUI = function() {
    const errorBox = document.getElementById('booking-error-box');
    if (errorBox) {
      errorBox.style.display = bookingState.errorMsg ? 'block' : 'none';
      errorBox.textContent = bookingState.errorMsg;
    }

    const contentBox = document.getElementById('booking-step-content');
    if (contentBox) {
      const timeSlots = bookingService.getTimeSlots();
      const seatingAreas = bookingService.getSeatingAreas();
      const todayStr = new Date().toISOString().split('T')[0];
      contentBox.innerHTML = renderCurrentStepContent(timeSlots, seatingAreas, todayStr);
    }

    // Update node states
    const nodes = document.querySelectorAll('.booking-step-node');
    nodes.forEach((node, idx) => {
      const stepIdx = idx + 1;
      node.className = `booking-step-node ${bookingState.step === stepIdx ? 'active' : (bookingState.step > stepIdx ? 'completed' : '')}`;
      const circle = node.querySelector('.step-circle');
      if (circle) {
        circle.textContent = bookingState.step > stepIdx ? '✓' : stepIdx;
      }
    });
  };
}

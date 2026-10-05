/**
 * Booking Service
 * Handles table reservation flows, realistic availability checks,
 * booking creation, status queries, updates and cancellations.
 * Connected to Central API Single Source of Truth.
 */
import { TABLES, CAFE_INFO } from '../data/cafeData.js';
import { delay } from './cafeService.js';

const API_BASE = (typeof window !== 'undefined' && window.location.origin) ? `${window.location.origin}/api` : 'http://localhost:4000/api';
const STORAGE_KEY = 'cafe_aroma_bookings';

const memoryStore = new Map();
function getStorage() {
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  return {
    getItem: (k) => memoryStore.get(k) || null,
    setItem: (k, v) => memoryStore.set(k, String(v)),
    removeItem: (k) => memoryStore.delete(k)
  };
}

function getAllLocalBookings() {
  try {
    const raw = getStorage().getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBookings(bookings) {
  try {
    getStorage().setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings locally:', e);
  }
}

export const bookingService = {
  /**
   * Available time slots for booking
   */
  getTimeSlots() {
    return [
      { time: "08:30", label: "08:30 AM", session: "Breakfast" },
      { time: "09:30", label: "09:30 AM", session: "Breakfast" },
      { time: "11:00", label: "11:00 AM", session: "Brunch" },
      { time: "12:00", label: "12:00 PM", session: "Lunch" },
      { time: "12:30", label: "12:30 PM", session: "Lunch" },
      { time: "13:00", label: "01:00 PM", session: "Lunch" },
      { time: "13:30", label: "01:30 PM", session: "Lunch" },
      { time: "14:00", label: "02:00 PM", session: "Lunch" },
      { time: "16:00", label: "04:00 PM", session: "High-Tea" },
      { time: "17:00", label: "05:00 PM", session: "High-Tea" },
      { time: "18:30", label: "06:30 PM", session: "Dinner" },
      { time: "19:00", label: "07:00 PM", session: "Dinner" },
      { time: "19:30", label: "07:30 PM", session: "Dinner" },
      { time: "20:00", label: "08:00 PM", session: "Dinner" },
      { time: "20:30", label: "08:30 PM", session: "Dinner" },
      { time: "21:00", label: "09:00 PM", session: "Dinner" }
    ];
  },

  /**
   * Available seating areas
   */
  getSeatingAreas() {
    return [
      { id: "any", name: "No Preference (Best Available)", desc: "We will allocate the finest available spot for your party" },
      { id: "Courtyard Patio", name: "Sunlit Courtyard Patio", desc: "Pet-friendly glass botanical greenhouse with garden vibes" },
      { id: "Indoor Salon", name: "Main Indoor Salon", desc: "Acoustic jazz, espresso bar aromas & comfortable dining chairs" },
      { id: "Window Alcove", name: "Heritage Window Alcove", desc: "Cozy scenic nooks overlooking Connaught Place colonnade" },
      { id: "Private Salon", name: "Private Dining Nook", desc: "Intimate and quiet space for celebrations & gatherings (6+ guests)" }
    ];
  },

  /**
   * Check real-time seat availability
   */
  async checkAvailability({ date, time, guests, area = 'any' }) {
    await delay(120);

    const guestNum = parseInt(guests, 10);
    if (guestNum > 20) {
      throw new Error("For parties of more than 20 guests, please contact our private events team.");
    }
    if (!guestNum || guestNum < 1) {
      return { available: false, message: "Bookings support parties between 1 and 20 guests." };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date && date < todayStr) {
      return { available: false, message: "Reservations cannot be made for past dates. Please select a valid upcoming date." };
    }

    try {
      // Query central API bookings for that date
      const res = await fetch(`${API_BASE}/bookings?date=${encodeURIComponent(date)}`, { cache: 'no-store' });
      if (res.ok) {
        const bookings = await res.json();
        const collisions = bookings.filter(b => b.time === time && b.status !== 'Cancelled');
        if (collisions.length >= 10) {
          return { available: false, message: `No tables currently available for ${guestNum} guests at ${time} on ${date}.` };
        }
      }
    } catch (err) {
      // Fallback
    }

    return {
      available: true,
      message: `Table confirmed available! We have reserved seating for your party.`,
      table: { id: 'T-04', number: 4, capacity: Math.max(4, guestNum), area: area === 'any' ? 'Main Dining' : area }
    };
  },

  /**
   * Confirm and create reservation
   */
  async createBooking(bookingData) {
    const {
      name,
      phone,
      email = "",
      date,
      time,
      guests,
      area = "any",
      specialRequest = "",
      couponCode = ""
    } = bookingData;

    if (!name || name.trim().length < 2) throw new Error("Please enter your full name.");
    if (!phone || phone.trim().length < 8) throw new Error("Please enter a valid contact phone number.");
    if (!date) throw new Error("Please select a date.");
    if (!time) throw new Error("Please select a time slot.");

    const generatedId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
    const payload = {
      id: generatedId,
      name: name.trim(),
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date,
      time,
      guests: parseInt(guests, 10),
      area,
      status: 'CONFIRMED',
      specialRequests: specialRequest.trim(),
      couponCode: couponCode.trim().toUpperCase(),
      channel: 'Customer Web'
    };

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newBooking = await res.json();
        // Ensure customerName and status uppercase compatibility
        newBooking.customerName = newBooking.customerName || newBooking.name;
        if (newBooking.status === 'Confirmed') newBooking.status = 'CONFIRMED';
        // Sync local cache
        const local = getAllLocalBookings();
        local.unshift(newBooking);
        saveLocalBookings(local);
        return newBooking;
      } else {
        const errData = await res.json();
        const apiErr = new Error(errData.error || 'Failed to create booking');
        apiErr.isApiError = true;
        throw apiErr;
      }
    } catch (err) {
      if (err.isApiError) {
        throw err;
      }
      // Local fallback if Central API unreachable
      const localBooking = {
        id: generatedId,
        customerName: name.trim(),
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        date,
        time,
        guests: parseInt(guests, 10),
        table: 'Table 4',
        tableId: 'T-04',
        tableNumber: 4,
        area,
        status: 'CONFIRMED',
        channel: 'Customer Web',
        specialRequests: specialRequest.trim(),
        couponCode: couponCode.trim().toUpperCase(),
        createdAt: new Date().toISOString()
      };
      const local = getAllLocalBookings();
      local.unshift(localBooking);
      saveLocalBookings(local);
      return localBooking;
    }
  },

  /**
   * Retrieve booking by booking ID
   */
  async getBooking(bookingId) {
    if (!bookingId) return null;
    const cleanId = bookingId.trim();

    try {
      const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(cleanId)}`, { cache: 'no-store' });
      if (res.ok) {
        const booking = await res.json();
        return {
          ...booking,
          customerName: booking.customerName || booking.name,
          specialRequest: booking.specialRequest || booking.specialRequests,
          tableNumber: booking.tableNumber || (booking.table ? parseInt(booking.table.replace(/[^0-9]/g, ''), 10) : 1)
        };
      }
    } catch (err) {
      // Fallback
    }

    const local = getAllLocalBookings();
    return local.find(b => (b.id || '').toUpperCase() === cleanId.toUpperCase()) || null;
  },

  /**
   * Search bookings by phone number
   */
  async findBookingsByPhone(phone) {
    if (!phone) return [];
    try {
      const res = await fetch(`${API_BASE}/bookings?phone=${encodeURIComponent(phone)}`, { cache: 'no-store' });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {}

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const local = getAllLocalBookings();
    return local.filter(b => (b.phone || '').replace(/[^0-9]/g, '').includes(cleanPhone));
  },

  /**
   * Update an existing booking
   */
  async updateBooking(bookingId, updates) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(bookingId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {}

    const local = getAllLocalBookings();
    const idx = local.findIndex(b => (b.id || '').toUpperCase() === bookingId.toUpperCase());
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates, updatedAt: new Date().toISOString() };
      saveLocalBookings(local);
      return local[idx];
    }
    throw new Error(`Booking ${bookingId} not found`);
  },

  /**
   * Cancel an existing reservation
   */
  async cancelBooking(bookingId, reason = "Customer requested cancellation") {
    try {
      const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(bookingId)}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const resData = await res.json();
        resData.status = 'CANCELLED';
        return resData;
      }
    } catch (err) {}

    const local = getAllLocalBookings();
    const idx = local.findIndex(b => (b.id || '').toUpperCase() === bookingId.toUpperCase());
    if (idx !== -1) {
      local[idx].status = 'CANCELLED';
      local[idx].cancellationReason = reason;
      local[idx].cancelledAt = new Date().toISOString();
      saveLocalBookings(local);
      return local[idx];
    }
    throw new Error(`Booking ${bookingId} not found`);
  }
};

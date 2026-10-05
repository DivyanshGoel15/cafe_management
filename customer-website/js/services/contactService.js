/**
 * Contact Service
 * Manages customer inquiries, event catering requests, and feedback
 */
import { delay } from './cafeService.js';

const STORAGE_KEY = 'cafe_aroma_inquiries';
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

function saveInquiry(inquiry) {
  try {
    const store = getStorage();
    const raw = store.getItem(STORAGE_KEY);
    const inquiries = raw ? JSON.parse(raw) : [];
    inquiries.unshift(inquiry);
    store.setItem(STORAGE_KEY, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Failed to save inquiry:', e);
  }
}

export const contactService = {
  /**
   * Submit a contact inquiry form
   */
  async submitContact({ name, email, phone = "", subject = "General Inquiry", message }) {
    await delay(320);

    if (!name || name.trim().length < 2) {
      throw new Error("Please enter your name.");
    }

    if (!email && !phone) {
      throw new Error("Please provide either an email address or phone number so we can respond.");
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    if (!message || message.trim().length < 8) {
      throw new Error("Please provide a message with at least 8 characters.");
    }

    const ticketId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const inquiry = {
      ticketId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: "RECEIVED"
    };

    saveInquiry(inquiry);

    return {
      success: true,
      ticketId,
      message: `Thank you, ${name.trim()}! Your message has been received (Ref: ${ticketId}). Our hospitality team will reply within 2–4 hours.`
    };
  }
};

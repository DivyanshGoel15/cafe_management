/**
 * Cafe Service
 * Handles cafe brand information, operational status, and business hours
 * Connected to Central API with fallback
 */
import { CAFE_INFO } from '../data/cafeData.js';

export const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE = 'http://localhost:4000/api';

let cachedCafe = null;
let lastFetchTime = 0;

export const cafeService = {
  /**
   * Fetch complete cafe profile from Central API
   */
  async getCafe() {
    const now = Date.now();
    if (cachedCafe && now - lastFetchTime < 3000) {
      return { ...cachedCafe };
    }
    try {
      const res = await fetch(`${API_BASE}/cafe`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        // Blend with existing rich attributes for seamless UI support
        cachedCafe = {
          ...CAFE_INFO,
          ...data,
          address: {
            ...CAFE_INFO.address,
            full: data.address || CAFE_INFO.address.full
          },
          contact: {
            ...CAFE_INFO.contact,
            phone: data.phone || CAFE_INFO.contact.phone,
            phoneDisplay: data.phone || CAFE_INFO.contact.phoneDisplay,
            email: data.email || CAFE_INFO.contact.email
          },
          hours: data.hours || CAFE_INFO.hours
        };
        lastFetchTime = now;
        return { ...cachedCafe };
      }
    } catch (e) {
      // Fallback to local data
    }
    return { ...CAFE_INFO };
  },

  /**
   * Fetch business hours
   */
  async getHours() {
    const cafe = await this.getCafe();
    return cafe.hours || CAFE_INFO.hours;
  },

  /**
   * Determine live opening status based on current day and time
   */
  isOpenNow() {
    const cafe = cachedCafe || CAFE_INFO;
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[now.getDay()];
    const todayHours = (cafe.hours || CAFE_INFO.hours).find(h => h.day === currentDay);

    if (!todayHours) return { isOpen: false, statusText: "Closed", closingTime: "" };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [openH, openM] = (todayHours.open || "08:00").split(":").map(Number);
    const [closeH, closeM] = (todayHours.close || "23:00").split(":").map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    return {
      isOpen,
      currentDay,
      hoursToday: todayHours.display,
      statusText: isOpen ? "Open Now" : "Closed",
      closingTime: todayHours.display?.split("–")[1]?.trim() || "11:00 PM",
      nextOpenText: isOpen ? `Closes at ${todayHours.display?.split("–")[1]?.trim() || '11:00 PM'}` : `Opens at ${todayHours.display?.split("–")[0]?.trim() || '8:00 AM'}`
    };
  }
};

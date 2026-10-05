/**
 * Offers Service
 * Centralized interface for promotions, vouchers, coupon validation
 * Connected to Central API.
 */
import { OFFERS } from '../data/cafeData.js';
import { delay } from './cafeService.js';

const API_BASE = 'http://localhost:4000/api';

export const offersService = {
  /**
   * Get all promotional offers from Central API
   * @param {boolean} [onlyActive=true]
   */
  async getOffers(onlyActive = true) {
    try {
      const res = await fetch(`${API_BASE}/offers?onlyActive=${onlyActive}`, { cache: 'no-store' });
      if (res.ok) {
        const offers = await res.json();
        if (Array.isArray(offers) && offers.length > 0) {
          return offers.map(o => ({
            ...o,
            validUntil: o.validUntil || o.endDate,
            badge: o.discountType === 'percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`
          }));
        }
      }
    } catch (e) {}

    const now = new Date();
    return OFFERS.filter(offer => {
      if (!onlyActive) return true;
      const validUntil = new Date(offer.validUntil);
      return offer.isActive && validUntil >= now;
    });
  },

  /**
   * Get offer by coupon code
   */
  async getOfferByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const offers = await this.getOffers(false);
    const offer = offers.find(o => (o.code || '').toUpperCase() === cleanCode);
    if (!offer) return null;

    const now = new Date();
    const validUntil = new Date(offer.validUntil || offer.endDate);
    const isExpired = validUntil < now;

    return {
      ...offer,
      isExpired,
      isValid: (offer.status === 'Active' || offer.isActive) && !isExpired
    };
  }
};

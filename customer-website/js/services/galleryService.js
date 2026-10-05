/**
 * Gallery Service
 * Provides categorized photography items for the gallery page & lightbox
 */
import { GALLERY_ITEMS } from '../data/cafeData.js';
import { delay } from './cafeService.js';

export const galleryService = {
  /**
   * Get gallery items, optionally filtered by category
   */
  async getGalleryImages(category = 'all') {
    await delay(120);
    if (!category || category === 'all') {
      return [...GALLERY_ITEMS];
    }
    return GALLERY_ITEMS.filter(img => img.category === category);
  },

  /**
   * Get preview subset for homepage
   */
  async getPreviewImages(limit = 6) {
    await delay(80);
    return GALLERY_ITEMS.slice(0, limit);
  }
};

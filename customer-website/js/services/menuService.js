/**
 * Menu Service
 * Centralized interface for categories, items, filtering, searching and item details.
 * Connected to Central API with seamless fallback.
 */
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/cafeData.js';
import { delay } from './cafeService.js';

const API_BASE = 'http://localhost:4000/api';
let cachedItems = null;
let lastFetchTime = 0;

/**
 * Fetch live menu items from Central API with fallback
 */
async function fetchCentralMenuItems() {
  const now = Date.now();
  if (cachedItems && now - lastFetchTime < 2000) {
    return cachedItems;
  }
  try {
    const res = await fetch(`${API_BASE}/menu`, { cache: 'no-store' });
    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items) && items.length > 0) {
        // Normalize items to ensure all UI properties exist
        cachedItems = items.map(item => ({
          ...item,
          id: item.id,
          name: item.name,
          categoryId: item.categoryId || item.category || 'cat_starters',
          category: item.category || item.categoryId || 'Starters',
          price: Number(item.price),
          isVeg: item.isVeg !== false,
          isAvailable: item.available !== false && item.isAvailable !== false,
          rating: item.rating || 4.8,
          reviewsCount: item.reviewsCount || 120,
          prepTime: item.prepTime || '10 mins',
          calories: item.calories || '280 kcal',
          description: item.description || '',
          imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          tags: item.tags || (item.isPopular ? ['Bestseller'] : []),
          ingredients: item.ingredients || [],
          allergens: item.allergens || [],
          addons: item.addons || []
        }));
        lastFetchTime = now;
        return cachedItems;
      }
    }
  } catch (err) {
    // API server offline, use fallback
  }

  return MENU_ITEMS;
}

export const menuService = {
  /**
   * Get all menu categories with real-time active item counts
   */
  async getCategories() {
    const items = await fetchCentralMenuItems();
    // Build category map from actual active items
    const catMap = new Map();
    items.forEach(i => {
      const c = i.category || i.categoryId;
      if (c) catMap.set(c, (catMap.get(c) || 0) + 1);
    });

    const categories = [
      { id: 'all', name: 'All Creations', shortName: 'All', icon: 'sparkles', count: items.length }
    ];

    for (const [catName, count] of catMap.entries()) {
      categories.push({
        id: catName,
        name: catName,
        shortName: catName,
        description: `Freshly prepared ${catName.toLowerCase()}`,
        icon: catName.toLowerCase().includes('coffee') ? 'mug-hot' : 'utensils',
        count
      });
    }

    return categories;
  },

  /**
   * Search and filter menu items
   */
  async getItems({
    categoryId = 'all',
    search = '',
    isVeg = null,
    sortBy = 'popular',
    onlyAvailable = false
  } = {}) {
    let items = await fetchCentralMenuItems();

    // Category filter
    if (categoryId && categoryId !== 'all') {
      const catLower = categoryId.toLowerCase();
      items = items.filter(item => 
        (item.category || '').toLowerCase() === catLower ||
        (item.categoryId || '').toLowerCase() === catLower
      );
    }

    // Dietary filter
    if (isVeg !== null && isVeg !== undefined && isVeg !== 'all') {
      const boolVeg = isVeg === true || isVeg === 'true';
      items = items.filter(item => item.isVeg === boolVeg);
    }

    // Availability filter
    if (onlyAvailable) {
      items = items.filter(item => item.isAvailable);
    }

    // Search query filter
    if (search && search.trim() !== '') {
      const query = search.toLowerCase().trim();
      items = items.filter(item => {
        const inName = (item.name || '').toLowerCase().includes(query);
        const inDesc = (item.description || '').toLowerCase().includes(query);
        const inTags = (item.tags || []).some(tag => tag.toLowerCase().includes(query));
        const inIngredients = (item.ingredients || []).some(ing => ing.toLowerCase().includes(query));
        return inName || inDesc || inTags || inIngredients;
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
      default:
        items.sort((a, b) => {
          const aBestseller = (a.tags || []).includes('Bestseller') || !!a.isPopular;
          const bBestseller = (b.tags || []).includes('Bestseller') || !!b.isPopular;
          if (aBestseller && !bBestseller) return -1;
          if (!aBestseller && bBestseller) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
    }

    return [...items];
  },

  /**
   * Get single menu item by ID
   */
  async getItemById(itemId) {
    const items = await fetchCentralMenuItems();
    const clean = String(itemId).toLowerCase();
    const found = items.find(i => String(i.id).toLowerCase() === clean || (i.name && i.name.toLowerCase() === clean));
    return found ? { ...found } : null;
  }
};

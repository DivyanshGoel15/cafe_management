/**
 * Automated Test Suite for Cafe Aroma Customer Website
 * Tests services, data models, filters, availability calculations, and route resolutions.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { CAFE_INFO, MENU_CATEGORIES, MENU_ITEMS, OFFERS, TABLES } from '../js/data/cafeData.js';
import { cafeService } from '../js/services/cafeService.js';
import { menuService } from '../js/services/menuService.js';
import { offersService } from '../js/services/offersService.js';
import { bookingService } from '../js/services/bookingService.js';
import { contactService } from '../js/services/contactService.js';
import { tableService } from '../js/services/tableService.js';

test('Cafe Info & Business Hours', async (t) => {
  await t.test('Cafe profile matches expected metadata', () => {
    assert.equal(CAFE_INFO.name, 'Cafe Aroma');
    assert.equal(CAFE_INFO.currency, '₹');
    assert.ok(CAFE_INFO.address.locality.includes('Connaught Place'));
    assert.ok(CAFE_INFO.contact.phone.length > 5);
  });

  await t.test('cafeService.isOpenNow returns valid status object', () => {
    const status = cafeService.isOpenNow();
    assert.ok(typeof status.isOpen === 'boolean');
    assert.ok(status.statusText === 'Open Now' || status.statusText === 'Closed');
    assert.ok(status.hoursToday.length > 0);
  });
});

test('Menu Service & Filtering', async (t) => {
  await t.test('Categories list contains all required groups', async () => {
    const categories = await menuService.getCategories();
    assert.ok(categories.length >= 6);
    const catIds = categories.map(c => c.id);
    assert.ok(catIds.includes('cat_starters'));
    assert.ok(catIds.includes('cat_mains'));
    assert.ok(catIds.includes('cat_pizza_pasta'));
    assert.ok(catIds.includes('cat_beverages'));
    assert.ok(catIds.includes('cat_desserts'));
  });

  await t.test('Menu items count exceeds 20 items', async () => {
    const allItems = await menuService.getItems({ categoryId: 'all' });
    assert.ok(allItems.length >= 20, `Expected at least 20 items, got ${allItems.length}`);
  });

  await t.test('Category filter correctly isolates items', async () => {
    const starters = await menuService.getItems({ categoryId: 'cat_starters' });
    assert.ok(starters.length > 0);
    starters.forEach(item => {
      assert.equal(item.categoryId, 'cat_starters');
    });
  });

  await t.test('Dietary pure veg filter works', async () => {
    const vegItems = await menuService.getItems({ isVeg: true });
    assert.ok(vegItems.length > 0);
    vegItems.forEach(item => {
      assert.equal(item.isVeg, true);
    });
  });

  await t.test('Dietary non-veg filter works', async () => {
    const nonVegItems = await menuService.getItems({ isVeg: false });
    assert.ok(nonVegItems.length > 0);
    nonVegItems.forEach(item => {
      assert.equal(item.isVeg, false);
    });
  });

  await t.test('Menu search finds items by name or ingredients', async () => {
    const pizzaSearch = await menuService.getItems({ search: 'margherita' });
    assert.ok(pizzaSearch.length >= 1);
    assert.ok(pizzaSearch[0].name.toLowerCase().includes('margherita'));

    const ingredientSearch = await menuService.getItems({ search: 'truffle' });
    assert.ok(ingredientSearch.length >= 1);
  });

  await t.test('Menu sorting low-to-high and high-to-low works', async () => {
    const lowToHigh = await menuService.getItems({ sortBy: 'price-asc' });
    for (let i = 0; i < lowToHigh.length - 1; i++) {
      assert.ok(lowToHigh[i].price <= lowToHigh[i + 1].price);
    }

    const highToLow = await menuService.getItems({ sortBy: 'price-desc' });
    for (let i = 0; i < highToLow.length - 1; i++) {
      assert.ok(highToLow[i].price >= highToLow[i + 1].price);
    }
  });

  await t.test('Menu item lookup by ID works', async () => {
    const item = await menuService.getItemById('item_paneer_tikka');
    assert.equal(item.id, 'item_paneer_tikka');
    assert.ok(item.addons.length > 0);
  });

  await t.test('Unavailable items are identified', async () => {
    const unavailable = await menuService.getItemById('item_crispy_corn');
    assert.equal(unavailable.isAvailable, false);
  });
});

test('Offers Service', async (t) => {
  await t.test('Offers list contains 5+ promotions', async () => {
    const offers = await offersService.getOffers(true);
    assert.ok(offers.length >= 5);
  });

  await t.test('Offer lookup by coupon code', async () => {
    const morningOffer = await offersService.getOfferByCode('MORNING20');
    assert.ok(morningOffer);
    assert.equal(morningOffer.code, 'MORNING20');
    assert.equal(morningOffer.isValid, true);
  });
});

test('Table Reservations & Realistic Availability Engine', async (t) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  await t.test('Availability check succeeds for normal party and future date', async () => {
    const check = await bookingService.checkAvailability({
      date: tomorrow,
      time: '19:00',
      guests: 2,
      area: 'any'
    });
    assert.equal(check.available, true);
    assert.ok(check.table);
    assert.ok(check.table.capacity >= 2);
  });

  await t.test('Availability check rejects past dates', async () => {
    const check = await bookingService.checkAvailability({
      date: '2020-01-01',
      time: '19:00',
      guests: 2
    });
    assert.equal(check.available, false);
    assert.ok(check.message.includes('past dates'));
  });

  await t.test('Availability check rejects oversized party exceeding maximum limit', async () => {
    await assert.rejects(async () => {
      await bookingService.checkAvailability({
        date: tomorrow,
        time: '19:00',
        guests: 25
      });
    }, /private events team/);
  });

  await t.test('Successful booking creation generates valid booking reference', async () => {
    const booking = await bookingService.createBooking({
      name: 'Priyanka Sen',
      phone: '+91 98765 11223',
      email: 'priyanka@example.com',
      date: tomorrow,
      time: '13:00',
      guests: 4,
      area: 'Courtyard Patio',
      specialRequest: 'Corner table near fountain',
      couponCode: 'PIZZA50'
    });

    assert.ok(booking.id.startsWith('BK-'));
    assert.equal(booking.customerName, 'Priyanka Sen');
    assert.equal(booking.status, 'CONFIRMED');
    assert.ok(booking.tableNumber > 0);

    // Retrieve and verify
    const retrieved = await bookingService.getBooking(booking.id);
    assert.equal(retrieved.id, booking.id);
    assert.equal(retrieved.phone, '+91 98765 11223');

    // Cancel booking
    const cancelled = await bookingService.cancelBooking(booking.id);
    assert.equal(cancelled.status, 'CANCELLED');
  });

  await t.test('Booking lookup by phone number', async () => {
    const list = await bookingService.findBookingsByPhone('9811234567');
    assert.ok(Array.isArray(list));
  });
});

test('Contact Form Service', async (t) => {
  await t.test('Validates contact form inputs and returns confirmation ticket', async () => {
    const result = await contactService.submitContact({
      name: 'Aditya Roy',
      email: 'aditya@example.com',
      phone: '+91 99887 66554',
      subject: 'Private Dining & Events',
      message: 'Looking to book the courtyard for a 30th birthday gathering.'
    });

    assert.equal(result.success, true);
    assert.ok(result.ticketId.startsWith('INQ-'));
    assert.ok(result.message.includes('Aditya Roy'));
  });

  await t.test('Rejects invalid email format', async () => {
    await assert.rejects(async () => {
      await contactService.submitContact({
        name: 'Aditya',
        email: 'invalid-email',
        message: 'This is a test message.'
      });
    }, /valid email/);
  });
});

test('QR Dine-In Table Gateway Service', async (t) => {
  await t.test('Resolves table 7 parameter accurately', async () => {
    const info = await tableService.getTableInfo('7');
    assert.equal(info.isValid, true);
    assert.equal(info.tableNumber, 7);
    assert.equal(info.cafeName, 'Cafe Aroma');
    assert.ok(info.welcomeTitle.includes('Table 7'));
    assert.ok(info.dineInUrl.includes('table=7'));
  });

  await t.test('Handles table_12 string format correctly', async () => {
    const info = await tableService.getTableInfo('table_12');
    assert.equal(info.isValid, true);
    assert.equal(info.tableNumber, 12);
  });

  await t.test('Handles invalid non-numeric table param', async () => {
    const info = await tableService.getTableInfo('unknown_table');
    assert.equal(info.isValid, false);
  });
});

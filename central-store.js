/**
 * ══════════════════════════════════════════════════════════════
 *  BREW & CO — CENTRAL UNIFIED DATA STORE & BUSINESS LOGIC
 *  Single Source of Truth for Cafe Operations
 * ══════════════════════════════════════════════════════════════
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'central_store.json');

export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateString(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const INITIAL_CENTRAL_DATA = {
  cafe: {
    id: 'cafe_central_01',
    name: 'Brew & Co',
    tagline: 'Artisanal Roastery & Kitchen',
    subTagline: 'Single-origin roasts, 36-hour sourdough, and warm hospitality.',
    phone: '+91 98765 43210',
    email: 'indiranagar@brewandco.cafe',
    address: 'Plot 42, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, 560038',
    openingHours: '08:00 AM - 11:30 PM (Mon - Sun)',
    fssaiLicense: '11223344556677',
    currency: '₹',
    currencyCode: 'INR',
    taxRate: 0.05,
    serviceChargeRate: 0.05,
    gstPercentage: 5,
    serviceChargePercentage: 5,
    instagram: '@brewandcocafe',
    googleMapsUrl: 'https://maps.google.com/?cid=brewandco',
    hours: [
      { day: 'Monday', open: '08:00', close: '23:30', display: '8:00 AM – 11:30 PM' },
      { day: 'Tuesday', open: '08:00', close: '23:30', display: '8:00 AM – 11:30 PM' },
      { day: 'Wednesday', open: '08:00', close: '23:30', display: '8:00 AM – 11:30 PM' },
      { day: 'Thursday', open: '08:00', close: '23:30', display: '8:00 AM – 11:30 PM' },
      { day: 'Friday', open: '08:00', close: '23:30', display: '8:00 AM – 11:30 PM' },
      { day: 'Saturday', open: '07:30', close: '23:30', display: '7:30 AM – 11:30 PM' },
      { day: 'Sunday', open: '07:30', close: '23:30', display: '7:30 AM – 11:30 PM' }
    ]
  },

  menuCategories: [
    { id: 'all', name: 'All Creations', shortName: 'All', icon: 'sparkles' },
    { id: 'Coffee', name: 'Specialty Coffee', shortName: 'Coffee', icon: 'mug-hot' },
    { id: 'Starters', name: 'Starters & Small Bites', shortName: 'Starters', icon: 'utensils' },
    { id: 'Main Course', name: 'Main Course & Bowls', shortName: 'Mains', icon: 'bowl-food' },
    { id: 'Desserts', name: 'Artisanal Desserts', shortName: 'Desserts', icon: 'cake' },
    { id: 'Beverages', name: 'Botanical Beverages & Teas', shortName: 'Beverages', icon: 'glass-water' }
  ],

  menuItems: [
    {
      id: 'MNU-01',
      name: 'Cappuccino',
      category: 'Coffee',
      categoryId: 'Coffee',
      price: 180,
      cost: 45,
      isVeg: true,
      prepTime: '6 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Velvety espresso with steamed milk foam and organic cocoa dust.',
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668ba67e53?auto=format&fit=crop&w=600&q=80',
      tags: ['Bestseller', 'Artisanal Coffee'],
      addons: [{ id: 'ao-1', name: 'Oat Milk Substitute', price: 35 }, { id: 'ao-2', name: 'Hazelnut Shot', price: 25 }]
    },
    {
      id: 'MNU-02',
      name: 'Cold Coffee',
      category: 'Coffee',
      categoryId: 'Coffee',
      price: 160,
      cost: 40,
      isVeg: true,
      prepTime: '5 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Creamy blended iced brew with vanilla bean gelato scoop.',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
      tags: ['Bestseller', 'Iced Brew'],
      addons: [{ id: 'ao-3', name: 'Extra Gelato Scoop', price: 50 }]
    },
    {
      id: 'MNU-03',
      name: 'Espresso Single / Double',
      category: 'Coffee',
      categoryId: 'Coffee',
      price: 120,
      cost: 25,
      isVeg: true,
      prepTime: '3 mins',
      isPopular: false,
      available: true,
      isAvailable: true,
      description: 'Single origin Arabica bean extract with thick golden crema.',
      imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
      tags: ['Single Origin'],
      addons: []
    },
    {
      id: 'MNU-04',
      name: 'Cold Brew Reserve',
      category: 'Coffee',
      categoryId: 'Coffee',
      price: 200,
      cost: 50,
      isVeg: true,
      prepTime: '2 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Steeped for 18 hours in cold filtered spring water. Smooth and low acidity.',
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
      tags: ['Cold Brewed'],
      addons: []
    },
    {
      id: 'MNU-05',
      name: 'Spanish Latte',
      category: 'Coffee',
      categoryId: 'Coffee',
      price: 190,
      cost: 55,
      isVeg: true,
      prepTime: '7 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Espresso balanced with condensed milk and steamed whole milk.',
      imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
      tags: ['Signature'],
      addons: []
    },
    {
      id: 'MNU-06',
      name: 'Paneer Tikka Sandwich',
      category: 'Starters',
      categoryId: 'Starters',
      price: 220,
      cost: 75,
      isVeg: true,
      prepTime: '12 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Char-grilled cottage cheese in sourdough bread with mint chutney.',
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
      tags: ["Chef's Special", 'Sourdough'],
      addons: [{ id: 'ao-4', name: 'Extra Melted Cheese', price: 40 }]
    },
    {
      id: 'MNU-07',
      name: 'Artisan Margherita Pizza',
      category: 'Main Course',
      categoryId: 'Main Course',
      price: 350,
      cost: 110,
      isVeg: true,
      prepTime: '15 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Hand-stretched sourdough crust, San Marzano tomatoes, fresh mozzarella.',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
      tags: ['Sourdough Pizza', 'Bestseller'],
      addons: [{ id: 'ao-4', name: 'Extra Mozzarella', price: 50 }]
    },
    {
      id: 'MNU-07B',
      name: 'Classic Veg Burger',
      category: 'Main Course',
      categoryId: 'Main Course',
      price: 180,
      cost: 50,
      isVeg: true,
      prepTime: '10 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Crisp spiced potato patty with house sauce, lettuce and brioche bun.',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      tags: ['Bestseller', 'Burger'],
      addons: [{ id: 'ao-4', name: 'Extra Cheese', price: 40 }]
    },
    {
      id: 'MNU-08',
      name: 'Grilled Herb Sandwich',
      category: 'Starters',
      categoryId: 'Starters',
      price: 210,
      cost: 70,
      isVeg: true,
      prepTime: '10 mins',
      isPopular: false,
      available: false,
      isAvailable: false,
      description: 'Zucchini, bell peppers, melted cheddar and herb butter on multigrain.',
      imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
      tags: ['Multigrain'],
      addons: []
    },
    {
      id: 'MNU-09',
      name: 'Falafel Veggie Wrap',
      category: 'Main Course',
      categoryId: 'Main Course',
      price: 195,
      cost: 60,
      isVeg: true,
      prepTime: '10 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Crispy herb falafels, pickled cucumbers, hummus and tahini garlic dressing.',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      tags: ['Mediterranean'],
      addons: []
    },
    {
      id: 'MNU-10',
      name: 'Belgian Chocolate Cake',
      category: 'Desserts',
      categoryId: 'Desserts',
      price: 240,
      cost: 80,
      isVeg: true,
      prepTime: '2 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Rich 70% dark chocolate mousse layers with sea salt ganache.',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      tags: ['70% Dark Chocolate', 'Dessert'],
      addons: []
    },
    {
      id: 'MNU-11',
      name: 'New York Cheesecake',
      category: 'Desserts',
      categoryId: 'Desserts',
      price: 260,
      cost: 90,
      isVeg: true,
      prepTime: '2 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Classic baked cream cheese slice over crunchy graham cracker base.',
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
      tags: ['Classic Dessert'],
      addons: []
    },
    {
      id: 'MNU-12',
      name: 'Blueberry Crumble Muffin',
      category: 'Desserts',
      categoryId: 'Desserts',
      price: 130,
      cost: 38,
      isVeg: true,
      prepTime: '2 mins',
      isPopular: false,
      available: true,
      isAvailable: true,
      description: 'Fresh wild blueberries baked into fluffy buttermilk muffin crown.',
      imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80',
      tags: ['Fresh Baked'],
      addons: []
    },
    {
      id: 'MNU-13',
      name: 'Kolkata Masala Chai',
      category: 'Beverages',
      categoryId: 'Beverages',
      price: 60,
      cost: 15,
      isVeg: true,
      prepTime: '5 mins',
      isPopular: true,
      available: true,
      isAvailable: true,
      description: 'Slow-simmered Assam CTC tea leaves with fresh ginger, cardamom & clove.',
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      tags: ['Authentic Spiced Chai'],
      addons: []
    },
    {
      id: 'MNU-14',
      name: 'Organic Jasmine Green Tea',
      category: 'Beverages',
      categoryId: 'Beverages',
      price: 80,
      cost: 20,
      isVeg: true,
      prepTime: '4 mins',
      isPopular: false,
      available: true,
      isAvailable: true,
      description: 'Delicate whole-leaf green tea scented with pure night-blooming jasmine flowers.',
      imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80',
      tags: ['Organic Tea'],
      addons: []
    },
    {
      id: 'MNU-15',
      name: 'Fresh Mint Lime Soda',
      category: 'Beverages',
      categoryId: 'Beverages',
      price: 90,
      cost: 18,
      isVeg: true,
      prepTime: '4 mins',
      isPopular: false,
      available: true,
      isAvailable: true,
      description: 'Fresh squeezed Persian limes with crushed garden mint and sparkling soda.',
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      tags: ['Botanical Refresher'],
      addons: []
    }
  ],

  tables: [
    { id: 'T-01', number: 1, zone: 'Main Dining', capacity: 2, status: 'Occupied', currentCustomer: 'Priya Sharma', orderId: 'ORD-5521', billAmount: 580, seatedMinutes: 45, qr_identifier: 'qr_table_1', qr_url: 'http://localhost:5174/#/table/1', isActive: true },
    { id: 'T-02', number: 2, zone: 'Main Dining', capacity: 4, status: 'Occupied', currentCustomer: 'Arjun Mehta', orderId: 'ORD-5520', billAmount: 510, seatedMinutes: 28, qr_identifier: 'qr_table_2', qr_url: 'http://localhost:5174/#/table/2', isActive: true },
    { id: 'T-03', number: 3, zone: 'Main Dining', capacity: 4, status: 'Reserved', currentCustomer: 'Rahul Verma (7:00 PM)', orderId: null, billAmount: 0, seatedMinutes: 0, qr_identifier: 'qr_table_3', qr_url: 'http://localhost:5174/#/table/3', isActive: true },
    { id: 'T-04', number: 4, zone: 'Main Dining', capacity: 6, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0, qr_identifier: 'qr_table_4', qr_url: 'http://localhost:5174/#/table/4', isActive: true },
    { id: 'T-05', number: 5, zone: 'Patio & Garden', capacity: 2, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0, qr_identifier: 'qr_table_5', qr_url: 'http://localhost:5174/#/table/5', isActive: true },
    { id: 'T-06', number: 6, zone: 'Patio & Garden', capacity: 4, status: 'Cleaning', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 10, qr_identifier: 'qr_table_6', qr_url: 'http://localhost:5174/#/table/6', isActive: true },
    { id: 'T-07', number: 7, zone: 'Patio & Garden', capacity: 4, status: 'Occupied', currentCustomer: 'Pooja Agarwal', orderId: 'ORD-5514', billAmount: 890, seatedMinutes: 52, qr_identifier: 'qr_table_7', qr_url: 'http://localhost:5174/#/table/7', isActive: true },
    { id: 'T-08', number: 8, zone: 'Lounge Area', capacity: 6, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0, qr_identifier: 'qr_table_8', qr_url: 'http://localhost:5174/#/table/8', isActive: true },
    { id: 'T-09', number: 9, zone: 'Lounge Area', capacity: 8, status: 'Reserved', currentCustomer: 'Sonal Gupta (7:30 PM)', orderId: null, billAmount: 0, seatedMinutes: 0, qr_identifier: 'qr_table_9', qr_url: 'http://localhost:5174/#/table/9', isActive: true },
    { id: 'T-10', number: 10, zone: 'Bar Counter', capacity: 2, status: 'Occupied', currentCustomer: 'Tanya Malhotra', orderId: 'ORD-5512', billAmount: 480, seatedMinutes: 14, qr_identifier: 'qr_table_10', qr_url: 'http://localhost:5174/#/table/10', isActive: true },
    { id: 'T-11', number: 11, zone: 'Bar Counter', capacity: 2, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0, qr_identifier: 'qr_table_11', qr_url: 'http://localhost:5174/#/table/11', isActive: true },
    { id: 'T-12', number: 12, zone: 'Bar Counter', capacity: 2, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0, qr_identifier: 'qr_table_12', qr_url: 'http://localhost:5174/#/table/12', isActive: true }
  ],

  customers: [
    {
      id: 'CUST-101',
      name: 'Priya Sharma',
      phone: '9876543210',
      email: 'priya@gmail.com',
      orders: 28,
      spend: 14200,
      lastVisit: 'Today',
      status: 'Regular',
      notes: 'Always prefers lactose-free milk or oat milk.'
    },
    {
      id: 'CUST-102',
      name: 'Arjun Mehta',
      phone: '9812345678',
      email: 'arjun.m@outlook.com',
      orders: 15,
      spend: 7800,
      lastVisit: 'Today',
      status: 'Regular',
      notes: 'Loves iced cold brews and Margherita pizza.'
    }
  ],

  bookings: [
    {
      id: 'RES-2410',
      name: 'Priya Sharma',
      customerName: 'Priya Sharma',
      phone: '9876543210',
      email: 'priya@gmail.com',
      date: getTodayDateString(),
      time: '12:30 PM',
      guests: 4,
      table: 'Table 1',
      tableId: 'T-01',
      tableNumber: 1,
      status: 'Seated',
      channel: 'WhatsApp',
      specialRequests: 'Corner table with natural light'
    },
    {
      id: 'RES-2409',
      name: 'Arjun Mehta',
      customerName: 'Arjun Mehta',
      phone: '9812345678',
      email: 'arjun.m@outlook.com',
      date: getTodayDateString(),
      time: '01:00 PM',
      guests: 2,
      table: 'Table 2',
      tableId: 'T-02',
      tableNumber: 2,
      status: 'Seated',
      channel: 'WhatsApp',
      specialRequests: 'Anniversary celebration'
    },
    {
      id: 'RES-2408',
      name: 'Sonal Gupta',
      customerName: 'Sonal Gupta',
      phone: '9098765432',
      email: 'sonal.g@yahoo.com',
      date: getTodayDateString(),
      time: '07:30 PM',
      guests: 6,
      table: 'Table 9',
      tableId: 'T-09',
      tableNumber: 9,
      status: 'Confirmed',
      channel: 'Phone',
      specialRequests: 'High chair needed for child'
    },
    {
      id: 'RES-2407',
      name: 'Rahul Verma',
      customerName: 'Rahul Verma',
      phone: '9765432109',
      email: 'rahul.v@gmail.com',
      date: getTodayDateString(),
      time: '08:00 PM',
      guests: 2,
      table: 'Table 3',
      tableId: 'T-03',
      tableNumber: 3,
      status: 'Confirmed',
      channel: 'WhatsApp',
      specialRequests: 'Quiet spot for discussion'
    }
  ],

  orders: [
    {
      id: 'ORD-5521',
      orderNumber: 5521,
      customer: 'Priya Sharma',
      phone: '9876543210',
      type: 'Dine-in',
      table: 'Table 1',
      tableId: 'T-01',
      tableNumber: 1,
      sessionId: 'sess_t1_01',
      items: [
        { id: 'MNU-01', name: 'Cappuccino', qty: 2, price: 180, total: 360 },
        { id: 'MNU-06', name: 'Paneer Tikka Sandwich', qty: 1, price: 220, total: 220 }
      ],
      subtotal: 580,
      tax: 29,
      serviceCharge: 29,
      discount: 0,
      total: 638,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      time: '12:45 PM',
      date: getTodayDateString(),
      notes: 'Extra hot cappuccino'
    },
    {
      id: 'ORD-5520',
      orderNumber: 5520,
      customer: 'Arjun Mehta',
      phone: '9812345678',
      type: 'Dine-in',
      table: 'Table 2',
      tableId: 'T-02',
      tableNumber: 2,
      sessionId: 'sess_t2_01',
      items: [
        { id: 'MNU-02', name: 'Cold Coffee', qty: 1, price: 160, total: 160 },
        { id: 'MNU-07', name: 'Artisan Margherita Pizza', qty: 1, price: 350, total: 350 }
      ],
      subtotal: 510,
      tax: 25.5,
      serviceCharge: 25.5,
      discount: 0,
      total: 561,
      status: 'Ready',
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      time: '01:10 PM',
      date: getTodayDateString(),
      notes: 'Crispy crust pizza'
    },
    {
      id: 'ORD-5514',
      orderNumber: 5514,
      customer: 'Pooja Agarwal',
      phone: '9098765432',
      type: 'Dine-in',
      table: 'Table 7',
      tableId: 'T-07',
      tableNumber: 7,
      sessionId: 'sess_t7_01',
      items: [
        { id: 'MNU-02', name: 'Cold Coffee', qty: 2, price: 160, total: 320 },
        { id: 'MNU-07', name: 'Artisan Margherita Pizza', qty: 1, price: 350, total: 350 },
        { id: 'MNU-11', name: 'New York Cheesecake', qty: 1, price: 260, total: 260 }
      ],
      subtotal: 930,
      tax: 46.5,
      serviceCharge: 46.5,
      discount: 50,
      total: 973,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      time: '01:40 PM',
      date: getTodayDateString(),
      notes: 'Extra oregano on side'
    }
  ],

  payments: [
    { id: 'PAY-5521', orderId: 'ORD-5521', amount: 638, method: 'UPI', status: 'SUCCESS', timestamp: new Date().toISOString() },
    { id: 'PAY-5520', orderId: 'ORD-5520', amount: 561, method: 'Card', status: 'SUCCESS', timestamp: new Date().toISOString() }
  ],

  tableSessions: {
    'table_7': {
      sessionId: 'sess_t7_01',
      tableId: 'table_7',
      tableNumber: 7,
      status: 'Active',
      customers: [
        { customerId: 'cust_A', name: 'Customer A', phone: '9876500001', orderIds: ['ORD-5514'] }
      ],
      orderIds: ['ORD-5514'],
      totalAmount: 973,
      activeSince: new Date().toISOString()
    }
  },

  tableRequests: [
    {
      id: 'REQ-101',
      tableId: 'table_7',
      tableNumber: 7,
      requestType: 'waiter',
      notes: 'Customer requested waiter assistance',
      status: 'Pending',
      requestedAt: new Date().toISOString(),
      acknowledgedAt: null,
      completedAt: null
    }
  ],

  billRequests: [
    {
      id: 'BILL-101',
      tableId: 'table_7',
      tableNumber: 7,
      customerName: 'Pooja Agarwal',
      status: 'Pending',
      requestedAt: new Date().toISOString()
    }
  ],

  offers: [
    {
      id: 'OFF-01',
      code: 'BREWFIRST',
      title: 'Welcome First Order',
      discountType: 'percentage',
      discountValue: 20,
      minOrder: 300,
      maxDiscount: 100,
      startDate: getOffsetDateString(-30),
      endDate: getOffsetDateString(90),
      validUntil: getOffsetDateString(90),
      usedCount: 142,
      usageLimit: 500,
      status: 'Active',
      isActive: true
    },
    {
      id: 'OFF-02',
      code: 'WEEKENDCOFFEE',
      title: 'Weekend Morning Special',
      discountType: 'flat',
      discountValue: 75,
      minOrder: 400,
      maxDiscount: 75,
      startDate: getOffsetDateString(-15),
      endDate: getOffsetDateString(45),
      validUntil: getOffsetDateString(45),
      usedCount: 88,
      usageLimit: 200,
      status: 'Active',
      isActive: true
    }
  ],

  reviews: [
    {
      id: 'REV-01',
      customer: 'Anjali Kapoor',
      author: 'Anjali Kapoor',
      rating: 5,
      date: 'Yesterday',
      source: 'Google',
      text: 'Outstanding artisanal coffee! The Spanish Latte and Belgian chocolate cake are to die for.',
      review: 'Outstanding artisanal coffee! The Spanish Latte and Belgian chocolate cake are to die for.',
      status: 'Handled',
      reply: 'Thank you so much Anjali! It is always a pleasure having you at Brew & Co.',
      repliedAt: 'Yesterday, 4:15 PM'
    },
    {
      id: 'REV-02',
      customer: 'Priya Sharma',
      author: 'Priya Sharma',
      rating: 5,
      date: '2 days ago',
      source: 'WhatsApp',
      text: 'Booking through WhatsApp AI took literally 20 seconds. Food was served hot!',
      review: 'Booking through WhatsApp AI took literally 20 seconds. Food was served hot!',
      status: 'Handled',
      reply: 'Thanks Priya! Glad you enjoyed the seamless reservation experience.',
      repliedAt: '2 days ago, 1:30 PM'
    }
  ],

  notifications: [
    { id: 'NTF-01', type: 'order', title: 'New Dine-In Order Placed', message: 'Table 7 placed order ORD-5514 for ₹930.', time: '12 mins ago', read: false, page: 'orders' },
    { id: 'NTF-02', type: 'booking', title: 'New Reservation', message: 'Rahul Verma booked Table 3 for 2 guests at 8:00 PM.', time: '25 mins ago', read: false, page: 'bookings' }
  ],

  staff: [
    { id: 'stf-1', name: 'Aditya Singhal', email: 'owner@brewandco.com', phone: '+91 98765 11001', role: 'Owner', status: 'Active', shift: 'All Day' },
    { id: 'stf-2', name: 'Rajesh Kumar', email: 'manager@brewandco.com', phone: '+91 98123 22002', role: 'Manager', status: 'Active', shift: 'Morning (08:00 - 16:30)' }
  ],

  qrCodes: [
    { id: 'QR-01', table: 'Table 1', zone: 'Main Dining', status: 'Active', scansToday: 18, ordersToday: 12, revenueToday: 4620, url: 'http://localhost:5174/#/table/1' },
    { id: 'QR-07', table: 'Table 7', zone: 'Patio & Garden', status: 'Active', scansToday: 31, ordersToday: 22, revenueToday: 9450, url: 'http://localhost:5174/#/table/7' }
  ],

  whatsapp: {
    connection: {
      status: 'Connected',
      number: '+91 98765 00000',
      webhook: 'http://localhost:8002/webhooks/cafe',
      quality: 'High (Green)',
      dailyLimit: '10,000 conversations'
    },
    stats: { sentToday: 148, delivered: 146, read: 132, inboundResolved: 63 },
    chatLogs: [
      {
        id: 'msg-1',
        phone: '+91 98765 43210',
        name: 'Priya Sharma',
        time: '2:38 PM',
        intent: 'BOOKING',
        msgs: [
          { dir: 'in', text: 'Hi, I want to book a table for 4 people today evening' },
          { dir: 'out', text: 'Table for 4 confirmed at 7:00 PM. Booking ID: RES-2407. ☕' }
        ]
      }
    ]
  },

  aiCalls: {
    agent: {
      name: 'Aadhya — Voice Concierge',
      status: 'Active',
      phone: '+91 80 4000 1234',
      provider: 'Sarvam AI + Telephony Bridge',
      voice: 'Aadhya (Warm Indian English / Hindi Female)',
      greeting: 'Namaste! Welcome to Brew & Co. How may I help you today?',
      operatingHours: '08:00 AM - 11:30 PM',
      languageMode: 'Bilingual (Hinglish + English)'
    },
    stats: { totalCallsToday: 42, bookingConversions: 68, avgCallDuration: '1m 34s' },
    calls: [
      {
        id: 'CALL-108',
        caller: 'Rohit Khanna',
        phone: '+91 98234 56789',
        time: '2:15 PM Today',
        duration: '1m 45s',
        intent: 'Table Booking',
        result: 'Booking Confirmed (4 guests, 8:00 PM)',
        status: 'Successful',
        transcript: 'Caller: Hi, I want to book a table for 4 tonight around 8 PM.\nAI: Certainly! Table for 4 reserved.'
      }
    ]
  }
};

class CentralStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return { ...INITIAL_CENTRAL_DATA, ...parsed };
      }
    } catch (e) {
      console.warn('⚠️ Could not load data/central_store.json, creating initial store:', e.message);
    }
    const fresh = JSON.parse(JSON.stringify(INITIAL_CENTRAL_DATA));
    this.saveState(fresh);
    return fresh;
  }

  saveState(newState) {
    if (newState) this.state = newState;
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2), 'utf8');
    } catch (e) {
      console.error('❌ Failed to save central state to disk:', e.message);
    }
    this.notify();
  }

  notify(event = { type: 'STATE_CHANGED' }) {
    for (const l of this.listeners) {
      try { l(this.state, event); } catch (err) { console.error('Listener error:', err); }
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  // ── CAFE INFO ──
  getCafe() {
    return { ...this.state.cafe };
  }

  updateCafe(updates) {
    this.state.cafe = { ...this.state.cafe, ...updates };
    this.saveState();
    this.notify({ type: 'CAFE_UPDATED', data: this.state.cafe });
    return this.state.cafe;
  }

  // ── MENU CATEGORIES & ITEMS ──
  getCategories() {
    return this.state.menuCategories.map(cat => {
      const count = cat.id === 'all'
        ? this.state.menuItems.filter(m => !m.isDeleted).length
        : this.state.menuItems.filter(m => !m.isDeleted && (m.category === cat.id || m.categoryId === cat.id)).length;
      return { ...cat, count };
    });
  }

  getMenuItems(options = {}) {
    const { category, onlyAvailable, search } = options;
    let items = this.state.menuItems.filter(m => !m.isDeleted);

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      items = items.filter(m => (m.category || '').toLowerCase() === catLower || (m.categoryId || '').toLowerCase() === catLower);
    }
    if (onlyAvailable) {
      items = items.filter(m => m.available && m.isAvailable !== false);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(m =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q) ||
        (m.category || '').toLowerCase().includes(q)
      );
    }
    return items;
  }

  getMenuItem(id) {
    const cleanId = String(id).toLowerCase();
    return this.state.menuItems.find(m => String(m.id).toLowerCase() === cleanId || (m.name && m.name.toLowerCase() === cleanId));
  }

  createMenuItem(itemData) {
    const id = itemData.id || `MNU-${Date.now().toString().slice(-4)}`;
    const newItem = {
      id,
      name: itemData.name,
      category: itemData.category || 'Starters',
      categoryId: itemData.categoryId || itemData.category || 'Starters',
      price: Number(itemData.price),
      cost: itemData.cost ? Number(itemData.cost) : Math.round(Number(itemData.price) * 0.35),
      isVeg: itemData.isVeg !== false,
      prepTime: itemData.prepTime || '10 mins',
      isPopular: !!itemData.isPopular,
      available: itemData.available !== false,
      isAvailable: itemData.available !== false,
      description: itemData.description || '',
      imageUrl: itemData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      tags: itemData.tags || [],
      addons: itemData.addons || []
    };
    this.state.menuItems.unshift(newItem);
    this.saveState();
    this.notify({ type: 'MENU_ITEM_CREATED', data: newItem });
    return newItem;
  }

  updateMenuItem(id, updates) {
    const item = this.getMenuItem(id);
    if (!item) return null;

    if (updates.name !== undefined) item.name = updates.name;
    if (updates.category !== undefined) {
      item.category = updates.category;
      item.categoryId = updates.category;
    }
    if (updates.price !== undefined) item.price = Number(updates.price);
    if (updates.cost !== undefined) item.cost = Number(updates.cost);
    if (updates.isVeg !== undefined) item.isVeg = !!updates.isVeg;
    if (updates.prepTime !== undefined) item.prepTime = updates.prepTime;
    if (updates.isPopular !== undefined) item.isPopular = !!updates.isPopular;
    if (updates.available !== undefined) {
      item.available = !!updates.available;
      item.isAvailable = !!updates.available;
    }
    if (updates.description !== undefined) item.description = updates.description;
    if (updates.imageUrl !== undefined) item.imageUrl = updates.imageUrl;

    this.saveState();
    this.notify({ type: 'MENU_ITEM_UPDATED', data: item });
    return item;
  }

  deleteMenuItem(id) {
    const item = this.getMenuItem(id);
    if (!item) return false;
    // Soft delete so historical orders preserve item details
    item.isDeleted = true;
    item.available = false;
    item.isAvailable = false;
    // Remove from active array
    this.state.menuItems = this.state.menuItems.filter(m => m.id !== item.id);
    this.saveState();
    this.notify({ type: 'MENU_ITEM_DELETED', data: { id: item.id } });
    return true;
  }

  toggleMenuAvailability(id, available) {
    const item = this.getMenuItem(id);
    if (!item) return null;
    item.available = !!available;
    item.isAvailable = !!available;
    this.saveState();
    this.notify({ type: 'MENU_AVAILABILITY_CHANGED', data: item });
    return item;
  }

  // ── TABLES ──
  getTables() {
    return this.state.tables.filter(t => t.isActive !== false);
  }

  getTable(tableIdentifier) {
    if (!tableIdentifier) return null;
    const str = String(tableIdentifier).toLowerCase();
    const digits = str.replace(/[^0-9]/g, '');
    const num = digits ? parseInt(digits, 10) : null;

    return this.state.tables.find(t => 
      String(t.id).toLowerCase() === str ||
      (num !== null && t.number === num) ||
      (t.qr_identifier && t.qr_identifier.toLowerCase() === str)
    ) || null;
  }

  createTable(tableData) {
    const num = parseInt(tableData.number, 10);
    const existing = this.state.tables.find(t => t.number === num);
    if (existing) {
      existing.isActive = true;
      existing.status = tableData.status || 'Available';
      existing.capacity = parseInt(tableData.capacity, 10) || existing.capacity;
      existing.zone = tableData.zone || existing.zone;
      this.saveState();
      this.notify({ type: 'TABLE_UPDATED', data: existing });
      return existing;
    }

    const id = tableData.id || `T-${String(num).padStart(2, '0')}`;
    const newTable = {
      id,
      number: num,
      zone: tableData.zone || 'Main Dining',
      capacity: parseInt(tableData.capacity, 10) || 4,
      status: tableData.status || 'Available',
      currentCustomer: null,
      orderId: null,
      billAmount: 0,
      seatedMinutes: 0,
      qr_identifier: `qr_table_${num}`,
      qr_url: `http://localhost:5174/#/table/${num}`,
      isActive: true
    };
    this.state.tables.push(newTable);
    this.saveState();
    this.notify({ type: 'TABLE_CREATED', data: newTable });
    return newTable;
  }

  updateTable(id, updates) {
    const table = this.getTable(id);
    if (!table) return null;

    if (updates.number !== undefined) table.number = parseInt(updates.number, 10);
    if (updates.capacity !== undefined) table.capacity = parseInt(updates.capacity, 10);
    if (updates.zone !== undefined) table.zone = updates.zone;
    if (updates.status !== undefined) table.status = updates.status;
    if (updates.currentCustomer !== undefined) table.currentCustomer = updates.currentCustomer;
    if (updates.orderId !== undefined) table.orderId = updates.orderId;
    if (updates.billAmount !== undefined) table.billAmount = Number(updates.billAmount);
    if (updates.isActive !== undefined) table.isActive = !!updates.isActive;

    this.saveState();
    this.notify({ type: 'TABLE_UPDATED', data: table });
    return table;
  }

  deactivateTable(id) {
    const table = this.getTable(id);
    if (!table) return false;
    table.isActive = false;
    table.status = 'Inactive';
    this.saveState();
    this.notify({ type: 'TABLE_DEACTIVATED', data: { id: table.id, number: table.number } });
    return true;
  }

  // ── BOOKINGS ──
  getBookings(filter = {}) {
    let bookings = [...this.state.bookings];
    if (filter.date) {
      bookings = bookings.filter(b => b.date === filter.date);
    }
    if (filter.status) {
      bookings = bookings.filter(b => b.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.phone) {
      const q = filter.phone.replace(/[^0-9]/g, '');
      bookings = bookings.filter(b => (b.phone || '').replace(/[^0-9]/g, '').includes(q));
    }
    return bookings;
  }

  getBooking(id) {
    if (!id) return null;
    const cleanId = String(id).toUpperCase();
    return this.state.bookings.find(b => b.id.toUpperCase() === cleanId) || null;
  }

  createBooking(bookingData) {
    if (!bookingData.name || !bookingData.name.trim()) throw new Error('Customer name is required');
    if (!bookingData.phone || !bookingData.phone.trim()) throw new Error('Customer phone is required');
    if (!bookingData.date) throw new Error('Booking date is required');
    if (!bookingData.time) throw new Error('Booking time is required');

    // Duplicate check: same phone & same date & same time within 2 minutes
    const isDuplicate = this.state.bookings.some(b => 
      b.phone.replace(/[^0-9]/g, '') === bookingData.phone.replace(/[^0-9]/g, '') &&
      b.date === bookingData.date &&
      b.time === bookingData.time &&
      b.status !== 'Cancelled'
    );
    if (isDuplicate) {
      const existing = this.state.bookings.find(b => 
        b.phone.replace(/[^0-9]/g, '') === bookingData.phone.replace(/[^0-9]/g, '') &&
        b.date === bookingData.date &&
        b.time === bookingData.time
      );
      return existing;
    }

    const id = bookingData.id || `RES-${Math.floor(2420 + Math.random() * 800)}`;
    const guests = parseInt(bookingData.guests || 2, 10);

    // Assign Table
    let tableNumber = bookingData.tableNumber ? parseInt(bookingData.tableNumber, 10) : null;
    let assignedTable = bookingData.table || (tableNumber ? `Table ${tableNumber}` : null);
    let tableId = bookingData.tableId || (tableNumber ? `T-${String(tableNumber).padStart(2, '0')}` : null);

    if (!assignedTable || assignedTable === 'Unassigned') {
      const candidate = this.getTables().find(t => t.status === 'Available' && t.capacity >= guests) || this.getTables()[0];
      if (candidate) {
        assignedTable = `Table ${candidate.number}`;
        tableId = candidate.id;
        tableNumber = candidate.number;
      }
    }

    if (tableNumber) {
      const tbl = this.getTable(tableNumber);
      if (tbl) {
        tbl.status = 'Reserved';
        tbl.currentCustomer = `${bookingData.name.trim()} (${bookingData.time})`;
      }
    }

    const newBooking = {
      id,
      name: bookingData.name.trim(),
      customerName: bookingData.name.trim(),
      phone: bookingData.phone.trim(),
      email: bookingData.email ? bookingData.email.trim() : '',
      date: bookingData.date,
      time: bookingData.time,
      guests,
      table: assignedTable || 'Table 1',
      tableId: tableId || 'T-01',
      tableNumber: tableNumber || 1,
      area: bookingData.area || 'Main Dining',
      status: bookingData.status || 'Confirmed',
      channel: bookingData.channel || 'Web',
      specialRequests: bookingData.specialRequests || bookingData.specialRequest || '',
      createdAt: new Date().toISOString()
    };

    this.state.bookings.unshift(newBooking);

    // Add Notification
    this.createNotification({
      type: 'booking',
      title: 'New Table Reservation',
      message: `${newBooking.name} booked ${newBooking.table} for ${newBooking.guests} guests on ${newBooking.date} at ${newBooking.time}.`,
      page: 'bookings'
    });

    // Record simulated WhatsApp confirmation message in chat logs
    this.recordWhatsAppBookingMessage(newBooking, 'CONFIRMATION');

    this.saveState();
    this.notify({ type: 'BOOKING_CREATED', data: newBooking });
    return newBooking;
  }

  updateBooking(id, updates) {
    const booking = this.getBooking(id);
    if (!booking) return null;

    if (updates.name !== undefined) { booking.name = updates.name; booking.customerName = updates.name; }
    if (updates.phone !== undefined) booking.phone = updates.phone;
    if (updates.email !== undefined) booking.email = updates.email;
    if (updates.date !== undefined) booking.date = updates.date;
    if (updates.time !== undefined) booking.time = updates.time;
    if (updates.guests !== undefined) booking.guests = parseInt(updates.guests, 10);
    if (updates.table !== undefined) booking.table = updates.table;
    if (updates.status !== undefined) booking.status = updates.status;
    if (updates.specialRequests !== undefined) booking.specialRequests = updates.specialRequests;
    booking.updatedAt = new Date().toISOString();

    this.saveState();
    this.notify({ type: 'BOOKING_UPDATED', data: booking });
    return booking;
  }

  cancelBooking(id, reason = 'Cancelled') {
    const booking = this.getBooking(id);
    if (!booking) return null;

    booking.status = 'Cancelled';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date().toISOString();

    // Release table slot
    const tbl = this.getTable(booking.tableId) || this.getTable(booking.tableNumber) || this.getTable(`table_${booking.tableNumber}`);
    if (tbl) {
      tbl.status = 'Available';
      tbl.currentCustomer = null;
    }

    // Add Notification
    this.createNotification({
      type: 'booking',
      title: 'Reservation Cancelled',
      message: `Booking ${booking.id} for ${booking.name} was cancelled.`,
      page: 'bookings'
    });

    // Record simulated WhatsApp cancellation message
    this.recordWhatsAppBookingMessage(booking, 'CANCELLATION');

    this.saveState();
    this.notify({ type: 'BOOKING_CANCELLED', data: booking });
    return booking;
  }

  recordWhatsAppBookingMessage(booking, type) {
    const phone = booking.phone;
    const existingChat = this.state.whatsapp.chatLogs.find(c => c.phone.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, ''));
    const text = type === 'CONFIRMATION'
      ? `Your booking at ${this.state.cafe.name} is confirmed for ${booking.date} at ${booking.time} (${booking.guests} guests). Booking ID: ${booking.id}. ☕`
      : `Your booking ${booking.id} at ${this.state.cafe.name} has been cancelled. We look forward to hosting you another time.`;

    if (existingChat) {
      existingChat.msgs.push({ dir: 'out', text, time: 'Just now' });
    } else {
      this.state.whatsapp.chatLogs.unshift({
        id: `chat_${Date.now()}`,
        phone,
        name: booking.name,
        time: 'Just now',
        intent: 'BOOKING',
        msgs: [{ dir: 'out', text, time: 'Just now' }]
      });
    }
    this.state.whatsapp.stats.sentToday += 1;
  }

  // ── SERVER-SIDE ORDER RECALCULATION & VALIDATION ──
  recalculateOrderItems(rawItems) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const verifiedItems = [];
    let subtotal = 0;

    for (const raw of rawItems) {
      const menuItem = this.getMenuItem(raw.id || raw.item_id || raw.name);
      if (!menuItem) {
        throw new Error(`Menu item '${raw.name || raw.id}' was not found in active menu catalog`);
      }
      if (!menuItem.available || menuItem.isAvailable === false || menuItem.isDeleted) {
        throw new Error(`Item '${menuItem.name}' is currently UNAVAILABLE. Please remove it from your cart.`);
      }

      const qty = Math.max(1, parseInt(raw.qty || raw.quantity || 1, 10));
      // ALWAYS use backend canonical price — NEVER trust client price!
      const unitPrice = menuItem.price;
      const itemTotal = unitPrice * qty;
      subtotal += itemTotal;

      verifiedItems.push({
        id: menuItem.id,
        name: menuItem.name,
        qty,
        price: unitPrice,
        total: itemTotal,
        notes: raw.notes || ''
      });
    }

    const gstPercentage = this.state.cafe.gstPercentage || 5;
    const serviceChargePercentage = this.state.cafe.serviceChargePercentage || 5;

    const tax = Math.round((subtotal * (gstPercentage / 100)) * 100) / 100;
    const serviceCharge = Math.round((subtotal * (serviceChargePercentage / 100)) * 100) / 100;
    const total = Math.round((subtotal + tax + serviceCharge) * 100) / 100;

    return { verifiedItems, subtotal, tax, serviceCharge, total };
  }

  // ── ORDERS ──
  getOrders(filter = {}) {
    let orders = [...this.state.orders];
    if (filter.status) {
      orders = orders.filter(o => o.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.table) {
      orders = orders.filter(o => String(o.table).toLowerCase().includes(String(filter.table).toLowerCase()));
    }
    return orders;
  }

  getOrder(id) {
    if (!id) return null;
    const cleanId = String(id).toUpperCase();
    return this.state.orders.find(o => o.id.toUpperCase() === cleanId) || null;
  }

  createOrder(orderPayload) {
    const tableId = orderPayload.tableId || orderPayload.table_id;
    const tableNum = orderPayload.tableNumber || orderPayload.table;
    const matchedTable = this.getTable(tableId || tableNum);

    if (matchedTable) {
      if (matchedTable.isActive === false || matchedTable.status === 'Inactive') {
        throw new Error(`Table ${matchedTable.number} is inactive and cannot accept orders`);
      }
    }

    // 1. Server-side price recalculation & availability revalidation
    const { verifiedItems, subtotal, tax, serviceCharge, total } = this.recalculateOrderItems(orderPayload.items);

    // 2. Validate Payment
    const paymentStatus = (orderPayload.paymentStatus || 'Paid').toUpperCase();
    const isPaymentSuccessful = paymentStatus === 'PAID' || paymentStatus === 'SUCCESS';

    const orderId = orderPayload.id || `ORD-${Math.floor(5530 + Math.random() * 800)}`;
    const orderNumber = parseInt(orderPayload.orderNumber || orderId.replace(/[^0-9]/g, ''), 10) || 5530;
    const assignedTableStr = matchedTable ? `Table ${matchedTable.number}` : (orderPayload.table || 'Counter');

    const customerName = orderPayload.customerName || orderPayload.customer || orderPayload.customer_name || 'Dine-in Guest';
    const customerPhone = orderPayload.phone || orderPayload.customer_phone || '';
    const sessionId = orderPayload.sessionId || (matchedTable ? `sess_table_${matchedTable.number}` : 'sess_counter');

    const newOrder = {
      id: orderId,
      orderNumber,
      customer: customerName,
      customerName: customerName,
      phone: customerPhone,
      type: orderPayload.type || 'Dine-in',
      table: assignedTableStr,
      tableId: matchedTable ? matchedTable.id : null,
      tableNumber: matchedTable ? matchedTable.number : null,
      sessionId,
      items: verifiedItems,
      subtotal,
      tax,
      serviceCharge,
      discount: orderPayload.discount || 0,
      total: Math.max(0, total - (orderPayload.discount || 0)),
      status: isPaymentSuccessful ? 'Confirmed' : 'Payment Failed',
      paymentStatus: isPaymentSuccessful ? 'Paid' : 'Failed',
      paymentMethod: orderPayload.paymentMethod || 'UPI',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: getTodayDateString(),
      notes: orderPayload.notes || '',
      createdAt: new Date().toISOString()
    };

    // If payment failed, do NOT dispatch to kitchen!
    if (!isPaymentSuccessful) {
      newOrder.status = 'Payment Failed';
      // Record payment attempt
      this.state.payments.unshift({
        id: `PAY-${Date.now()}`,
        orderId,
        amount: newOrder.total,
        method: newOrder.paymentMethod,
        status: 'FAILED',
        timestamp: new Date().toISOString()
      });
      return newOrder;
    }

    // Success flow
    this.state.orders.unshift(newOrder);

    // Record payment
    this.state.payments.unshift({
      id: `PAY-${Date.now()}`,
      orderId,
      amount: newOrder.total,
      method: newOrder.paymentMethod,
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    });

    // Update table status and active table session
    if (matchedTable) {
      matchedTable.status = 'Occupied';
      matchedTable.currentCustomer = customerName;
      matchedTable.orderId = orderId;
      matchedTable.billAmount = (matchedTable.billAmount || 0) + newOrder.total;

      // Table Session aggregation (Multiple customers at same table)
      this.addOrderToTableSession(matchedTable, newOrder);
    }

    // Add notification for Kitchen & Admin
    this.createNotification({
      type: 'order',
      title: 'New Dine-In Order Received',
      message: `${assignedTableStr} placed order ${orderId} for ₹${newOrder.total}.`,
      page: 'orders'
    });

    this.saveState();
    this.notify({ type: 'ORDER_CREATED', data: newOrder });
    return newOrder;
  }

  addOrderToTableSession(table, order) {
    const key = `table_${table.number}`;
    if (!this.state.tableSessions[key]) {
      this.state.tableSessions[key] = {
        sessionId: `sess_t${table.number}_${Date.now()}`,
        tableId: table.id,
        tableNumber: table.number,
        status: 'Active',
        customers: [],
        orderIds: [],
        totalAmount: 0,
        activeSince: new Date().toISOString()
      };
    }
    const session = this.state.tableSessions[key];
    session.orderIds.push(order.id);
    session.totalAmount += order.total;

    // Track customer independently without merging identities
    const existingCust = session.customers.find(c => c.name === order.customer && c.phone === order.phone);
    if (!existingCust) {
      session.customers.push({
        customerId: `cust_${session.customers.length + 1}`,
        name: order.customer,
        phone: order.phone,
        orderIds: [order.id]
      });
    } else {
      existingCust.orderIds.push(order.id);
    }
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrder(orderId);
    if (!order) return null;

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    // If completed or cancelled, handle table status
    if (newStatus === 'Completed' && order.tableNumber) {
      const tbl = this.getTable(order.tableNumber);
      if (tbl && tbl.orderId === order.id) {
        tbl.status = 'Cleaning';
      }
    }

    this.saveState();
    this.notify({ type: 'ORDER_STATUS_CHANGED', data: { id: order.id, status: newStatus } });
    return order;
  }

  // ── TABLE SESSIONS ──
  getTableSession(tableId) {
    const tbl = this.getTable(tableId);
    if (!tbl) return null;
    const key = `table_${tbl.number}`;
    const sess = this.state.tableSessions[key];
    if (!sess) return null;
    const orders = (sess.orderIds || []).map(id => this.getOrder(id)).filter(Boolean);
    return {
      ...sess,
      orders,
      totalBill: sess.totalAmount || orders.reduce((sum, o) => sum + (o.total || 0), 0)
    };
  }

  // ── WAITER & BILL REQUESTS ──
  getTableRequests(tableId = null) {
    let reqs = [...this.state.tableRequests];
    if (tableId) {
      const tbl = this.getTable(tableId);
      const num = tbl ? tbl.number : parseInt(tableId, 10);
      reqs = reqs.filter(r => r.tableNumber === num || r.tableId === tableId);
    }
    return reqs;
  }

  createTableRequest(data) {
    const tbl = this.getTable(data.tableId || data.tableNumber);
    const num = tbl ? tbl.number : (data.tableNumber || 7);
    const req = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      tableId: tbl ? tbl.id : `table_${num}`,
      tableNumber: num,
      requestType: data.requestType || 'waiter',
      notes: data.notes || `Customer at Table ${num} called waiter`,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
      acknowledgedAt: null,
      completedAt: null
    };
    this.state.tableRequests.unshift(req);

    this.createNotification({
      type: 'waiter',
      title: 'Waiter Summoned',
      message: `Table ${num} has called for service.`,
      page: 'tables'
    });

    this.saveState();
    this.notify({ type: 'TABLE_REQUEST_CREATED', data: req });
    return req;
  }

  updateTableRequestStatus(id, newStatus) {
    const req = this.state.tableRequests.find(r => r.id === id);
    if (!req) return null;

    req.status = newStatus;
    if (newStatus === 'Acknowledged' && !req.acknowledgedAt) req.acknowledgedAt = new Date().toISOString();
    if (newStatus === 'Completed' && !req.completedAt) req.completedAt = new Date().toISOString();

    this.saveState();
    this.notify({ type: 'TABLE_REQUEST_UPDATED', data: req });
    return req;
  }

  getBillRequests(tableId = null) {
    let reqs = [...this.state.billRequests];
    if (tableId) {
      const tbl = this.getTable(tableId);
      const num = tbl ? tbl.number : parseInt(tableId, 10);
      reqs = reqs.filter(r => r.tableNumber === num || r.tableId === tableId);
    }
    return reqs;
  }

  createBillRequest(data) {
    const tbl = this.getTable(data.tableId || data.tableNumber);
    const num = tbl ? tbl.number : (data.tableNumber || 7);
    const req = {
      id: `BILL-${Date.now().toString().slice(-4)}`,
      tableId: tbl ? tbl.id : `table_${num}`,
      tableNumber: num,
      customerName: data.customerName || (tbl ? tbl.currentCustomer : 'Guest'),
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };
    this.state.billRequests.unshift(req);

    this.createNotification({
      type: 'order',
      title: 'Bill Requested',
      message: `Table ${num} has requested the bill.`,
      page: 'tables'
    });

    this.saveState();
    this.notify({ type: 'BILL_REQUEST_CREATED', data: req });
    return req;
  }

  updateBillRequestStatus(id, newStatus) {
    const req = this.state.billRequests.find(r => r.id === id);
    if (!req) return null;
    req.status = newStatus;
    this.saveState();
    this.notify({ type: 'BILL_REQUEST_UPDATED', data: req });
    return req;
  }

  // ── OFFERS ──
  getOffers(onlyActive = true) {
    const now = new Date();
    return this.state.offers.filter(o => {
      if (!onlyActive) return true;
      const validUntil = new Date(o.validUntil || o.endDate);
      return o.status === 'Active' && o.isActive !== false && validUntil >= now;
    });
  }

  getOfferByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return this.state.offers.find(o => o.code.toUpperCase() === cleanCode) || null;
  }

  createOffer(offerData) {
    const newOffer = {
      id: offerData.id || `OFF-${Date.now().toString().slice(-4)}`,
      code: offerData.code.trim().toUpperCase(),
      title: offerData.title.trim(),
      discountType: offerData.discountType || 'percentage',
      discountValue: Number(offerData.discountValue),
      minOrder: Number(offerData.minOrder || 0),
      maxDiscount: Number(offerData.maxDiscount || offerData.discountValue),
      startDate: offerData.startDate || getTodayDateString(),
      endDate: offerData.endDate || getOffsetDateString(30),
      validUntil: offerData.endDate || getOffsetDateString(30),
      usedCount: 0,
      usageLimit: Number(offerData.usageLimit || 500),
      status: offerData.status || 'Active',
      isActive: offerData.isActive !== undefined ? !!offerData.isActive : (offerData.status !== 'Inactive' && offerData.status !== 'Expired')
    };
    this.state.offers.unshift(newOffer);
    this.saveState();
    this.notify({ type: 'OFFER_CREATED', data: newOffer });
    return newOffer;
  }

  toggleOfferStatus(id) {
    const offer = this.state.offers.find(o => o.id === id);
    if (!offer) return null;
    const nextStatus = offer.status === 'Active' ? 'Expired' : 'Active';
    offer.status = nextStatus;
    offer.isActive = nextStatus === 'Active';
    this.saveState();
    this.notify({ type: 'OFFER_STATUS_CHANGED', data: offer });
    return offer;
  }

  // ── REVIEWS ──
  getReviews() {
    return [...this.state.reviews];
  }

  createReview(reviewData) {
    const newReview = {
      id: reviewData.id || `REV-${Date.now().toString().slice(-4)}`,
      customer: reviewData.author || reviewData.customer || 'Guest',
      author: reviewData.author || reviewData.customer || 'Guest',
      rating: Number(reviewData.rating || 5),
      date: 'Just now',
      source: reviewData.source || 'Website',
      text: reviewData.review || reviewData.text || '',
      review: reviewData.review || reviewData.text || '',
      status: 'Pending',
      reply: null,
      repliedAt: null
    };
    this.state.reviews.unshift(newReview);
    this.createNotification({
      type: 'customer',
      title: 'New Customer Review',
      message: `${newReview.customer} gave a ${newReview.rating}-star review.`,
      page: 'reviews'
    });
    this.saveState();
    this.notify({ type: 'REVIEW_CREATED', data: newReview });
    return newReview;
  }

  replyReview(id, replyText) {
    const rev = this.state.reviews.find(r => r.id === id);
    if (!rev) return null;
    rev.status = 'Handled';
    rev.reply = replyText;
    rev.repliedAt = 'Just now';
    this.saveState();
    this.notify({ type: 'REVIEW_REPLIED', data: rev });
    return rev;
  }

  // ── NOTIFICATIONS ──
  getNotifications() {
    return [...this.state.notifications];
  }

  createNotification(notifData) {
    const notif = {
      id: notifData.id || `NTF-${Date.now().toString().slice(-4)}`,
      type: notifData.type || 'system',
      title: notifData.title,
      message: notifData.message,
      time: 'Just now',
      read: false,
      page: notifData.page || 'dashboard'
    };
    this.state.notifications.unshift(notif);
    this.saveState();
    this.notify({ type: 'NOTIFICATION_CREATED', data: notif });
    return notif;
  }

  markNotificationRead(id) {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveState();
    }
    return notif;
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => { n.read = true; });
    this.saveState();
    return true;
  }

  // ── STAFF ──
  getStaff() {
    return [...this.state.staff];
  }

  createStaff(staffData) {
    const newStaff = {
      id: staffData.id || `stf-${Date.now().toString().slice(-4)}`,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      role: staffData.role || 'Staff',
      status: staffData.status || 'Active',
      shift: staffData.shift || 'Morning (08:00 - 16:30)'
    };
    this.state.staff.push(newStaff);
    this.saveState();
    return newStaff;
  }

  // ── QR CODES ──
  getQRCodes() {
    return [...this.state.qrCodes];
  }

  getWhatsAppMessages() {
    const list = [];
    for (const chat of (this.state.whatsapp.chatLogs || [])) {
      for (const m of (chat.msgs || [])) {
        list.push({
          id: chat.id,
          recipient: chat.phone,
          phone: chat.phone,
          name: chat.name,
          customerName: chat.name,
          message: m.text,
          text: m.text,
          dir: m.dir,
          time: m.time
        });
      }
    }
    return list;
  }

  getAiCalls() {
    return this.state.aiCalls;
  }
}

export const centralStore = new CentralStore();

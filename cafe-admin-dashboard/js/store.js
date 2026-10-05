/* ══════════════════════════════════════════════════════════════
   BREW & CO — CENTRALIZED REACTIVE DATA STORE (STATE LAYER)
   LocalStorage persistent storage with clean service APIs
   ══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'BREW_CAFE_ADMIN_STATE_V2';

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

const INITIAL_STATE = {
  users: [
    {
      id: 'usr-1',
      name: 'Aditya Singhal',
      email: 'owner@brewandco.com',
      role: 'Owner',
      avatarInitials: 'AS',
      phone: '+91 98765 11001'
    },
    {
      id: 'usr-2',
      name: 'Rajesh Kumar',
      email: 'manager@brewandco.com',
      role: 'Manager',
      avatarInitials: 'RK',
      phone: '+91 98123 22002'
    },
    {
      id: 'usr-3',
      name: 'Pooja Verma',
      email: 'staff@brewandco.com',
      role: 'Staff',
      avatarInitials: 'PV',
      phone: '+91 97654 33003'
    }
  ],

  // Granular Role-Based Permissions managed by Owner
  rolePermissions: {
    Owner: {
      dashboard: true,
      orders: true,
      bookings: true,
      tables: true,
      menu: true,
      customers: true,
      staff: true,
      analytics: true,
      offers: true,
      reviews: true,
      whatsapp: true,
      'ai-calling': true,
      'qr-system': true,
      notifications: true,
      settings: true
    },
    Manager: {
      dashboard: true,
      orders: true,
      bookings: true,
      tables: true,
      menu: true,
      customers: true,
      staff: false,
      analytics: false,
      offers: true,
      reviews: true,
      whatsapp: true,
      'ai-calling': true,
      'qr-system': true,
      notifications: true,
      settings: false
    },
    Staff: {
      dashboard: true,
      orders: true,
      bookings: true,
      tables: true,
      menu: true,
      customers: false,
      staff: false,
      analytics: false,
      offers: false,
      reviews: false,
      whatsapp: false,
      'ai-calling': false,
      'qr-system': false,
      notifications: true,
      settings: false
    }
  },

  staff: [
    {
      id: 'stf-1',
      name: 'Aditya Singhal',
      email: 'owner@brewandco.com',
      phone: '+91 98765 11001',
      role: 'Owner',
      status: 'Active',
      shift: 'All Day',
      lastActive: 'Just now'
    },
    {
      id: 'stf-2',
      name: 'Rajesh Kumar',
      email: 'manager@brewandco.com',
      phone: '+91 98123 22002',
      role: 'Manager',
      status: 'Active',
      shift: 'Morning (08:00 - 16:30)',
      lastActive: '5 mins ago'
    },
    {
      id: 'stf-3',
      name: 'Pooja Verma',
      email: 'staff@brewandco.com',
      phone: '+91 97654 33003',
      role: 'Staff',
      status: 'Active',
      shift: 'Evening (15:30 - 23:30)',
      lastActive: '12 mins ago'
    },
    {
      id: 'stf-4',
      name: 'Vikram Joshi',
      email: 'vikram.barista@brewandco.com',
      phone: '+91 95432 44004',
      role: 'Staff',
      status: 'Active',
      shift: 'Morning (08:00 - 16:30)',
      lastActive: '1 hour ago'
    }
  ],

  tables: [
    { id: 'T-01', number: '1', zone: 'Main Dining', capacity: 2, status: 'Occupied', currentCustomer: 'Priya Sharma', orderId: 'ORD-5521', billAmount: 580, seatedMinutes: 45 },
    { id: 'T-02', number: '2', zone: 'Main Dining', capacity: 4, status: 'Occupied', currentCustomer: 'Arjun Mehta', orderId: 'ORD-5520', billAmount: 510, seatedMinutes: 28 },
    { id: 'T-03', number: '3', zone: 'Main Dining', capacity: 4, status: 'Reserved', currentCustomer: 'Rahul Verma (7:00 PM)', orderId: null, billAmount: 0, seatedMinutes: 0 },
    { id: 'T-04', number: '4', zone: 'Main Dining', capacity: 6, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0 },
    { id: 'T-05', number: '5', zone: 'Patio & Garden', capacity: 2, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0 },
    { id: 'T-06', number: '6', zone: 'Patio & Garden', capacity: 4, status: 'Cleaning', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 10 },
    { id: 'T-07', number: '7', zone: 'Patio & Garden', capacity: 4, status: 'Occupied', currentCustomer: 'Pooja Agarwal', orderId: 'ORD-5514', billAmount: 890, seatedMinutes: 52 },
    { id: 'T-08', number: '8', zone: 'Lounge Area', capacity: 6, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0 },
    { id: 'T-09', number: '9', zone: 'Lounge Area', capacity: 8, status: 'Reserved', currentCustomer: 'Sonal Gupta (7:30 PM)', orderId: null, billAmount: 0, seatedMinutes: 0 },
    { id: 'T-10', number: '10', zone: 'Bar Counter', capacity: 2, status: 'Occupied', currentCustomer: 'Tanya Malhotra', orderId: 'ORD-5512', billAmount: 480, seatedMinutes: 14 },
    { id: 'T-11', number: '11', zone: 'Bar Counter', capacity: 2, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0 },
    { id: 'T-12', number: '12', zone: 'Bar Counter', capacity: 2, status: 'Available', currentCustomer: null, orderId: null, billAmount: 0, seatedMinutes: 0 }
  ],

  orders: [
    {
      id: 'ORD-5521',
      customer: 'Priya Sharma',
      phone: '9876543210',
      type: 'Dine-in',
      table: 'Table 1',
      items: [
        { name: 'Cappuccino', qty: 2, price: 180, total: 360 },
        { name: 'Paneer Sandwich', qty: 1, price: 220, total: 220 }
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
      customer: 'Arjun Mehta',
      phone: '9812345678',
      type: 'Dine-in',
      table: 'Table 2',
      items: [
        { name: 'Cold Coffee', qty: 1, price: 160, total: 160 },
        { name: 'Margherita Pizza', qty: 1, price: 350, total: 350 }
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
      id: 'ORD-5519',
      customer: 'Rohan Das',
      phone: '9765432109',
      type: 'Takeaway',
      table: 'Counter',
      items: [
        { name: 'Masala Chai', qty: 3, price: 60, total: 180 },
        { name: 'Blueberry Muffin', qty: 2, price: 130, total: 260 }
      ],
      subtotal: 440,
      tax: 22,
      serviceCharge: 0,
      discount: 40,
      total: 422,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      time: '11:30 AM',
      date: getTodayDateString(),
      notes: 'Pack chai securely'
    },
    {
      id: 'ORD-5518',
      customer: 'Anjali Kapoor',
      phone: '9654321098',
      type: 'Dine-in',
      table: 'Table 5',
      items: [
        { name: 'Espresso', qty: 1, price: 120, total: 120 },
        { name: 'Chocolate Cake', qty: 1, price: 240, total: 240 }
      ],
      subtotal: 360,
      tax: 18,
      serviceCharge: 18,
      discount: 0,
      total: 396,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      time: '10:55 AM',
      date: getTodayDateString(),
      notes: 'VIP customer'
    },
    {
      id: 'ORD-5517',
      customer: 'Vikram Iyer',
      phone: '9543210987',
      type: 'Dine-in',
      table: 'Table 8',
      items: [
        { name: 'Latte', qty: 1, price: 190, total: 190 },
        { name: 'Blueberry Muffin', qty: 2, price: 130, total: 260 }
      ],
      subtotal: 450,
      tax: 22.5,
      serviceCharge: 22.5,
      discount: 0,
      total: 495,
      status: 'Preparing',
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      time: '10:15 AM',
      date: getTodayDateString(),
      notes: 'Oat milk for latte'
    },
    {
      id: 'ORD-5516',
      customer: 'Sneha Jain',
      phone: '9432109876',
      type: 'Takeaway',
      table: 'Counter',
      items: [
        { name: 'Green Tea', qty: 1, price: 80, total: 80 },
        { name: 'Veg Wrap', qty: 2, price: 195, total: 390 }
      ],
      subtotal: 470,
      tax: 23.5,
      serviceCharge: 0,
      discount: 0,
      total: 493.5,
      status: 'Confirmed',
      paymentStatus: 'Pending',
      paymentMethod: 'UPI',
      time: '02:05 PM',
      date: getTodayDateString(),
      notes: 'No mayonnaise'
    },
    {
      id: 'ORD-5515',
      customer: 'Manish Tiwari',
      phone: '9321098765',
      type: 'Delivery',
      table: 'Zomato/Direct',
      items: [
        { name: 'Cold Brew', qty: 1, price: 200, total: 200 },
        { name: 'Chocolate Cake', qty: 1, price: 240, total: 240 }
      ],
      subtotal: 440,
      tax: 22,
      serviceCharge: 30,
      discount: 0,
      total: 492,
      status: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: 'UPI',
      time: '02:20 PM',
      date: getTodayDateString(),
      notes: 'Deliver to Indiranagar 4th cross'
    },
    {
      id: 'ORD-5514',
      customer: 'Pooja Agarwal',
      phone: '9098765432',
      type: 'Dine-in',
      table: 'Table 7',
      items: [
        { name: 'Cold Coffee', qty: 2, price: 160, total: 320 },
        { name: 'Margherita Pizza', qty: 1, price: 350, total: 350 },
        { name: 'Cheesecake', qty: 1, price: 260, total: 260 }
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
    },
    {
      id: 'ORD-5513',
      customer: 'Krishn Reddy',
      phone: '9210987654',
      type: 'Takeaway',
      table: 'Counter',
      items: [
        { name: 'Espresso', qty: 2, price: 120, total: 240 },
        { name: 'Veg Wrap', qty: 1, price: 195, total: 195 }
      ],
      subtotal: 435,
      tax: 21.75,
      serviceCharge: 0,
      discount: 0,
      total: 456.75,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      time: '09:30 AM',
      date: getTodayDateString(),
      notes: 'Ready for pickup'
    },
    {
      id: 'ORD-5512',
      customer: 'Tanya Malhotra',
      phone: '9109876543',
      type: 'Dine-in',
      table: 'Table 10',
      items: [
        { name: 'Cappuccino', qty: 1, price: 180, total: 180 },
        { name: 'Cheesecake', qty: 1, price: 260, total: 260 }
      ],
      subtotal: 440,
      tax: 22,
      serviceCharge: 22,
      discount: 0,
      total: 484,
      status: 'Preparing',
      paymentStatus: 'Pending',
      paymentMethod: 'UPI',
      time: '03:00 PM',
      date: getTodayDateString(),
      notes: 'Corner seat'
    }
  ],

  // Dynamically populated with today's real date, upcoming dates, and past dates
  bookings: [
    { id: 'RES-2410', name: 'Priya Sharma', phone: '9876543210', email: 'priya@gmail.com', date: getTodayDateString(), time: '12:30 PM', guests: 4, table: 'Table 1', status: 'Seated', channel: 'WhatsApp', specialRequests: 'Corner table with natural light' },
    { id: 'RES-2409', name: 'Arjun Mehta', phone: '9812345678', email: 'arjun.m@outlook.com', date: getTodayDateString(), time: '01:00 PM', guests: 2, table: 'Table 2', status: 'Seated', channel: 'WhatsApp', specialRequests: 'Anniversary celebration' },
    { id: 'RES-2408', name: 'Sonal Gupta', phone: '9098765432', email: 'sonal.g@yahoo.com', date: getTodayDateString(), time: '07:30 PM', guests: 6, table: 'Table 9', status: 'Confirmed', channel: 'Phone', specialRequests: 'High chair needed for child' },
    { id: 'RES-2407', name: 'Rahul Verma', phone: '9765432109', email: 'rahul.v@gmail.com', date: getTodayDateString(), time: '08:00 PM', guests: 2, table: 'Table 3', status: 'Confirmed', channel: 'WhatsApp', specialRequests: 'Quiet spot for discussion' },
    { id: 'RES-2406', name: 'Deepika Nair', phone: '9654321098', email: 'deepika.n@gmail.com', date: getOffsetDateString(-1), time: '12:00 PM', guests: 3, table: 'Table 4', status: 'Completed', channel: 'WhatsApp', specialRequests: 'Outdoor patio preferred' },
    { id: 'RES-2405', name: 'Vivek Joshi', phone: '9543210987', email: 'v.joshi@techcorp.in', date: getOffsetDateString(-1), time: '02:30 PM', guests: 4, table: 'Table 7', status: 'Cancelled', channel: 'WhatsApp', specialRequests: 'Cancelled due to travel delay' },
    { id: 'RES-2404', name: 'Neha Patel', phone: '9432109876', email: 'neha.p@gmail.com', date: getOffsetDateString(1), time: '01:30 PM', guests: 2, table: 'Unassigned', status: 'Confirmed', channel: 'Web', specialRequests: 'Birthday dessert candle request' },
    { id: 'RES-2403', name: 'Amit Singh', phone: '9321098765', email: 'amit.s@gmail.com', date: getOffsetDateString(1), time: '07:00 PM', guests: 5, table: 'Unassigned', status: 'Pending', channel: 'Phone', specialRequests: 'Prefers indoor AC section' },
    { id: 'RES-2402', name: 'Kavya Rao', phone: '9210987654', email: 'kavya.rao@design.studio', date: getOffsetDateString(2), time: '12:30 PM', guests: 2, table: 'Unassigned', status: 'Confirmed', channel: 'WhatsApp', specialRequests: 'Window seat if available' },
    { id: 'RES-2401', name: 'Suresh Kumar', phone: '9109876543', email: 'suresh.k@gmail.com', date: getOffsetDateString(-2), time: '06:30 PM', guests: 8, table: 'Table 9', status: 'Cancelled', channel: 'WhatsApp', specialRequests: 'Changed plans' }
  ],

  menuItems: [
    { id: 'MNU-01', name: 'Cappuccino', category: 'Coffee', price: 180, cost: 45, isVeg: true, prepTime: '6 mins', isPopular: true, available: true, description: 'Velvety espresso with steamed milk foam and organic cocoa dust.' },
    { id: 'MNU-02', name: 'Cold Coffee', category: 'Coffee', price: 160, cost: 40, isVeg: true, prepTime: '5 mins', isPopular: true, available: true, description: 'Creamy blended iced brew with vanilla bean gelato scoop.' },
    { id: 'MNU-03', name: 'Espresso Single / Double', category: 'Coffee', price: 120, cost: 25, isVeg: true, prepTime: '3 mins', isPopular: false, available: true, description: 'Single origin Arabica bean extract with thick golden crema.' },
    { id: 'MNU-04', name: 'Cold Brew Reserve', category: 'Coffee', price: 200, cost: 50, isVeg: true, prepTime: '2 mins', isPopular: true, available: true, description: 'Steeped for 18 hours in cold filtered spring water. Smooth and low acidity.' },
    { id: 'MNU-05', name: 'Spanish Latte', category: 'Coffee', price: 190, cost: 55, isVeg: true, prepTime: '7 mins', isPopular: true, available: true, description: 'Espresso balanced with condensed milk and steamed whole milk.' },
    { id: 'MNU-06', name: 'Paneer Tikka Sandwich', category: 'Starters', price: 220, cost: 75, isVeg: true, prepTime: '12 mins', isPopular: true, available: true, description: 'Char-grilled cottage cheese in sourdough bread with mint chutney.' },
    { id: 'MNU-07', name: 'Artisan Margherita Pizza', category: 'Main Course', price: 350, cost: 110, isVeg: true, prepTime: '15 mins', isPopular: true, available: true, description: 'Hand-stretched sourdough crust, San Marzano tomatoes, fresh mozzarella.' },
    { id: 'MNU-08', name: 'Grilled Herb Sandwich', category: 'Starters', price: 210, cost: 70, isVeg: true, prepTime: '10 mins', isPopular: false, available: false, description: 'Zucchini, bell peppers, melted cheddar and herb butter on multigrain.' },
    { id: 'MNU-09', name: 'Falafel Veggie Wrap', category: 'Main Course', price: 195, cost: 60, isVeg: true, prepTime: '10 mins', isPopular: true, available: true, description: 'Crispy herb falafels, pickled cucumbers, hummus and tahini garlic dressing.' },
    { id: 'MNU-10', name: 'Belgian Chocolate Cake', category: 'Desserts', price: 240, cost: 80, isVeg: true, prepTime: '2 mins', isPopular: true, available: true, description: 'Rich 70% dark chocolate mousse layers with sea salt ganache.' },
    { id: 'MNU-11', name: 'New York Cheesecake', category: 'Desserts', price: 260, cost: 90, isVeg: true, prepTime: '2 mins', isPopular: true, available: true, description: 'Classic baked cream cheese slice over crunchy graham cracker base.' },
    { id: 'MNU-12', name: 'Blueberry Crumble Muffin', category: 'Desserts', price: 130, cost: 38, isVeg: true, prepTime: '2 mins', isPopular: false, available: true, description: 'Fresh wild blueberries baked into fluffy buttermilk muffin crown.' },
    { id: 'MNU-13', name: 'Kolkata Masala Chai', category: 'Beverages', price: 60, cost: 15, isVeg: true, prepTime: '5 mins', isPopular: true, available: true, description: 'Slow-simmered Assam CTC tea leaves with fresh ginger, cardamom & clove.' },
    { id: 'MNU-14', name: 'Organic Jasmine Green Tea', category: 'Beverages', price: 80, cost: 20, isVeg: true, prepTime: '4 mins', isPopular: false, available: true, description: 'Delicate whole-leaf green tea scented with pure night-blooming jasmine flowers.' },
    { id: 'MNU-15', name: 'Fresh Mint Lime Soda', category: 'Beverages', price: 90, cost: 18, isVeg: true, prepTime: '4 mins', isPopular: false, available: true, description: 'Fresh squeezed Persian limes with crushed garden mint and sparkling soda.' }
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
      notes: 'Always prefers lactose-free milk or oat milk. Corner table regular.',
      ordersHistory: [
        { id: 'ORD-5521', date: getTodayDateString(), amount: 580, items: 'Cappuccino x2, Paneer Sandwich' },
        { id: 'ORD-5480', date: getOffsetDateString(-7), amount: 620, items: 'Cold Coffee, Pizza' }
      ],
      bookingsHistory: [
        { id: 'RES-2410', date: getTodayDateString(), guests: 4, status: 'Seated' },
        { id: 'RES-2380', date: getOffsetDateString(-14), guests: 2, status: 'Completed' }
      ]
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
      notes: 'Loves iced cold brews and Margherita pizza.',
      ordersHistory: [
        { id: 'ORD-5520', date: getTodayDateString(), amount: 510, items: 'Cold Coffee, Margherita Pizza' }
      ],
      bookingsHistory: [
        { id: 'RES-2409', date: getTodayDateString(), guests: 2, status: 'Seated' }
      ]
    },
    {
      id: 'CUST-103',
      name: 'Anjali Kapoor',
      phone: '9654321098',
      email: 'anjali.k@fashion.in',
      orders: 42,
      spend: 22400,
      lastVisit: 'Today',
      status: 'VIP',
      notes: 'VIP guest. Cafe regular since 2024. Prefers quick table seating without waiting.',
      ordersHistory: [
        { id: 'ORD-5518', date: getTodayDateString(), amount: 360, items: 'Espresso, Chocolate Cake' },
        { id: 'ORD-5490', date: getOffsetDateString(-3), amount: 980, items: '3 Coffees, 2 Pizzas' }
      ],
      bookingsHistory: [
        { id: 'RES-2390', date: getOffsetDateString(-3), guests: 3, status: 'Completed' }
      ]
    },
    {
      id: 'CUST-104',
      name: 'Rohan Das',
      phone: '9765432109',
      email: 'rohan.d@gmail.com',
      orders: 6,
      spend: 2100,
      lastVisit: 'Today',
      status: 'New',
      notes: 'Office coworker group takeaway orders.',
      ordersHistory: [
        { id: 'ORD-5519', date: getTodayDateString(), amount: 440, items: 'Masala Chai x3, Muffins' }
      ],
      bookingsHistory: []
    },
    {
      id: 'CUST-105',
      name: 'Vikram Iyer',
      phone: '9543210987',
      email: 'vikram.iyer@gmail.com',
      orders: 19,
      spend: 9800,
      lastVisit: 'Today',
      status: 'Regular',
      notes: 'Remote worker, frequently uses Wi-Fi and sits in the quiet patio.',
      ordersHistory: [
        { id: 'ORD-5517', date: getTodayDateString(), amount: 450, items: 'Latte, Blueberry Muffin x2' }
      ],
      bookingsHistory: []
    },
    {
      id: 'CUST-106',
      name: 'Sneha Jain',
      phone: '9432109876',
      email: 'sneha.j@tech.com',
      orders: 3,
      spend: 890,
      lastVisit: getOffsetDateString(-16),
      status: 'New',
      notes: 'Vegetarian health conscious, orders green tea and wraps.',
      ordersHistory: [],
      bookingsHistory: []
    },
    {
      id: 'CUST-107',
      name: 'Manish Tiwari',
      phone: '9321098765',
      email: 'm.tiwari@gmail.com',
      orders: 2,
      spend: 640,
      lastVisit: getOffsetDateString(-37),
      status: 'At Risk',
      notes: 'No visit in 37 days. Eligible for re-engagement promotional code.',
      ordersHistory: [],
      bookingsHistory: []
    },
    {
      id: 'CUST-108',
      name: 'Suresh Kumar',
      phone: '9109876543',
      email: 'suresh.k@gmail.com',
      orders: 34,
      spend: 18900,
      lastVisit: getOffsetDateString(-52),
      status: 'At Risk',
      notes: 'Former frequent visitor, inactive for 52 days.',
      ordersHistory: [],
      bookingsHistory: [
        { id: 'RES-2401', date: getOffsetDateString(-2), guests: 8, status: 'Cancelled' }
      ]
    },
    {
      id: 'CUST-109',
      name: 'Pooja Agarwal',
      phone: '9098765432',
      email: 'pooja.a@gmail.com',
      orders: 8,
      spend: 4200,
      lastVisit: 'Today',
      status: 'Regular',
      notes: 'Weekend brunch enthusiast.',
      ordersHistory: [],
      bookingsHistory: []
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
      usedCount: 142,
      usageLimit: 500,
      status: 'Active'
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
      usedCount: 88,
      usageLimit: 200,
      status: 'Active'
    },
    {
      id: 'OFF-03',
      code: 'FESTIVE50',
      title: 'Diwali Early Bird',
      discountType: 'percentage',
      discountValue: 25,
      minOrder: 800,
      maxDiscount: 250,
      startDate: getOffsetDateString(20),
      endDate: getOffsetDateString(50),
      usedCount: 0,
      usageLimit: 1000,
      status: 'Scheduled'
    },
    {
      id: 'OFF-04',
      code: 'MONSOON15',
      title: 'Monsoon Chai & Snack',
      discountType: 'percentage',
      discountValue: 15,
      minOrder: 250,
      maxDiscount: 60,
      startDate: getOffsetDateString(-60),
      endDate: getOffsetDateString(-15),
      usedCount: 312,
      usageLimit: 300,
      status: 'Expired'
    }
  ],

  reviews: [
    {
      id: 'REV-01',
      customer: 'Anjali Kapoor',
      rating: 5,
      date: 'Yesterday',
      source: 'Google',
      text: 'Outstanding artisanal coffee! The Spanish Latte and Belgian chocolate cake are to die for. The staff is warm and courteous as always.',
      status: 'Handled',
      reply: 'Thank you so much Anjali! It is always a pleasure having you at Brew & Co.',
      repliedAt: 'Yesterday, 4:15 PM'
    },
    {
      id: 'REV-02',
      customer: 'Priya Sharma',
      rating: 5,
      date: '2 days ago',
      source: 'WhatsApp',
      text: 'Booking through WhatsApp AI took literally 20 seconds. Food was served hot and the quiet patio corner was peaceful.',
      status: 'Handled',
      reply: 'Thanks Priya! Glad you enjoyed the seamless WhatsApp reservation experience.',
      repliedAt: '2 days ago, 1:30 PM'
    },
    {
      id: 'REV-03',
      customer: 'Rahul Verma',
      rating: 4,
      date: '4 days ago',
      source: 'Table QR',
      text: 'Great ambiance and smooth Wi-Fi. The paneer sandwich was delicious, though service took slightly longer during the peak lunch rush.',
      status: 'Pending',
      reply: null,
      repliedAt: null
    },
    {
      id: 'REV-04',
      customer: 'Vivek Joshi',
      rating: 3,
      date: 'Last week',
      source: 'Google',
      text: 'Decent coffee but parking was somewhat crowded on Saturday evening. Recommend reserving parking ahead if possible.',
      status: 'Handled',
      reply: 'Hi Vivek, thank you for your feedback! We now have dedicated valet parking available on weekends.',
      repliedAt: 'Last week'
    }
  ],

  whatsapp: {
    connection: {
      status: 'Connected',
      number: '+91 98765 00000',
      webhook: 'https://api.brewandco.com/cafe/whatsapp/incoming',
      quality: 'High (Green)',
      dailyLimit: '10,000 conversations'
    },
    stats: {
      sentToday: 148,
      delivered: 146,
      read: 132,
      inboundResolved: 63
    },
    templates: [
      { id: 'TMP-01', name: 'table_booking_confirmation', category: 'Utility', language: 'en_IN', preview: 'Hi {{1}}, your table for {{2}} guests is confirmed for {{3}} at {{4}}. Booking ID: {{5}}. See you soon at Brew & Co!' },
      { id: 'TMP-02', name: 'order_status_update', category: 'Utility', language: 'en_IN', preview: 'Hello {{1}}, your order {{2}} is now {{3}}! Estimated time: {{4}} mins.' },
      { id: 'TMP-03', name: 'birthday_special_offer', category: 'Marketing', language: 'en_IN', preview: 'Happy Birthday {{1}}! 🎂 Celebrate with us and enjoy a complimentary dessert on your visit this week with code BDAYCELEB.' },
      { id: 'TMP-04', name: 'post_visit_feedback', category: 'Utility', language: 'en_IN', preview: 'Thank you for visiting Brew & Co today, {{1}}! How was your coffee and experience? Reply with 1 to 5 stars.' }
    ],
    scheduled: [
      { id: 'SCH-01', template: 'birthday_special_offer', audience: 'Birthday This Month (67 customers)', scheduledDate: 'Tomorrow at 09:30 AM', status: 'Pending' },
      { id: 'SCH-02', template: 'Weekend Special Broadcast', audience: 'VIP & Regular Customers (389)', scheduledDate: 'Saturday at 10:00 AM', status: 'Scheduled' }
    ],
    chatLogs: [
      {
        phone: '+91 98765 43210',
        name: 'Priya Sharma',
        time: '2:38 PM',
        intent: 'BOOKING',
        msgs: [
          { dir: 'in', text: 'Hi, I want to book a table for 4 people today evening' },
          { dir: 'out', text: 'Sure Priya! What time would you prefer — 7 PM or 8 PM?' },
          { dir: 'in', text: '7 baje chalega' },
          { dir: 'out', text: 'Table for 4 confirmed at 7:00 PM. Booking ID: RES-2407. Ek confirmation WhatsApp aa raha hai. ☕' }
        ]
      },
      {
        phone: '+91 98123 45678',
        name: 'Arjun Mehta',
        time: '1:15 PM',
        intent: 'ORDER',
        msgs: [
          { dir: 'in', text: 'Menu bhejna' },
          { dir: 'out', text: 'Here\'s our popular menu:\n☕ Coffee: Cappuccino ₹180, Cold Coffee ₹160, Latte ₹190\n🍕 Food: Paneer Sandwich ₹220, Margherita Pizza ₹350\n🍰 Desserts: Chocolate Cake ₹240, Cheesecake ₹260\nKya order karna chahte hain?' },
          { dir: 'in', text: '2 cappuccino and 1 paneer sandwich for takeaway' },
          { dir: 'out', text: 'Order confirmed! Total: ₹580. Payment link bheja ja raha hai.' }
        ]
      },
      {
        phone: '+91 97654 32109',
        name: 'Rohan Das',
        time: '11:50 AM',
        intent: 'STATUS',
        msgs: [
          { dir: 'in', text: 'My order ORD-5513 ka status kya hai?' },
          { dir: 'out', text: 'Order ORD-5513 (Americano, Grilled Sandwich) — Status: Ready for pickup at the main counter. ✅' }
        ]
      },
      {
        phone: '+91 9654321098',
        name: 'Anjali Kapoor',
        time: '10:22 AM',
        intent: 'FEEDBACK',
        msgs: [
          { dir: 'in', text: 'Great experience today! Coffee was amazing 5/5' },
          { dir: 'out', text: 'Bahut shukriya! Aapka feedback sunke bahut achha laga 😊 Would you mind leaving us a quick Google review? It helps us immensely!' },
          { dir: 'in', text: 'Sure, link bhejo' },
          { dir: 'out', text: 'Here\'s our direct Google review link: g.page/brewandco — Thank you so much! ☕' }
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
      greeting: 'Namaste! Welcome to Brew & Co Indiranagar. I can help with table reservations, today’s specials, or connect you to our manager. How may I help you today?',
      operatingHours: '08:00 AM - 11:00 PM',
      escalationRule: 'Transfer to staff if customer repeats query 2 times or asks for manager',
      languageMode: 'Bilingual (Hinglish + English)'
    },
    stats: {
      totalCallsToday: 42,
      totalCallsMonth: 384,
      bookingConversions: 68,
      missedTransfers: 3,
      avgCallDuration: '1m 34s'
    },
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
        transcript: 'AI: Namaste! Welcome to Brew & Co. How may I help you?\nCaller: Hi, I want to book a table for 4 tonight around 8 PM.\nAI: Certainly! We have indoor and patio seating available at 8:00 PM. Which do you prefer?\nCaller: Patio table please.\nAI: Wonderful. I have reserved a patio table for 4 guests under Rohit Khanna. A confirmation SMS and WhatsApp has been sent to your number.'
      },
      {
        id: 'CALL-107',
        caller: 'Meera Sen',
        phone: '+91 98451 23456',
        time: '1:40 PM Today',
        duration: '1m 12s',
        intent: 'Menu & Dietary Inquiry',
        result: 'Provided vegan menu info',
        status: 'Successful',
        transcript: 'AI: Welcome to Brew & Co! How may I assist you today?\nCaller: Do you have almond milk or oat milk options for coffee?\nAI: Yes! We have both organic oat milk and almond milk available for all hot and cold coffee drinks at a ₹30 add-on.'
      },
      {
        id: 'CALL-106',
        caller: 'Anand Kulkarni',
        phone: '+91 97312 98765',
        time: '12:20 PM Today',
        duration: '2m 10s',
        intent: 'Large Corporate Reservation',
        result: 'Escalated to Manager',
        status: 'Transferred',
        transcript: 'Caller: We want to book the entire lounge for 25 people this Friday.\nAI: That sounds exciting! For private events over 15 guests, let me connect you directly to our cafe manager Rajesh Kumar.\n[Call bridged to manager desk]'
      },
      {
        id: 'CALL-105',
        caller: 'Shreya Roy',
        phone: '+91 96112 34567',
        time: '11:05 AM Today',
        duration: '0m 55s',
        intent: 'Operating Hours Inquiry',
        result: 'Information provided',
        status: 'Successful',
        transcript: 'Caller: Hi, what time do you guys close tonight?\nAI: We are open until 11:30 PM tonight with the kitchen taking last food orders at 10:45 PM.'
      }
    ]
  },

  // Table Ordering & Static QR Management System (Permanent static QR stickers on physical tables)
  qrCodes: [
    { id: 'QR-01', table: 'Table 1', zone: 'Main Dining', status: 'Active', scansToday: 18, ordersToday: 12, revenueToday: 4620, totalScans: 412, url: 'https://brewandco.cafe/order?table=T1' },
    { id: 'QR-02', table: 'Table 2', zone: 'Main Dining', status: 'Active', scansToday: 14, ordersToday: 9, revenueToday: 3850, totalScans: 388, url: 'https://brewandco.cafe/order?table=T2' },
    { id: 'QR-03', table: 'Table 3', zone: 'Main Dining', status: 'Active', scansToday: 22, ordersToday: 16, revenueToday: 6240, totalScans: 490, url: 'https://brewandco.cafe/order?table=T3' },
    { id: 'QR-04', table: 'Table 4', zone: 'Main Dining', status: 'Active', scansToday: 9, ordersToday: 6, revenueToday: 2480, totalScans: 260, url: 'https://brewandco.cafe/order?table=T4' },
    { id: 'QR-05', table: 'Table 5', zone: 'Patio & Garden', status: 'Active', scansToday: 25, ordersToday: 18, revenueToday: 7120, totalScans: 540, url: 'https://brewandco.cafe/order?table=T5' },
    { id: 'QR-06', table: 'Table 6', zone: 'Patio & Garden', status: 'Active', scansToday: 12, ordersToday: 8, revenueToday: 3100, totalScans: 310, url: 'https://brewandco.cafe/order?table=T6' },
    { id: 'QR-07', table: 'Table 7', zone: 'Patio & Garden', status: 'Active', scansToday: 31, ordersToday: 22, revenueToday: 9450, totalScans: 620, url: 'https://brewandco.cafe/order?table=T7' },
    { id: 'QR-08', table: 'Table 8', zone: 'Lounge Area', status: 'Active', scansToday: 15, ordersToday: 11, revenueToday: 4890, totalScans: 345, url: 'https://brewandco.cafe/order?table=T8' },
    { id: 'QR-09', table: 'Table 9', zone: 'Lounge Area', status: 'Active', scansToday: 20, ordersToday: 15, revenueToday: 6800, totalScans: 430, url: 'https://brewandco.cafe/order?table=T9' },
    { id: 'QR-10', table: 'Bar Counter', zone: 'Bar Counter', status: 'Active', scansToday: 28, ordersToday: 24, revenueToday: 7820, totalScans: 710, url: 'https://brewandco.cafe/order?table=BAR' },
    { id: 'QR-11', table: 'Takeaway Pickup Counter', zone: 'Entrance', status: 'Active', scansToday: 42, ordersToday: 36, revenueToday: 11800, totalScans: 1180, url: 'https://brewandco.cafe/order?pickup=1' }
  ],

  notifications: [
    { id: 'NTF-01', type: 'order', title: 'New Dine-In Order Placed', message: 'Table 7 placed order ORD-5514 for ₹930.', time: '12 mins ago', read: false, page: 'orders' },
    { id: 'NTF-02', type: 'booking', title: 'New WhatsApp Reservation', message: 'Rahul Verma booked Table 3 for 2 guests at 8:00 PM.', time: '25 mins ago', read: false, page: 'bookings' },
    { id: 'NTF-03', type: 'stock', title: 'Low Inventory Alert', message: 'Oat Milk inventory has dropped below 4 cartons.', time: '1 hour ago', read: false, page: 'menu' },
    { id: 'NTF-04', type: 'customer', title: 'New 5-Star Review Received', message: 'Anjali Kapoor left a 5-star review on Google.', time: '2 hours ago', read: true, page: 'reviews' },
    { id: 'NTF-05', type: 'system', title: 'Daily Backup Completed', message: 'Automated CRM state backed up securely.', time: '4 hours ago', read: true, page: 'settings' }
  ],

  settings: {
    business: {
      name: 'Brew & Co',
      tagline: 'Artisanal Roastery & Kitchen',
      phone: '+91 98765 43210',
      email: 'indiranagar@brewandco.cafe',
      address: 'Plot 42, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, 560038',
      fssaiLicense: '11223344556677',
      openingHours: '08:00 AM - 11:30 PM (Mon - Sun)',
      instagram: '@brewandcocafe',
      googleMapsUrl: 'https://maps.google.com/?cid=brewandco'
    },
    restaurant: {
      gstPercentage: 5,
      serviceChargePercentage: 5,
      currency: '₹',
      turnoverMins: 45,
      autoConfirmBookings: true,
      maxPartySize: 12,
      deliveryRadiusKm: 7
    },
    notificationPrefs: {
      emailAlerts: true,
      whatsappAlerts: true,
      audioChime: true,
      dailyDigest: true
    }
  }
};

class Store {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
    this.initCentralSync();
  }

  async syncApi(endpoint, options = {}) {
    const apiBase = (typeof window !== 'undefined' && window.location.origin) ? `${window.location.origin}/api` : 'http://localhost:4000/api';
    try {
      const res = await fetch(`${apiBase}${endpoint}`, {
        method: options.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      return null;
    }
  }

  async initCentralSync() {
    const apiBase = (typeof window !== 'undefined' && window.location.origin) ? `${window.location.origin}/api` : 'http://localhost:4000/api';
    try {
      const res = await fetch(`${apiBase}/state`, { cache: 'no-store' });
      if (res.ok) {
        const remote = await res.json();
        if (remote) {
          this.state = {
            ...this.state,
            menuItems: remote.menuItems || this.state.menuItems,
            tables: remote.tables || this.state.tables,
            bookings: remote.bookings || this.state.bookings,
            orders: remote.orders || this.state.orders,
            offers: remote.offers || this.state.offers,
            reviews: remote.reviews || this.state.reviews,
            notifications: remote.notifications || this.state.notifications,
            settings: {
              ...this.state.settings,
              business: remote.cafe ? { ...this.state.settings.business, ...remote.cafe } : this.state.settings.business
            }
          };
          this.saveState(this.state);
        }
      }
    } catch (e) {}

    // Setup periodic polling for real-time synchronization every 3 seconds
    if (!this._pollTimer && typeof window !== 'undefined') {
      this._pollTimer = setInterval(async () => {
        try {
          const res = await fetch(`${apiBase}/state`, { cache: 'no-store' });
          if (res.ok) {
            const remote = await res.json();
            if (remote) {
              let changed = false;
              if (remote.bookings && JSON.stringify(remote.bookings) !== JSON.stringify(this.state.bookings)) {
                this.state.bookings = remote.bookings;
                changed = true;
              }
              if (remote.orders && JSON.stringify(remote.orders) !== JSON.stringify(this.state.orders)) {
                this.state.orders = remote.orders;
                changed = true;
              }
              if (remote.tables && JSON.stringify(remote.tables) !== JSON.stringify(this.state.tables)) {
                this.state.tables = remote.tables;
                changed = true;
              }
              if (remote.menuItems && JSON.stringify(remote.menuItems) !== JSON.stringify(this.state.menuItems)) {
                this.state.menuItems = remote.menuItems;
                changed = true;
              }
              if (remote.offers && JSON.stringify(remote.offers) !== JSON.stringify(this.state.offers)) {
                this.state.offers = remote.offers;
                changed = true;
              }
              if (remote.reviews && JSON.stringify(remote.reviews) !== JSON.stringify(this.state.reviews)) {
                this.state.reviews = remote.reviews;
                changed = true;
              }
              if (remote.notifications && remote.notifications.length !== this.state.notifications.length) {
                this.state.notifications = remote.notifications;
                changed = true;
              }
              if (changed) {
                this.saveState(this.state);
              }
            }
          }
        } catch (e) {}
      }, 3000);
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure rolePermissions exist
        if (!parsed.rolePermissions) {
          parsed.rolePermissions = JSON.parse(JSON.stringify(INITIAL_STATE.rolePermissions));
        }
        // Ensure today's date has bookings
        const todayStr = getTodayDateString();
        const hasTodayBookings = parsed.bookings && parsed.bookings.some(b => b.date === todayStr);
        if (!hasTodayBookings && parsed.bookings && parsed.bookings.length > 0) {
          parsed.bookings[0].date = todayStr;
          if (parsed.bookings[1]) parsed.bookings[1].date = todayStr;
          if (parsed.bookings[2]) parsed.bookings[2].date = todayStr;
          if (parsed.bookings[3]) parsed.bookings[3].date = todayStr;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse state from localStorage, falling back to default:', e);
    }
    const fresh = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveState(fresh);
    return fresh;
  }

  saveState(state) {
    this.state = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
    this.notify();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    }
  }

  resetToDefault() {
    this.saveState(JSON.parse(JSON.stringify(INITIAL_STATE)));
  }

  // ── ROLE PERMISSIONS MANAGEMENT (EDITED BY OWNER) ──
  updateRolePermissions(role, permissions) {
    const rolePermissions = {
      ...this.state.rolePermissions,
      [role]: {
        ...this.state.rolePermissions[role],
        ...permissions
      }
    };
    this.saveState({ ...this.state, rolePermissions });
    return rolePermissions;
  }

  // ── ORDER METHODS ──
  updateOrderStatus(orderId, newStatus) {
    const orders = [...this.state.orders];
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], status: newStatus };
      this.saveState({ ...this.state, orders });
      this.syncApi(`/orders/${encodeURIComponent(orderId)}/status`, { method: 'PUT', body: { status: newStatus } });
      return orders[idx];
    }
    return null;
  }

  createOrder(orderData) {
    const orders = [orderData, ...this.state.orders];
    const notifications = [
      {
        id: 'NTF-' + Date.now(),
        type: 'order',
        title: `New ${orderData.type} Order`,
        message: `${orderData.customer} placed order ${orderData.id} for ₹${orderData.total}.`,
        time: 'Just now',
        read: false,
        page: 'orders'
      },
      ...this.state.notifications
    ];
    this.saveState({ ...this.state, orders, notifications });
    this.syncApi('/orders', { method: 'POST', body: orderData });
    return orderData;
  }

  // ── BOOKING METHODS ──
  updateBookingStatus(bookingId, newStatus) {
    const bookings = [...this.state.bookings];
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bookings[idx] = { ...bookings[idx], status: newStatus };
      this.saveState({ ...this.state, bookings });
      this.syncApi(`/bookings/${encodeURIComponent(bookingId)}`, { method: 'PUT', body: { status: newStatus } });
      return bookings[idx];
    }
    return null;
  }

  updateBooking(bookingId, updates) {
    const bookings = [...this.state.bookings];
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bookings[idx] = { ...bookings[idx], ...updates };
      this.saveState({ ...this.state, bookings });
      this.syncApi(`/bookings/${encodeURIComponent(bookingId)}`, { method: 'PUT', body: updates });
      return bookings[idx];
    }
    return null;
  }

  createBooking(bookingData) {
    const bookings = [bookingData, ...this.state.bookings];
    const notifications = [
      {
        id: 'NTF-' + Date.now(),
        type: 'booking',
        title: 'New Reservation Created',
        message: `${bookingData.name} booked for ${bookingData.guests} guests on ${bookingData.date} at ${bookingData.time}.`,
        time: 'Just now',
        read: false,
        page: 'bookings'
      },
      ...this.state.notifications
    ];
    this.saveState({ ...this.state, bookings, notifications });
    this.syncApi('/bookings', { method: 'POST', body: bookingData });
    return bookingData;
  }

  assignBookingTable(bookingId, tableNum) {
    const bookings = [...this.state.bookings];
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bookings[idx] = { ...bookings[idx], table: tableNum };
      this.saveState({ ...this.state, bookings });
      this.syncApi(`/bookings/${encodeURIComponent(bookingId)}`, { method: 'PUT', body: { table: tableNum } });
      return bookings[idx];
    }
    return null;
  }

  // ── TABLE METHODS ──
  updateTableStatus(tableId, newStatus, currentCustomer = null) {
    const tables = [...this.state.tables];
    const idx = tables.findIndex(t => t.id === tableId);
    if (idx !== -1) {
      tables[idx] = { 
        ...tables[idx], 
        status: newStatus,
        currentCustomer: newStatus === 'Available' ? null : (currentCustomer !== null ? currentCustomer : tables[idx].currentCustomer)
      };
      this.saveState({ ...this.state, tables });
      this.syncApi(`/tables/${encodeURIComponent(tableId)}/status`, {
        method: 'PUT',
        body: { status: newStatus, currentCustomer: tables[idx].currentCustomer }
      });
      return tables[idx];
    }
    return null;
  }

  createTable(tableData) {
    const tables = [...this.state.tables, tableData];
    this.saveState({ ...this.state, tables });
    this.syncApi('/tables', { method: 'POST', body: tableData });
    return tableData;
  }

  deleteTable(tableId) {
    const tables = this.state.tables.filter(t => t.id !== tableId);
    this.saveState({ ...this.state, tables });
    this.syncApi(`/tables/${encodeURIComponent(tableId)}`, { method: 'DELETE' });
  }

  // ── MENU METHODS ──
  toggleMenuAvailability(menuId, available) {
    const menuItems = [...this.state.menuItems];
    const idx = menuItems.findIndex(m => m.id === menuId);
    if (idx !== -1) {
      menuItems[idx] = { ...menuItems[idx], available };
      this.saveState({ ...this.state, menuItems });
      this.syncApi(`/menu/${encodeURIComponent(menuId)}/availability`, {
        method: 'PUT',
        body: { available }
      });
      return menuItems[idx];
    }
    return null;
  }

  createMenuItem(itemData) {
    const menuItems = [itemData, ...this.state.menuItems];
    this.saveState({ ...this.state, menuItems });
    this.syncApi('/menu', { method: 'POST', body: itemData });
    return itemData;
  }

  updateMenuItem(itemData) {
    const menuItems = this.state.menuItems.map(m => m.id === itemData.id ? itemData : m);
    this.saveState({ ...this.state, menuItems });
    this.syncApi(`/menu/${encodeURIComponent(itemData.id)}`, { method: 'PUT', body: itemData });
    return itemData;
  }

  deleteMenuItem(menuId) {
    const menuItems = this.state.menuItems.filter(m => m.id !== menuId);
    this.saveState({ ...this.state, menuItems });
    this.syncApi(`/menu/${encodeURIComponent(menuId)}`, { method: 'DELETE' });
  }

  // ── CUSTOMER METHODS ──
  createCustomer(custData) {
    const customers = [custData, ...this.state.customers];
    this.saveState({ ...this.state, customers });
    return custData;
  }

  updateCustomer(custData) {
    const customers = this.state.customers.map(c => c.id === custData.id ? custData : c);
    this.saveState({ ...this.state, customers });
    return custData;
  }

  deleteCustomer(custId) {
    const customers = this.state.customers.filter(c => c.id !== custId);
    this.saveState({ ...this.state, customers });
  }

  // ── STAFF & MANAGING ACCOUNT METHODS (OWNER-EXCLUSIVE PROVISIONING) ──
  createStaffAccount({ name, email, password = 'cafe123', role, phone, shift, status = 'Active' }) {
    const cleanEmail = email.toLowerCase().trim();
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'ST';
    const userId = 'usr-' + Date.now();
    const staffId = 'stf-' + Date.now();

    // 1. Authentication User Account (Used for dashboard sign-in)
    const newUser = {
      id: userId,
      name,
      email: cleanEmail,
      password: password || 'cafe123',
      role,
      avatarInitials: initials,
      phone,
      createdBy: 'Owner',
      createdAt: new Date().toISOString()
    };

    // 2. Staff Directory & Operational Record
    const newStaff = {
      id: staffId,
      userId,
      name,
      role,
      email: cleanEmail,
      phone,
      shift,
      status,
      lastActive: 'Newly provisioned by Owner'
    };

    const users = [...this.state.users, newUser];
    const staff = [...this.state.staff, newStaff];
    this.saveState({ ...this.state, users, staff });
    return { newUser, newStaff };
  }

  createStaff(staffData) {
    return this.createStaffAccount(staffData);
  }

  updateStaff(staffData) {
    const staff = this.state.staff.map(s => s.id === staffData.id ? { ...s, ...staffData } : s);
    const targetEmail = (staffData.email || '').toLowerCase().trim();
    const users = this.state.users.map(u => {
      if (u.email.toLowerCase() === targetEmail) {
        return {
          ...u,
          name: staffData.name || u.name,
          role: staffData.role || u.role,
          phone: staffData.phone || u.phone
        };
      }
      return u;
    });
    this.saveState({ ...this.state, staff, users });
    return staffData;
  }

  deleteStaff(staffId) {
    const target = this.state.staff.find(s => s.id === staffId);
    if (!target) return;
    if (target.role === 'Owner') return; // Cannot delete master owner

    const staff = this.state.staff.filter(s => s.id !== staffId);
    const users = this.state.users.filter(u => u.email.toLowerCase() !== target.email.toLowerCase());
    this.saveState({ ...this.state, staff, users });
  }

  resetStaffPassword(staffEmail, newPassword) {
    const cleanEmail = staffEmail.toLowerCase().trim();
    const users = this.state.users.map(u => {
      if (u.email.toLowerCase() === cleanEmail) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    this.saveState({ ...this.state, users });
  }

  // ── OFFER METHODS ──
  createOffer(offerData) {
    const offers = [offerData, ...this.state.offers];
    this.saveState({ ...this.state, offers });
    this.syncApi('/offers', { method: 'POST', body: offerData });
    return offerData;
  }

  toggleOfferStatus(offerId) {
    const offers = this.state.offers.map(o => {
      if (o.id === offerId) {
        return { ...o, status: o.status === 'Active' ? 'Expired' : 'Active' };
      }
      return o;
    });
    this.saveState({ ...this.state, offers });
    this.syncApi(`/offers/${encodeURIComponent(offerId)}/toggle`, { method: 'POST' });
  }

  deleteOffer(offerId) {
    const offers = this.state.offers.filter(o => o.id !== offerId);
    this.saveState({ ...this.state, offers });
  }

  // ── REVIEW METHODS ──
  replyReview(reviewId, replyText) {
    const reviews = this.state.reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          status: 'Handled',
          reply: replyText,
          repliedAt: 'Just now'
        };
      }
      return r;
    });
    this.saveState({ ...this.state, reviews });
    this.syncApi(`/reviews/${encodeURIComponent(reviewId)}/reply`, {
      method: 'POST',
      body: { reply: replyText }
    });
  }

  toggleReviewHandled(reviewId) {
    const reviews = this.state.reviews.map(r => {
      if (r.id === reviewId) {
        return { ...r, status: r.status === 'Handled' ? 'Pending' : 'Handled' };
      }
      return o || r;
    });
    this.saveState({ ...this.state, reviews });
  }

  // ── WHATSAPP METHODS ──
  addWhatsAppMessage(chat) {
    const whatsapp = { ...this.state.whatsapp };
    whatsapp.chatLogs = [chat, ...whatsapp.chatLogs];
    whatsapp.stats.inboundResolved += 1;
    this.saveState({ ...this.state, whatsapp });
  }

  createWhatsAppTemplate(templateData) {
    const whatsapp = { ...this.state.whatsapp };
    whatsapp.templates = [templateData, ...whatsapp.templates];
    this.saveState({ ...this.state, whatsapp });
    return templateData;
  }

  scheduleBroadcast(broadcastData) {
    const whatsapp = { ...this.state.whatsapp };
    whatsapp.scheduled = [broadcastData, ...whatsapp.scheduled];
    this.saveState({ ...this.state, whatsapp });
    return broadcastData;
  }

  // ── AI CALLING METHODS ──
  updateAiAgentConfig(agentConfig) {
    const aiCalls = {
      ...this.state.aiCalls,
      agent: { ...this.state.aiCalls.agent, ...agentConfig }
    };
    this.saveState({ ...this.state, aiCalls });
  }

  // ── QR / TABLE ORDERING METHODS ──
  generateQRCode(qrData) {
    const qrCodes = [...this.state.qrCodes, qrData];
    this.saveState({ ...this.state, qrCodes });
    return qrData;
  }

  toggleQRStatus(qrId) {
    const qrCodes = this.state.qrCodes.map(q => {
      if (q.id === qrId) {
        return { ...q, status: q.status === 'Active' ? 'Paused' : 'Active' };
      }
      return q;
    });
    this.saveState({ ...this.state, qrCodes });
  }

  // ── NOTIFICATION METHODS ──
  markNotificationAsRead(notifId) {
    const notifications = this.state.notifications.map(n => n.id === notifId ? { ...n, read: true } : n);
    this.saveState({ ...this.state, notifications });
    this.syncApi(`/notifications/${encodeURIComponent(notifId)}/read`, { method: 'POST' });
  }

  markAllNotificationsAsRead() {
    const notifications = this.state.notifications.map(n => ({ ...n, read: true }));
    this.saveState({ ...this.state, notifications });
  }

  // ── ROLE PERMISSIONS METHODS ──
  updateRolePermissions(role, permissions) {
    const rolePermissions = {
      ...this.state.rolePermissions,
      [role]: {
        ...this.state.rolePermissions[role],
        ...permissions
      }
    };
    this.saveState({ ...this.state, rolePermissions });
  }

  // ── SETTINGS METHODS ──
  updateSettings(sectionKey, values) {
    const settings = {
      ...this.state.settings,
      [sectionKey]: {
        ...this.state.settings[sectionKey],
        ...values
      }
    };
    this.saveState({ ...this.state, settings });
    if (sectionKey === 'business') {
      this.syncApi('/cafe', { method: 'PUT', body: values });
    }
  }
}

export const store = new Store();


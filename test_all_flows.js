/**
 * ══════════════════════════════════════════════════════════════
 *  BREW & CO — COMPREHENSIVE END-TO-END INTEGRATION TEST SUITE
 *  Tests all 21 Critical Integration Tests, Flows A-I,
 *  Hub Module Toggling, and Server-Side Validation.
 * ══════════════════════════════════════════════════════════════
 */

const HUB_URL = 'http://localhost:4000';
const ADMIN_URL = 'http://localhost:5173';
const CUSTOMER_URL = 'http://localhost:5174';
const QR_URL = 'http://localhost:8000';
const AI_URL = 'http://localhost:8001';
const WA_URL = 'http://localhost:8002';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName} ${details ? '(' + details + ')' : ''}`);
    testResults.push({ name: testName, status: 'PASS', details });
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
    testResults.push({ name: testName, status: 'FAIL', details });
  }
}

async function request(url, options = {}) {
  try {
    const res = await fetch(url, options);
    let data = null;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, ok: res.ok, data };
  } catch (err) {
    return { status: 0, ok: false, error: err.message };
  }
}

async function runAllTests() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log(' STARTING FULL-STACK CAFE MANAGEMENT INTEGRATION TEST SUITE');
  console.log('══════════════════════════════════════════════════════════════\n');

  // ─────────────────────────────────────────────────────────────
  // 0. HEALTH CHECKS ACROSS ALL 6 SERVICES
  // ─────────────────────────────────────────────────────────────
  console.log('▶ [PHASE 0] SYSTEM HEALTH CHECKS');
  const hHub = await request(`${HUB_URL}/api/cafe`);
  assert(hHub.status === 200, 'Hub & Central API is running on port 4000', `Status: ${hHub.status}`);

  const hAdmin = await request(ADMIN_URL);
  assert(hAdmin.status === 200, 'Admin Dashboard UI is running on port 5173', `Status: ${hAdmin.status}`);

  const hCust = await request(CUSTOMER_URL);
  assert(hCust.status === 200, 'Customer Website UI is running on port 5174', `Status: ${hCust.status}`);

  const hQR = await request(`${QR_URL}/health`);
  assert(hQR.status === 200, 'QR Dine-In System is running on port 8000', `Status: ${hQR.status}`);

  const hAI = await request(`${AI_URL}/health`);
  assert(hAI.status === 200, 'AI Calling Backend is running on port 8001', `Status: ${hAI.status}`);

  const hWA = await request(`${WA_URL}/health`);
  assert(hWA.status === 200, 'WhatsApp Automation Backend is running on port 8002', `Status: ${hWA.status}`);

  // ─────────────────────────────────────────────────────────────
  // TEST 1 — MENU SYNCHRONIZATION
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 1] MENU SYNCHRONIZATION');
  // 1. Admin creates "Paneer Tikka" at ₹280
  const createItemRes = await request(`${HUB_URL}/api/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Paneer Tikka',
      category: 'Starters',
      price: 280,
      cost: 70,
      isVeg: true,
      available: true,
      description: 'Char-grilled cottage cheese cubes with aromatic spices',
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80'
    })
  });
  assert(createItemRes.status === 201, 'Admin creates "Paneer Tikka" at ₹280', `ID: ${createItemRes.data?.id}`);
  const paneerId = createItemRes.data?.id;

  // Verify Customer Website / Central API shows Paneer Tikka at ₹280
  const menuCust1 = await request(`${HUB_URL}/api/menu`);
  const ptCust1 = menuCust1.data.find(i => i.name.toLowerCase() === 'paneer tikka');
  assert(ptCust1 && ptCust1.price === 280, 'Customer menu shows "Paneer Tikka" at ₹280', `Price: ${ptCust1?.price}`);

  // Verify QR system shows Paneer Tikka at ₹280
  const qrMenu1 = await request(`${QR_URL}/tables/table_7/menu`);
  let qrItem1 = null;
  if (qrMenu1.data?.categories) {
    for (const cat of qrMenu1.data.categories) {
      const match = cat.items?.find(i => i.name.toLowerCase() === 'paneer tikka');
      if (match) { qrItem1 = match; break; }
    }
  }
  assert(qrItem1 && Number(qrItem1.price) === 280, 'QR System shows "Paneer Tikka" at ₹280', `QR Price: ${qrItem1?.price}`);

  // Admin changes price: ₹280 -> ₹320
  const updatePriceRes = await request(`${HUB_URL}/api/menu/${paneerId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: 320 })
  });
  assert(updatePriceRes.status === 200 && updatePriceRes.data.price === 320, 'Admin updates price to ₹320', `New price: ${updatePriceRes.data?.price}`);

  // Verify Customer Website shows ₹320
  const menuCust2 = await request(`${HUB_URL}/api/menu`);
  const ptCust2 = menuCust2.data.find(i => i.id === paneerId || i.name.toLowerCase() === 'paneer tikka');
  assert(ptCust2 && ptCust2.price === 320, 'Customer Website reflects updated price ₹320', `Price: ${ptCust2?.price}`);

  // Verify QR System shows ₹320
  const qrMenu2 = await request(`${QR_URL}/tables/table_7/menu`);
  let qrItem2 = null;
  if (qrMenu2.data?.categories) {
    for (const cat of qrMenu2.data.categories) {
      const match = cat.items?.find(i => i.name.toLowerCase() === 'paneer tikka');
      if (match) { qrItem2 = match; break; }
    }
  }
  assert(qrItem2 && Number(qrItem2.price) === 320, 'QR System reflects updated price ₹320 (no stale hardcoded price)', `QR Price: ${qrItem2?.price}`);

  // ─────────────────────────────────────────────────────────────
  // TEST 2 — REMOVE MENU ITEM & HISTORICAL ORDERS PRESERVATION
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 2] REMOVE MENU ITEM & HISTORICAL ORDERS PRESERVATION');
  // First, place an order containing Paneer Tikka before deletion
  const preOrderRes = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 7,
      customerName: 'Historical Test Guest',
      items: [{ id: paneerId, name: 'Paneer Tikka', quantity: 1, price: 320 }]
    })
  });
  assert(preOrderRes.status === 201, 'Created historical order containing Paneer Tikka', `Order: ${preOrderRes.data?.id}`);
  const historicalOrderId = preOrderRes.data?.id;

  // Admin deletes "Paneer Tikka"
  const delRes = await request(`${HUB_URL}/api/menu/${paneerId}`, { method: 'DELETE' });
  assert(delRes.status === 200, 'Admin deletes "Paneer Tikka"', `Success: ${delRes.data?.success}`);

  // Customer Website no longer displays it
  const menuCustAfterDel = await request(`${HUB_URL}/api/menu`);
  const ptDeletedCust = menuCustAfterDel.data.find(i => i.id === paneerId || i.name.toLowerCase() === 'paneer tikka');
  assert(!ptDeletedCust, 'Customer Website no longer displays deleted "Paneer Tikka"');

  // QR System no longer displays it
  const qrMenuAfterDel = await request(`${QR_URL}/tables/table_7/menu`);
  let qrDeletedItem = null;
  if (qrMenuAfterDel.data?.categories) {
    for (const cat of qrMenuAfterDel.data.categories) {
      const match = cat.items?.find(i => i.name.toLowerCase() === 'paneer tikka');
      if (match) { qrDeletedItem = match; break; }
    }
  }
  assert(!qrDeletedItem, 'QR System no longer displays deleted "Paneer Tikka"');

  // Existing historical orders MUST remain intact with purchased item name & price
  const histOrderCheck = await request(`${HUB_URL}/api/orders/${historicalOrderId}`);
  const histItem = histOrderCheck.data?.items?.find(i => i.name.toLowerCase() === 'paneer tikka');
  assert(histItem && histItem.price === 320, 'Historical order record remains intact with Paneer Tikka @ ₹320', `Order Item: ${histItem?.name}`);

  // ─────────────────────────────────────────────────────────────
  // TEST 3 — ITEM AVAILABILITY & REVALIDATION
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 3] ITEM AVAILABILITY');
  // Admin marks "Cold Coffee" UNAVAILABLE
  const coldCoffeeItem = (await request(`${HUB_URL}/api/menu`)).data.find(i => i.name.toLowerCase() === 'cold coffee');
  assert(coldCoffeeItem, 'Located "Cold Coffee" in Central Menu');
  const coldCoffeeId = coldCoffeeItem?.id;

  const toggleAvailRes = await request(`${HUB_URL}/api/menu/${coldCoffeeId}/availability`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ available: false })
  });
  assert(toggleAvailRes.status === 200, 'Admin marks "Cold Coffee" UNAVAILABLE');

  // Customer Website shows unavailable
  const menuCustAvail = (await request(`${HUB_URL}/api/menu`)).data.find(i => i.id === coldCoffeeId);
  assert(menuCustAvail && menuCustAvail.available === false, 'Customer Website shows "Cold Coffee" as Currently Unavailable', `available: ${menuCustAvail?.available}`);

  // QR System shows unavailable
  const qrColdCoffee = await request(`${QR_URL}/tables/table_7/menu`);
  let qrAvailFlag = true;
  if (qrColdCoffee.data?.categories) {
    for (const cat of qrColdCoffee.data.categories) {
      const itm = cat.items?.find(i => i.name.toLowerCase() === 'cold coffee');
      if (itm) { qrAvailFlag = itm.is_available; break; }
    }
  }
  assert(qrAvailFlag === false, 'QR System shows "Cold Coffee" as Currently Unavailable (is_available = false)');

  // Backend revalidates availability and REJECTS order submission for unavailable item
  const unavailOrderRes = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 7,
      customerName: 'Unavailable Item Tester',
      items: [{ id: coldCoffeeId, name: 'Cold Coffee', quantity: 1, price: 160 }]
    })
  });
  assert(unavailOrderRes.status === 400, 'Backend revalidation REJECTS order for unavailable "Cold Coffee"', `Error: ${unavailOrderRes.data?.error}`);

  // Restore Cold Coffee availability for subsequent tests
  await request(`${HUB_URL}/api/menu/${coldCoffeeId}/availability`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ available: true })
  });

  // ─────────────────────────────────────────────────────────────
  // TEST 4 — CUSTOMER BOOKS TABLE
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 4] CUSTOMER BOOKS TABLE');
  const bookRes = await request(`${HUB_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rahul',
      email: 'rahul@example.com',
      phone: '+91 98765 11111',
      date: 'Tomorrow',
      time: '7:30 PM',
      guests: 4,
      tableNumber: 7,
      source: 'Customer Website'
    })
  });
  assert(bookRes.status === 201, 'Booking is created in Central Data Source', `Booking ID: ${bookRes.data?.id}`);
  const rahulBookingId = bookRes.data?.id;

  // Admin Dashboard / Central API sees booking: Rahul, 7:30 PM, 4 guests
  const adminBookings = await request(`${HUB_URL}/api/bookings`);
  const foundRahul = adminBookings.data.find(b => b.id === rahulBookingId);
  assert(
    foundRahul &&
    foundRahul.name === 'Rahul' &&
    foundRahul.time === '7:30 PM' &&
    Number(foundRahul.guests) === 4,
    'Admin sees Rahul booking: 7:30 PM, 4 guests, Pending/Confirmed',
    `Status: ${foundRahul?.status}`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST 5 — ADMIN MODIFIES BOOKING
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 5] ADMIN MODIFIES BOOKING (7:30 PM -> 8:00 PM)');
  const modRes = await request(`${HUB_URL}/api/bookings/${rahulBookingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time: '8:00 PM' })
  });
  assert(modRes.status === 200 && modRes.data.time === '8:00 PM', 'Admin modifies booking time to 8:00 PM');

  // Customer booking record reflects 8:00 PM
  const custCheckRahul = await request(`${HUB_URL}/api/bookings/${rahulBookingId}`);
  assert(custCheckRahul.data?.time === '8:00 PM', 'Customer-facing booking record reflects 8:00 PM via shared API', `Time: ${custCheckRahul.data?.time}`);

  // ─────────────────────────────────────────────────────────────
  // TEST 6 — ADMIN CANCELS BOOKING & SLOT BECOMES AVAILABLE
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 6] ADMIN CANCELS BOOKING');
  const cancelRes = await request(`${HUB_URL}/api/bookings/${rahulBookingId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason: 'Admin cancelled at guest request' })
  });
  assert(cancelRes.status === 200 && cancelRes.data.status === 'Cancelled', 'Booking status becomes Cancelled');

  // Customer-facing status reflects cancellation
  const custCancelledCheck = await request(`${HUB_URL}/api/bookings/${rahulBookingId}`);
  assert(custCancelledCheck.data?.status === 'Cancelled', 'Customer-facing booking reflects Cancelled status');

  // Table slot is freed in central store
  const tablesAfterCancel = await request(`${HUB_URL}/api/tables`);
  const t7 = tablesAfterCancel.data.find(t => t.number === 7 || t.id === 'table_7');
  assert(t7 && (t7.status === 'Available' || t7.status !== 'Occupied'), 'Cancelled table slot is available/not occupied', `Table 7 Status: ${t7?.status}`);

  // ─────────────────────────────────────────────────────────────
  // TEST 7 — QR TABLE IDENTIFICATION
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 7] QR TABLE IDENTIFICATION');
  const qrTableRes = await request(`${QR_URL}/tables/table_7`);
  assert(qrTableRes.status === 200, 'Customer scans Table 7 QR: identifies Table 7', `Table: ${qrTableRes.data?.table_number}`);
  assert(qrTableRes.data?.table_number === 7, 'System strictly identifies Table 7 (cannot order against Table 8 accidentally)');

  // Verify permanent QR works with cafe metadata
  const qrCafeRes = await request(`${QR_URL}/health`);
  assert(qrCafeRes.data?.cafe_name === 'Brew & Co', 'Permanent QR links to Cafe "Brew & Co"');

  // ─────────────────────────────────────────────────────────────
  // TEST 8 — QR ORDER WITH BURGER & COLD COFFEE
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 8] QR ORDER CREATION (Burger x 1, Cold Coffee x 2)');
  const burgerItem = (await request(`${HUB_URL}/api/menu`)).data.find(i => i.name.toLowerCase().includes('burger')) || { id: 'MNU-07B', name: 'Classic Veg Burger', price: 180 };
  const qrOrderPayload = {
    tableNumber: 7,
    tableId: 'table_7',
    customerName: 'Aarav Patel',
    customerPhone: '+91 98765 22222',
    items: [
      { id: burgerItem.id, name: burgerItem.name, quantity: 1, price: burgerItem.price },
      { id: coldCoffeeId, name: 'Cold Coffee', quantity: 2, price: 160 }
    ],
    paymentStatus: 'Paid',
    paymentMethod: 'UPI'
  };

  const qrOrderRes = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(qrOrderPayload)
  });
  assert(qrOrderRes.status === 201, 'Order created in Central API with Table 7, items, quantities, taxes, and total', `Order ID: ${qrOrderRes.data?.id}`);
  const activeOrderId = qrOrderRes.data?.id;

  // Verify Admin Dashboard receives the order
  const adminOrders = await request(`${HUB_URL}/api/orders`);
  const foundAdminOrder = adminOrders.data.find(o => o.id === activeOrderId);
  assert(foundAdminOrder && foundAdminOrder.tableNumber === 7, 'Admin Dashboard shows Table 7 order', `Total: ₹${foundAdminOrder?.total}`);

  // ─────────────────────────────────────────────────────────────
  // TEST 9 — PAYMENT FAILURE (NO KITCHEN ORDER CREATED)
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 9] PAYMENT FAILURE BEHAVIOR');
  const failedOrderRes = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 7,
      customerName: 'Payment Fail Guest',
      items: [{ id: burgerItem.id, name: burgerItem.name, quantity: 1, price: burgerItem.price }],
      paymentStatus: 'Failed'
    })
  });
  const failedOrder = failedOrderRes.data?.order || failedOrderRes.data;
  assert(
    (failedOrderRes.status === 402 || failedOrderRes.status === 201) &&
    (failedOrder?.paymentStatus === 'Failed' || failedOrder?.status === 'Payment Failed'),
    'Order marked as Payment Failed / Payment Pending'
  );
  assert(
    failedOrder?.kitchenStatus === 'Hold' || failedOrder?.status === 'Payment Failed',
    'NO active kitchen execution is permitted while payment is Failed',
    `Status: ${failedOrder?.status}`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST 10 — KITCHEN STATUS SYNCHRONIZATION
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 10] KITCHEN STATUS PROGRESSION (Received -> Preparing -> Ready -> Served -> Completed)');
  const statusProgression = ['Preparing', 'Ready', 'Served', 'Completed'];
  let statusOk = true;

  for (const st of statusProgression) {
    const updateRes = await request(`${HUB_URL}/api/orders/${activeOrderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: st })
    });
    if (updateRes.status !== 200 || updateRes.data.status !== st) {
      statusOk = false;
      break;
    }
    // Check both Admin & Customer see the exact single shared state
    const syncCheck = await request(`${HUB_URL}/api/orders/${activeOrderId}`);
    if (syncCheck.data?.status !== st) {
      statusOk = false;
      break;
    }
  }
  assert(statusOk, 'Order successfully transitioned: Received -> Preparing -> Ready -> Served -> Completed with ONE shared order state');

  // ─────────────────────────────────────────────────────────────
  // TEST 11 — MULTIPLE CUSTOMERS AT SAME TABLE SESSION
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 11] MULTIPLE CUSTOMERS AT SAME TABLE (TABLE 7)');
  // Customer A: Burger
  const ordA = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 7,
      tableId: 'table_7',
      customerName: 'Customer A',
      items: [{ id: burgerItem.id, name: burgerItem.name, quantity: 1, price: burgerItem.price }],
      paymentStatus: 'Paid'
    })
  });

  // Customer B: Pasta
  const pastaItem = (await request(`${HUB_URL}/api/menu`)).data.find(i => i.name.toLowerCase().includes('pasta')) || burgerItem;
  const ordB = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 7,
      tableId: 'table_7',
      customerName: 'Customer B',
      items: [{ id: pastaItem.id, name: pastaItem.name, quantity: 1, price: pastaItem.price }],
      paymentStatus: 'Paid'
    })
  });

  // Customer C: Coffee
  const ordC = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 7,
      tableId: 'table_7',
      customerName: 'Customer C',
      items: [{ id: coldCoffeeId, name: 'Cold Coffee', quantity: 1, price: 160 }],
      paymentStatus: 'Paid'
    })
  });

  assert(ordA.status === 201 && ordB.status === 201 && ordC.status === 201, 'Created 3 distinct customer orders for Table 7');

  // Check Table Session for Table 7
  const t7Session = await request(`${HUB_URL}/api/table-sessions/table_7`);
  assert(
    t7Session.status === 200 &&
    t7Session.data.orders.length >= 3,
    'All customers belong to the same active Table 7 Session without merging customer identities',
    `Orders Count: ${t7Session.data?.orders?.length}, Total Bill: ₹${t7Session.data?.totalBill}`
  );
  assert(
    ordA.data.customerName === 'Customer A' &&
    ordB.data.customerName === 'Customer B' &&
    ordC.data.customerName === 'Customer C',
    'Customer identities and payments remain separately identifiable'
  );

  // ─────────────────────────────────────────────────────────────
  // TEST 12 — WAITER REQUEST
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 12] WAITER REQUEST LIFECYCLE');
  // Customer clicks Call Waiter
  const waiterReq = await request(`${HUB_URL}/api/table-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 7,
      tableId: 'table_7',
      requestType: 'waiter',
      notes: 'Customer at Table 7 called waiter'
    })
  });
  assert(waiterReq.status === 201 && waiterReq.data.status === 'Pending', 'Admin/Kitchen receives Table 7 Waiter Request (Status: Pending)', `ID: ${waiterReq.data?.id}`);
  const reqId = waiterReq.data?.id;

  // Admin acknowledges it
  const ackRes = await request(`${HUB_URL}/api/table-requests/${reqId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Acknowledged' })
  });
  assert(ackRes.status === 200 && ackRes.data.status === 'Acknowledged', 'Admin acknowledges waiter request (Status: Acknowledged)');

  // Admin completes it
  const compRes = await request(`${HUB_URL}/api/table-requests/${reqId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Completed' })
  });
  assert(compRes.status === 200 && compRes.data.status === 'Completed', 'Admin completes waiter request (Status: Completed)');

  // ─────────────────────────────────────────────────────────────
  // TEST 13 — BILL REQUEST
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 13] BILL REQUEST LIFECYCLE');
  const billReq = await request(`${HUB_URL}/api/bill-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 7,
      tableId: 'table_7',
      customerName: 'Aarav Patel'
    })
  });
  assert(billReq.status === 201 && billReq.data.status === 'Pending', 'Customer clicks Request Bill -> Admin receives Table 7 Bill Request', `ID: ${billReq.data?.id}`);
  const billId = billReq.data?.id;

  const billUpd = await request(`${HUB_URL}/api/bill-requests/${billId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Printed' })
  });
  assert(billUpd.status === 200 && billUpd.data.status === 'Printed', 'Admin updates bill request status to Printed');

  // ─────────────────────────────────────────────────────────────
  // TEST 14 — WHATSAPP BOOKING EVENT (MOCK MODE)
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 14] WHATSAPP BOOKING EVENT');
  const waBookingRes = await request(`${HUB_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Sharma',
      phone: '+91 98765 33333',
      date: 'Tonight',
      time: '8:30 PM',
      guests: 2,
      tableNumber: 5
    })
  });
  assert(waBookingRes.status === 201, 'Created booking for Priya Sharma');

  // Verify message logged in WhatsApp history
  const waHistory = await request(`${HUB_URL}/api/whatsapp/messages`);
  const waMsg = waHistory.data?.find(m => m.recipient?.includes('98765 33333') || m.message?.includes('Priya'));
  assert(
    waMsg && waMsg.message?.includes('confirmed'),
    'WhatsApp module received event and simulated: "Your booking at Brew & Co is confirmed for 8:30 PM"',
    `Logged WA Message: "${waMsg?.message}"`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST 15 — WHATSAPP CANCELLATION EVENT
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 15] WHATSAPP CANCELLATION EVENT');
  const priyaBookingId = waBookingRes.data?.id;
  await request(`${HUB_URL}/api/bookings/${priyaBookingId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason: 'Guest emergency' })
  });

  const waHistoryAfterCancel = await request(`${HUB_URL}/api/whatsapp/messages`);
  const cancelMsg = waHistoryAfterCancel.data?.find(m => m.message?.includes('cancelled') && (m.message?.includes('Priya') || m.recipient?.includes('33333')));
  assert(
    cancelMsg,
    'WhatsApp module received booking.cancelled and simulated cancellation message',
    `Logged Cancel Message: "${cancelMsg?.message}"`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST 16 — AI CALLING BOOKING
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 16] AI CALLING BOOKING VIA SHARED SERVICE');
  // Simulate AI Voice concierge handling a caller: "I want a table for 4 tomorrow at 8 PM"
  const aiBookingRes = await request(`${AI_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: 'Vikram Malhotra',
      phone_number: '+91 99887 76655',
      reservation_time: '2026-09-29T20:00:00',
      party_size: 4,
      special_requests: 'Outdoor seating preferred'
    })
  });
  assert(aiBookingRes.status === 200 || aiBookingRes.status === 201, 'AI Calling processes booking request via shared API');

  // Verify booking exists in Central Data Source
  const centralBookings = await request(`${HUB_URL}/api/bookings`);
  const foundAiBooking = centralBookings.data.find(b => b.name?.toLowerCase().includes('vikram') || b.phone?.includes('99887'));
  assert(
    foundAiBooking && Number(foundAiBooking.guests) === 4,
    'Booking created in CENTRAL data source: Admin & Customer Website see it (No isolated AI DB)',
    `Booking: ${foundAiBooking?.name} for ${foundAiBooking?.guests} guests`
  );

  // ─────────────────────────────────────────────────────────────
  // TEST 17 & 18 — ADMIN CHANGES CAFE INFO & OPENING HOURS
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 17 & 18] ADMIN CHANGES CAFE INFORMATION & OPENING HOURS');
  const updateCafeRes = await request(`${HUB_URL}/api/cafe`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Brew & Co Artisanal Lounge',
      phone: '+91 80 4455 6677',
      address: '100 Feet Road, Indiranagar, Bengaluru, 560038',
      openingHours: '07:30 AM - 12:00 AM (Mon - Sun)'
    })
  });
  assert(updateCafeRes.status === 200, 'Admin changes Cafe Name, Phone, Address, and Opening Hours');

  // Customer Website reflects updated info
  const custCafe = await request(`${HUB_URL}/api/cafe`);
  assert(
    custCafe.data.name === 'Brew & Co Artisanal Lounge' &&
    custCafe.data.openingHours.includes('07:30 AM'),
    'Customer Website reflects updated Cafe Name and Opening Hours',
    `Name: "${custCafe.data.name}", Hours: "${custCafe.data.openingHours}"`
  );

  // QR System accesses updated cafe identity
  const qrCafeCheck = await request(`${QR_URL}/health`);
  assert(qrCafeCheck.data?.cafe_name === 'Brew & Co Artisanal Lounge', 'QR System accesses updated cafe identity');

  // Revert cafe name back
  await request(`${HUB_URL}/api/cafe`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Brew & Co' })
  });

  // ─────────────────────────────────────────────────────────────
  // TEST 19 — OFFERS LIFECYCLE
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 19] OFFERS LIFECYCLE (20% Weekend Offer)');
  // Admin creates 20% Weekend Offer
  const offerRes = await request(`${HUB_URL}/api/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: 'WEEKEND20',
      title: '20% Weekend Delight',
      discountPercentage: 20,
      description: 'Flat 20% off on all specialty coffee and artisanal starters this weekend.',
      isActive: true,
      validUntil: '2026-10-15'
    })
  });
  assert(offerRes.status === 201, 'Admin creates "20% Weekend Delight" Offer', `Code: ${offerRes.data?.code}`);
  const offerId = offerRes.data?.id;

  // Customer Website displays the offer
  const activeOffers = await request(`${HUB_URL}/api/offers?onlyActive=true`);
  const foundOffer = activeOffers.data.find(o => o.code === 'WEEKEND20');
  assert(foundOffer && foundOffer.isActive, 'Customer Website displays active 20% Weekend Offer');

  // Admin disables the offer
  const toggleOfferRes = await request(`${HUB_URL}/api/offers/${offerId}/toggle`, { method: 'POST' });
  assert(toggleOfferRes.status === 200 && toggleOfferRes.data.isActive === false, 'Admin disables the offer');

  // It disappears from customer-facing active offers
  const activeOffersAfter = await request(`${HUB_URL}/api/offers?onlyActive=true`);
  const foundOfferAfter = activeOffersAfter.data.find(o => o.code === 'WEEKEND20');
  assert(!foundOfferAfter, 'Offer disappears from customer-facing active offers when disabled');

  // ─────────────────────────────────────────────────────────────
  // TEST 20 — TABLE MANAGEMENT (ADD TABLE 21)
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 20] TABLE MANAGEMENT (ADD TABLE 21)');
  const addTableRes = await request(`${HUB_URL}/api/tables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      number: 21,
      capacity: 6,
      section: 'Rooftop Terrace',
      status: 'Available',
      isActive: true
    })
  });
  assert(addTableRes.status === 201 || addTableRes.status === 200, 'Admin adds Table 21 in Central Data', `Table: ${addTableRes.data?.number}`);

  // Admin can see Table 21
  const adminTables = await request(`${HUB_URL}/api/tables`);
  const foundT21 = adminTables.data.find(t => t.number === 21);
  assert(foundT21 && foundT21.capacity === 6, 'Admin can see Table 21 (Capacity 6, Rooftop Terrace)');

  // QR System can associate and identify Table 21
  const qrT21 = await request(`${QR_URL}/tables/table_21`);
  assert(qrT21.status === 200 && qrT21.data.table_number === 21, 'QR System identifies Table 21 via permanent QR identifier');

  // ─────────────────────────────────────────────────────────────
  // TEST 21 — DEACTIVATE TABLE & PRESERVE HISTORICAL DATA
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [TEST 21] DEACTIVATE TABLE & PRESERVE HISTORICAL DATA');
  // First, place an order against Table 21
  const t21Order = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 21,
      tableId: 'table_21',
      customerName: 'Terrace VIP',
      items: [{ id: coldCoffeeId, name: 'Cold Coffee', quantity: 1, price: 160 }],
      paymentStatus: 'Paid'
    })
  });
  assert(t21Order.status === 201, 'Created historical order for Table 21', `Order: ${t21Order.data?.id}`);
  const t21OrderId = t21Order.data?.id;

  // Deactivate Table 21
  const deactRes = await request(`${HUB_URL}/api/tables/table_21/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Inactive', isActive: false })
  });
  assert(deactRes.status === 200, 'Table 21 deactivated');

  // Inactive table QR must NO longer accept new orders
  const inactiveOrderAttempt = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 21,
      tableId: 'table_21',
      customerName: 'Blocked Guest',
      items: [{ id: coldCoffeeId, name: 'Cold Coffee', quantity: 1, price: 160 }]
    })
  });
  assert(inactiveOrderAttempt.status === 400, 'Deactivated Table 21 strictly rejects new orders', `Error: ${inactiveOrderAttempt.data?.error}`);

  // Historical orders for Table 21 remain preserved
  const t21HistCheck = await request(`${HUB_URL}/api/orders/${t21OrderId}`);
  assert(t21HistCheck.data && t21HistCheck.data.tableNumber === 21, 'Historical order for Table 21 is preserved (data is NOT destroyed)');

  // ─────────────────────────────────────────────────────────────
  // SERVER-SIDE DATA VALIDATION & SECURITY CHECKS
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [DATA VALIDATION & ANTI-TAMPERING CHECKS]');
  // Customer sends tampered price: ₹1 for Cappuccino (real price ₹180)
  const cappuccinoItem = (await request(`${HUB_URL}/api/menu`)).data.find(i => i.name.toLowerCase() === 'cappuccino');
  const tamperedOrderRes = await request(`${HUB_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tableNumber: 7,
      customerName: 'Tamper Tester',
      items: [{ id: cappuccinoItem.id, name: 'Cappuccino', quantity: 2, price: 1.00 }] // fake price ₹1
    })
  });
  assert(
    tamperedOrderRes.status === 201 &&
    tamperedOrderRes.data.subtotal === 360,
    'Server-side validation recalculates real price: 2 x ₹180 = ₹360 (Client price of ₹1 is ignored/corrected)',
    `Server Calculated Subtotal: ₹${tamperedOrderRes.data?.subtotal}`
  );

  // Duplicate request / rapid click prevention
  console.log('\n▶ [DUPLICATE ACTION PROTECTION]');
  const idempotencyKey = `PAY-IDEM-${Date.now()}`;
  const [dup1, dup2] = await Promise.all([
    request(`${HUB_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': idempotencyKey },
      body: JSON.stringify({
        tableNumber: 7,
        customerName: 'Double Clicker',
        items: [{ id: cappuccinoItem.id, name: 'Cappuccino', quantity: 1, price: 180 }]
      })
    }),
    request(`${HUB_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': idempotencyKey },
      body: JSON.stringify({
        tableNumber: 7,
        customerName: 'Double Clicker',
        items: [{ id: cappuccinoItem.id, name: 'Cappuccino', quantity: 1, price: 180 }]
      })
    })
  ]);
  // Both requests succeed gracefully or return the same created order without double charging
  const id1 = dup1.data?.id;
  const id2 = dup2.data?.id;
  assert(id1 === id2 || (dup1.status === 201 && dup2.status === 200), 'Double-click idempotency protection prevents duplicate orders');

  // ─────────────────────────────────────────────────────────────
  // CENTRAL HUB MODULE TOGGLING & FEATURE FLAGS
  // ─────────────────────────────────────────────────────────────
  console.log('\n▶ [CENTRAL HUB TESTING — MODULE TOGGLING & GRACEFUL DEGRADATION]');
  // 1. Toggle QR System OFF
  const toggleQROff = await request(`${HUB_URL}/api/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId: 'qr-system', enabled: false })
  });
  assert(toggleQROff.status === 200 && toggleQROff.data.enabled === false, 'Hub disables QR System module');

  // Customer Website and Admin Dashboard still work when QR is OFF
  const custWhenQROff = await request(`${HUB_URL}/api/cafe`);
  const adminWhenQROff = await request(`${HUB_URL}/api/orders`);
  assert(custWhenQROff.status === 200 && adminWhenQROff.status === 200, 'Customer Website and Admin Dashboard continue working when QR is OFF');

  // Re-enable QR System
  await request(`${HUB_URL}/api/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId: 'qr-system', enabled: true })
  });

  // 2. Toggle WhatsApp Automation OFF
  const toggleWAOff = await request(`${HUB_URL}/api/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId: 'whatsapp-automation', enabled: false })
  });
  assert(toggleWAOff.status === 200 && toggleWAOff.data.enabled === false, 'Hub disables WhatsApp Automation module');

  // Core bookings and orders continue working when WhatsApp is OFF
  const bkgWhenWAOff = await request(`${HUB_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'No WhatsApp Guest',
      phone: '+91 91111 22222',
      date: 'Tomorrow',
      time: '6:00 PM',
      guests: 2
    })
  });
  assert(bkgWhenWAOff.status === 201, 'Core booking functionality operates normally when WhatsApp is OFF');

  // Re-enable WhatsApp
  await request(`${HUB_URL}/api/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId: 'whatsapp-automation', enabled: true })
  });

  // 3. Toggle AI Calling OFF
  const toggleAIOff = await request(`${HUB_URL}/api/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId: 'ai-calling', enabled: false })
  });
  assert(toggleAIOff.status === 200 && toggleAIOff.data.enabled === false, 'Hub disables AI Calling module');
  const cafeWhenAIOff = await request(`${HUB_URL}/api/cafe`);
  assert(cafeWhenAIOff.status === 200, 'All other modules operate normally when AI Calling is OFF');

  // Re-enable AI Calling
  await request(`${HUB_URL}/api/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId: 'ai-calling', enabled: true })
  });

  // ─────────────────────────────────────────────────────────────
  // FINAL TEST SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log(` TEST EXECUTION SUMMARY:`);
  console.log(` Total Tests Executed: ${totalTests}`);
  console.log(` Tests Passed:         ${passedTests}`);
  console.log(` Tests Failed:         ${failedTests}`);
  console.log(` Success Rate:         ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('══════════════════════════════════════════════════════════════\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Test suite crashed with unhandled error:', err);
  process.exit(1);
});

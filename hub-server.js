/**
 * ══════════════════════════════════════════════════════════════
 *  BREW & CO — UNIFIED HUB & CENTRAL CAFE MANAGEMENT API SERVER
 *  Serves the master control panel, manages modules, and provides
 *  the SINGLE SOURCE OF TRUTH REST API for the entire platform.
 * ══════════════════════════════════════════════════════════════
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { centralStore } from './central-store.js';
import { moduleProcessManager, normalizeModuleId } from './module-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.HUB_PORT || 4000;
const CONFIG_FILE = path.join(__dirname, 'modules.config.json');

/** Load current module config from disk */
function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (e) {
    console.error('❌ Failed to load modules.config.json:', e.message);
    return null;
  }
}

/** Save config back to disk */
function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

/** Parse JSON body from incoming request */
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { resolve({}); }
    });
  });
}

/** Send JSON helper */
function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  });
  res.end(JSON.stringify(data));
}

/** Forward webhook event to WhatsApp Automation if enabled */
async function forwardWebhook(url, payload) {
  const config = loadConfig();
  if (!config || !config.modules || !config.modules['whatsapp-automation'] || !config.modules['whatsapp-automation'].enabled) {
    return; // WhatsApp module disabled
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
  } catch (err) {
    // Graceful fallback - offline or not responding
  }
}

// Active SSE client connections
const sseClients = new Set();
const idempotencyCache = new Map();

centralStore.subscribe((state, event) => {
  const msg = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    try { client.write(msg); } catch (e) { sseClients.delete(client); }
  }
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ══════════════════════════════════════════════════════════
  //  1. HUB & MODULE CONFIGURATION ENDPOINTS
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/config' && method === 'GET') {
    const config = loadConfig();
    return sendJSON(res, 200, config);
  }

  if (pathname === '/api/modules' && method === 'GET') {
    const config = loadConfig();
    const statuses = await moduleProcessManager.getAllStatuses();
    const modules = config ? { ...config.modules } : {};
    for (const [id, mod] of Object.entries(modules)) {
      const statusInfo = statuses[id] || { status: 'stopped', portOpen: false };
      modules[id] = {
        ...mod,
        processStatus: statusInfo.status,
        portOpen: statusInfo.portOpen,
        pid: statusInfo.pid
      };
    }
    return sendJSON(res, 200, modules);
  }

  if (pathname === '/api/modules/start-all' && method === 'POST') {
    const results = await moduleProcessManager.startAll();
    return sendJSON(res, 200, { success: true, results });
  }

  if (pathname === '/api/modules/stop-all' && method === 'POST') {
    const results = await moduleProcessManager.stopAll();
    return sendJSON(res, 200, { success: true, results });
  }

  const moduleActionMatch = pathname.match(/^\/api\/modules\/([^/]+)\/(start|stop|restart|status)$/);
  if (moduleActionMatch) {
    const rawId = decodeURIComponent(moduleActionMatch[1]);
    const action = moduleActionMatch[2];
    const normId = normalizeModuleId(rawId);

    if (action === 'status' && method === 'GET') {
      const status = await moduleProcessManager.getStatus(normId);
      return sendJSON(res, 200, status);
    }

    if (method === 'POST') {
      if (action === 'start') {
        const result = await moduleProcessManager.startModule(normId);
        return sendJSON(res, result.success ? 200 : 500, result);
      }
      if (action === 'stop') {
        const result = await moduleProcessManager.stopModule(normId);
        return sendJSON(res, result.success ? 200 : 500, result);
      }
      if (action === 'restart') {
        const result = await moduleProcessManager.restartModule(normId);
        return sendJSON(res, result.success ? 200 : 500, result);
      }
    }
  }

  if (pathname === '/api/toggle' && method === 'POST') {
    const body = await parseBody(req);
    const rawModuleId = body.moduleId || body.module;
    const { enabled, startProcess } = body;

    if (!rawModuleId) {
      return sendJSON(res, 400, { error: 'moduleId is required' });
    }

    const moduleId = normalizeModuleId(rawModuleId);
    const config = loadConfig();
    if (!config || !config.modules[moduleId]) {
      return sendJSON(res, 404, { error: `Module "${rawModuleId}" not found` });
    }

    const newEnabled = typeof enabled === 'boolean' ? enabled : !config.modules[moduleId].enabled;
    config.modules[moduleId].enabled = newEnabled;
    saveConfig(config);

    // Synchronize process lifecycle with enable/disable
    if (!newEnabled) {
      await moduleProcessManager.stopModule(moduleId);
    } else if (startProcess) {
      await moduleProcessManager.startModule(moduleId);
    }

    // Notify clients of module status change
    centralStore.notify({ type: 'MODULE_TOGGLED', moduleId, enabled: newEnabled });

    return sendJSON(res, 200, {
      success: true,
      moduleId,
      enabled: newEnabled,
      message: `${config.modules[moduleId].name} is now ${newEnabled ? 'ENABLED' : 'DISABLED'}`
    });
  }

  if (pathname === '/api/config' && method === 'POST') {
    const body = await parseBody(req);
    const config = loadConfig();

    if (body.modules) {
      for (const [key, val] of Object.entries(body.modules)) {
        const normKey = normalizeModuleId(key);
        if (config.modules[normKey]) {
          const isEnabled = typeof val === 'boolean' ? val : (typeof val.enabled === 'boolean' ? val.enabled : undefined);
          if (isEnabled !== undefined) {
            config.modules[normKey].enabled = isEnabled;
            if (!isEnabled) {
              await moduleProcessManager.stopModule(normKey);
            }
          }
        }
      }
    }

    if (body.integrations) {
      config.integrations = { ...config.integrations, ...body.integrations };
    }

    saveConfig(config);
    return sendJSON(res, 200, { success: true, message: 'Configuration updated', config });
  }

  // ══════════════════════════════════════════════════════════
  //  2. REAL-TIME SERVER-SENT EVENTS (SSE) STREAM
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/events' && method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('retry: 5000\n\n');
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`);

    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // ══════════════════════════════════════════════════════════
  //  3. FULL CENTRAL STATE BOOTSTRAP
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/state' && method === 'GET') {
    return sendJSON(res, 200, centralStore.state);
  }

  // ══════════════════════════════════════════════════════════
  //  4. CAFE INFORMATION
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/cafe' || pathname === '/api/cafe-info') {
    if (method === 'GET') {
      return sendJSON(res, 200, centralStore.getCafe());
    }
    if (method === 'PUT' || method === 'PATCH') {
      const body = await parseBody(req);
      const updated = centralStore.updateCafe(body);
      return sendJSON(res, 200, updated);
    }
  }

  // ══════════════════════════════════════════════════════════
  //  5. MENU CATEGORIES & ITEMS
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/categories' && method === 'GET') {
    return sendJSON(res, 200, centralStore.getCategories());
  }

  if (pathname === '/api/menu' || pathname === '/api/menu-items') {
    if (method === 'GET') {
      const category = url.searchParams.get('category');
      const onlyAvailable = url.searchParams.get('onlyAvailable') === 'true';
      const search = url.searchParams.get('search') || '';
      const items = centralStore.getMenuItems({ category, onlyAvailable, search });
      return sendJSON(res, 200, items);
    }
    if (method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || !body.price) {
        return sendJSON(res, 400, { error: 'Item name and price are required' });
      }
      const newItem = centralStore.createMenuItem(body);
      return sendJSON(res, 201, newItem);
    }
  }

  // Route: /api/menu/:id
  const menuMatch = pathname.match(/^\/api\/menu\/([^/]+)$/);
  if (menuMatch) {
    const id = decodeURIComponent(menuMatch[1]);
    if (method === 'GET') {
      const item = centralStore.getMenuItem(id);
      if (!item) return sendJSON(res, 404, { error: `Menu item '${id}' not found` });
      return sendJSON(res, 200, item);
    }
    if (method === 'PUT' || method === 'PATCH') {
      const body = await parseBody(req);
      const updated = centralStore.updateMenuItem(id, body);
      if (!updated) return sendJSON(res, 404, { error: `Menu item '${id}' not found` });
      return sendJSON(res, 200, updated);
    }
    if (method === 'DELETE') {
      const success = centralStore.deleteMenuItem(id);
      if (!success) return sendJSON(res, 404, { error: `Menu item '${id}' not found` });
      return sendJSON(res, 200, { success: true, message: `Menu item '${id}' deleted` });
    }
  }

  // Route: /api/menu/:id/availability
  const availMatch = pathname.match(/^\/api\/menu\/([^/]+)\/availability$/);
  if (availMatch && (method === 'PUT' || method === 'PATCH' || method === 'POST')) {
    const id = decodeURIComponent(availMatch[1]);
    const body = await parseBody(req);
    const isAvail = typeof body.available === 'boolean' ? body.available : (typeof body.isAvailable === 'boolean' ? body.isAvailable : true);
    const item = centralStore.toggleMenuAvailability(id, isAvail);
    if (!item) return sendJSON(res, 404, { error: `Menu item '${id}' not found` });
    return sendJSON(res, 200, item);
  }

  // ══════════════════════════════════════════════════════════
  //  6. TABLES
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/tables') {
    if (method === 'GET') {
      return sendJSON(res, 200, centralStore.getTables());
    }
    if (method === 'POST') {
      const body = await parseBody(req);
      if (!body.number) return sendJSON(res, 400, { error: 'Table number is required' });
      const newTable = centralStore.createTable(body);
      return sendJSON(res, 201, newTable);
    }
  }

  // Route: /api/tables/:id
  const tableMatch = pathname.match(/^\/api\/tables\/([^/]+)$/);
  if (tableMatch) {
    const id = decodeURIComponent(tableMatch[1]);
    if (method === 'GET') {
      const tbl = centralStore.getTable(id);
      if (!tbl) return sendJSON(res, 404, { error: `Table '${id}' not found` });
      return sendJSON(res, 200, tbl);
    }
    if (method === 'PUT' || method === 'PATCH') {
      const body = await parseBody(req);
      const updated = centralStore.updateTable(id, body);
      if (!updated) return sendJSON(res, 404, { error: `Table '${id}' not found` });
      return sendJSON(res, 200, updated);
    }
    if (method === 'DELETE') {
      const success = centralStore.deactivateTable(id);
      if (!success) return sendJSON(res, 404, { error: `Table '${id}' not found` });
      return sendJSON(res, 200, { success: true, message: `Table '${id}' deactivated` });
    }
  }

  // Route: /api/tables/:id/status
  const tableStatusMatch = pathname.match(/^\/api\/tables\/([^/]+)\/status$/);
  if (tableStatusMatch && (method === 'PUT' || method === 'PATCH' || method === 'POST')) {
    const id = decodeURIComponent(tableStatusMatch[1]);
    const body = await parseBody(req);
    const updated = centralStore.updateTable(id, { status: body.status, currentCustomer: body.currentCustomer });
    if (!updated) return sendJSON(res, 404, { error: `Table '${id}' not found` });
    return sendJSON(res, 200, updated);
  }

  // ══════════════════════════════════════════════════════════
  //  7. BOOKINGS & RESERVATIONS
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/bookings') {
    if (method === 'GET') {
      const date = url.searchParams.get('date');
      const status = url.searchParams.get('status');
      const phone = url.searchParams.get('phone');
      const bookings = centralStore.getBookings({ date, status, phone });
      return sendJSON(res, 200, bookings);
    }
    if (method === 'POST') {
      try {
        const body = await parseBody(req);
        const booking = centralStore.createBooking(body);

        // Forward to WhatsApp webhook
        forwardWebhook('http://localhost:8002/webhooks/cafe/booking-created', {
          booking_id: booking.id,
          customer_name: booking.name,
          customer_phone: booking.phone,
          booking_date: booking.date,
          booking_time: booking.time,
          party_size: booking.guests,
          table_id: booking.tableId,
          cafe_id: centralStore.state.cafe.id
        });

        return sendJSON(res, 201, booking);
      } catch (err) {
        return sendJSON(res, 400, { error: err.message });
      }
    }
  }

  // Route: /api/bookings/:id
  const bookingMatch = pathname.match(/^\/api\/bookings\/([^/]+)$/);
  if (bookingMatch) {
    const id = decodeURIComponent(bookingMatch[1]);
    if (method === 'GET') {
      const b = centralStore.getBooking(id);
      if (!b) return sendJSON(res, 404, { error: `Booking '${id}' not found` });
      return sendJSON(res, 200, b);
    }
    if (method === 'PUT' || method === 'PATCH') {
      const body = await parseBody(req);
      if (body.status && (body.status.toLowerCase() === 'cancelled' || body.status.toLowerCase() === 'canceled')) {
        const cancelled = centralStore.cancelBooking(id, body.reason || body.cancellationReason);
        if (!cancelled) return sendJSON(res, 404, { error: `Booking '${id}' not found` });

        forwardWebhook('http://localhost:8002/webhooks/cafe/booking-cancelled', {
          booking_id: cancelled.id,
          customer_name: cancelled.name,
          customer_phone: cancelled.phone,
          cafe_id: centralStore.state.cafe.id
        });

        return sendJSON(res, 200, cancelled);
      }

      const updated = centralStore.updateBooking(id, body);
      if (!updated) return sendJSON(res, 404, { error: `Booking '${id}' not found` });

      // Forward to WhatsApp
      forwardWebhook('http://localhost:8002/webhooks/cafe/booking-updated', {
        booking_id: updated.id,
        customer_name: updated.name,
        customer_phone: updated.phone,
        booking_date: updated.date,
        booking_time: updated.time,
        party_size: updated.guests,
        table_id: updated.tableId,
        cafe_id: centralStore.state.cafe.id
      });

      return sendJSON(res, 200, updated);
    }
    if (method === 'DELETE') {
      const cancelled = centralStore.cancelBooking(id);
      if (!cancelled) return sendJSON(res, 404, { error: `Booking '${id}' not found` });

      forwardWebhook('http://localhost:8002/webhooks/cafe/booking-cancelled', {
        booking_id: cancelled.id,
        customer_name: cancelled.name,
        customer_phone: cancelled.phone,
        cafe_id: centralStore.state.cafe.id
      });

      return sendJSON(res, 200, cancelled);
    }
  }

  // Route: /api/bookings/:id/cancel
  const bookingCancelMatch = pathname.match(/^\/api\/bookings\/([^/]+)\/cancel$/);
  if (bookingCancelMatch && method === 'POST') {
    const id = decodeURIComponent(bookingCancelMatch[1]);
    const body = await parseBody(req);
    const cancelled = centralStore.cancelBooking(id, body.reason);
    if (!cancelled) return sendJSON(res, 404, { error: `Booking '${id}' not found` });

    forwardWebhook('http://localhost:8002/webhooks/cafe/booking-cancelled', {
      booking_id: cancelled.id,
      customer_name: cancelled.name,
      customer_phone: cancelled.phone,
      cafe_id: centralStore.state.cafe.id
    });

    return sendJSON(res, 200, cancelled);
  }

  // ══════════════════════════════════════════════════════════
  //  8. ORDERS & PAYMENTS (SERVER-SIDE PRICE RECALCULATION)
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/orders') {
    if (method === 'GET') {
      const status = url.searchParams.get('status');
      const table = url.searchParams.get('table');
      return sendJSON(res, 200, centralStore.getOrders({ status, table }));
    }
    if (method === 'POST') {
      try {
        const idemKey = req.headers['x-idempotency-key'] || req.headers['idempotency-key'];
        if (idemKey && idempotencyCache.has(idemKey)) {
          return sendJSON(res, 200, idempotencyCache.get(idemKey));
        }

        const body = await parseBody(req);
        const order = centralStore.createOrder(body);

        if (idemKey) {
          idempotencyCache.set(idemKey, order);
          setTimeout(() => idempotencyCache.delete(idemKey), 10 * 60 * 1000);
        }

        if (order.status !== 'Payment Failed') {
          // Forward order created to WhatsApp if paid
          forwardWebhook('http://localhost:8002/webhooks/cafe/order-created', {
            order_id: order.id,
            phone: order.phone || order.customerPhone || '+91 98765 00000',
            customer_name: order.customer || order.customerName || 'Valued Customer',
            total_amount: String(order.total || '0.00'),
            status: order.status || 'CONFIRMED',
            cafe_id: centralStore.state.cafe.id,
            items: (order.items || []).map(i => `${i.quantity || i.qty || 1}x ${i.name}`)
          });
          return sendJSON(res, 201, order);
        } else {
          return sendJSON(res, 402, {
            error: 'Payment failed. Kitchen order was not dispatched.',
            order
          });
        }
      } catch (err) {
        return sendJSON(res, 400, { error: err.message });
      }
    }
  }

  // Route: /api/orders/recalculate (Server price verification endpoint)
  if (pathname === '/api/orders/recalculate' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const verified = centralStore.recalculateOrderItems(body.items || []);
      return sendJSON(res, 200, verified);
    } catch (err) {
      return sendJSON(res, 400, { error: err.message });
    }
  }

  // Route: /api/orders/:id
  const orderMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
  if (orderMatch) {
    const id = decodeURIComponent(orderMatch[1]);
    if (method === 'GET') {
      const order = centralStore.getOrder(id);
      if (!order) return sendJSON(res, 404, { error: `Order '${id}' not found` });
      return sendJSON(res, 200, order);
    }
  }

  // Route: /api/orders/:id/status
  const orderStatusMatch = pathname.match(/^\/api\/orders\/([^/]+)\/status$/);
  if (orderStatusMatch && (method === 'PUT' || method === 'PATCH' || method === 'POST')) {
    const id = decodeURIComponent(orderStatusMatch[1]);
    const body = await parseBody(req);
    const updated = centralStore.updateOrderStatus(id, body.status);
    if (!updated) return sendJSON(res, 404, { error: `Order '${id}' not found` });

    // Forward order status update
    forwardWebhook('http://localhost:8002/webhooks/cafe/order-updated', {
      order_id: updated.id,
      order_number: updated.orderNumber,
      customer_name: updated.customer,
      customer_phone: updated.phone,
      table_id: updated.tableId,
      total_amount: updated.total,
      status: updated.status,
      cafe_id: centralStore.state.cafe.id
    });

    return sendJSON(res, 200, updated);
  }

  // ══════════════════════════════════════════════════════════
  //  9. TABLE SESSIONS (MULTIPLE CUSTOMERS AT SAME TABLE)
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/table-sessions' && method === 'GET') {
    return sendJSON(res, 200, centralStore.state.tableSessions);
  }

  const tableSessionMatch = pathname.match(/^\/api\/table-sessions\/([^/]+)$/);
  if (tableSessionMatch && method === 'GET') {
    const id = decodeURIComponent(tableSessionMatch[1]);
    const session = centralStore.getTableSession(id);
    if (!session) return sendJSON(res, 404, { error: `Session for table '${id}' not found` });
    return sendJSON(res, 200, session);
  }

  // ══════════════════════════════════════════════════════════
  //  10. TABLE REQUESTS (CALL WAITER / WATER)
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/table-requests') {
    if (method === 'GET') {
      const tableId = url.searchParams.get('tableId') || url.searchParams.get('table');
      return sendJSON(res, 200, centralStore.getTableRequests(tableId));
    }
    if (method === 'POST') {
      const body = await parseBody(req);
      const reqCreated = centralStore.createTableRequest(body);
      return sendJSON(res, 201, reqCreated);
    }
  }

  const tableRequestMatch = pathname.match(/^\/api\/table-requests\/([^/]+)\/status$/);
  if (tableRequestMatch && (method === 'PUT' || method === 'PATCH' || method === 'POST')) {
    const id = decodeURIComponent(tableRequestMatch[1]);
    const body = await parseBody(req);
    const updated = centralStore.updateTableRequestStatus(id, body.status);
    if (!updated) return sendJSON(res, 404, { error: `Request '${id}' not found` });
    return sendJSON(res, 200, updated);
  }

  // ══════════════════════════════════════════════════════════
  //  11. BILL REQUESTS
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/bill-requests') {
    if (method === 'GET') {
      const tableId = url.searchParams.get('tableId') || url.searchParams.get('table');
      return sendJSON(res, 200, centralStore.getBillRequests(tableId));
    }
    if (method === 'POST') {
      const body = await parseBody(req);
      const reqCreated = centralStore.createBillRequest(body);
      return sendJSON(res, 201, reqCreated);
    }
  }

  const billRequestMatch = pathname.match(/^\/api\/bill-requests\/([^/]+)\/status$/);
  if (billRequestMatch && (method === 'PUT' || method === 'PATCH' || method === 'POST')) {
    const id = decodeURIComponent(billRequestMatch[1]);
    const body = await parseBody(req);
    const updated = centralStore.updateBillRequestStatus(id, body.status);
    if (!updated) return sendJSON(res, 404, { error: `Bill request '${id}' not found` });
    return sendJSON(res, 200, updated);
  }

  // ══════════════════════════════════════════════════════════
  //  12. OFFERS & PROMOTIONS
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/offers') {
    if (method === 'GET') {
      const onlyActive = url.searchParams.get('onlyActive') !== 'false';
      return sendJSON(res, 200, centralStore.getOffers(onlyActive));
    }
    if (method === 'POST') {
      const body = await parseBody(req);
      const newOffer = centralStore.createOffer(body);
      return sendJSON(res, 201, newOffer);
    }
  }

  const offerToggleMatch = pathname.match(/^\/api\/offers\/([^/]+)\/toggle$/);
  if (offerToggleMatch && method === 'POST') {
    const id = decodeURIComponent(offerToggleMatch[1]);
    const toggled = centralStore.toggleOfferStatus(id);
    if (!toggled) return sendJSON(res, 404, { error: `Offer '${id}' not found` });
    return sendJSON(res, 200, toggled);
  }

  // ══════════════════════════════════════════════════════════
  //  13. REVIEWS & TESTIMONIALS
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/reviews') {
    if (method === 'GET') {
      return sendJSON(res, 200, centralStore.getReviews());
    }
    if (method === 'POST') {
      const body = await parseBody(req);
      const newReview = centralStore.createReview(body);
      return sendJSON(res, 201, newReview);
    }
  }

  const reviewReplyMatch = pathname.match(/^\/api\/reviews\/([^/]+)\/reply$/);
  if (reviewReplyMatch && method === 'POST') {
    const id = decodeURIComponent(reviewReplyMatch[1]);
    const body = await parseBody(req);
    const replied = centralStore.replyReview(id, body.reply);
    if (!replied) return sendJSON(res, 404, { error: `Review '${id}' not found` });
    return sendJSON(res, 200, replied);
  }

  // ══════════════════════════════════════════════════════════
  //  14. NOTIFICATIONS
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/notifications') {
    if (method === 'GET') {
      return sendJSON(res, 200, centralStore.getNotifications());
    }
    if (method === 'POST') {
      const body = await parseBody(req);
      const ntf = centralStore.createNotification(body);
      return sendJSON(res, 201, ntf);
    }
  }

  const notifReadMatch = pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
  if (notifReadMatch && method === 'POST') {
    const id = decodeURIComponent(notifReadMatch[1]);
    const read = centralStore.markNotificationRead(id);
    return sendJSON(res, 200, { success: !!read });
  }

  // ══════════════════════════════════════════════════════════
  //  15. WHATSAPP & AI CALLING INTEGRATION ENDPOINTS
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/whatsapp/messages') {
    if (method === 'GET') {
      return sendJSON(res, 200, centralStore.getWhatsAppMessages());
    }
    if (method === 'POST') {
      const body = await parseBody(req);
      const recipient = body.recipient || body.phone || '+91 99999 00000';
      const text = body.message || body.text || '';
      const name = body.name || body.customerName || 'Customer';
      const existing = centralStore.state.whatsapp.chatLogs.find(c => c.phone.replace(/[^0-9]/g, '') === recipient.replace(/[^0-9]/g, ''));
      if (existing) {
        existing.msgs.push({ dir: 'out', text, time: 'Just now' });
      } else {
        centralStore.state.whatsapp.chatLogs.unshift({
          id: `chat_${Date.now()}`,
          phone: recipient,
          name,
          time: 'Just now',
          intent: body.intent || 'GENERAL',
          msgs: [{ dir: 'out', text, time: 'Just now' }]
        });
      }
      centralStore.state.whatsapp.stats.sentToday += 1;
      centralStore.saveState();
      return sendJSON(res, 201, { success: true });
    }
  }

  if (pathname === '/api/ai-calls') {
    if (method === 'GET') {
      return sendJSON(res, 200, centralStore.getAiCalls());
    }
    if (method === 'POST') {
      const body = await parseBody(req);
      centralStore.state.aiCalls.calls.unshift({
        id: body.id || `CALL-${Date.now().toString().slice(-4)}`,
        caller: body.caller || 'Phone Caller',
        phone: body.phone || '+91 99999 00000',
        time: 'Just now',
        duration: body.duration || '1m 20s',
        intent: body.intent || 'Inquiry',
        result: body.result || 'Handled',
        status: 'Successful',
        transcript: body.transcript || ''
      });
      centralStore.saveState();
      return sendJSON(res, 201, { success: true });
    }
  }

  // ══════════════════════════════════════════════════════════
  //  16. SERVE STATIC HUB HTML & ASSETS
  // ══════════════════════════════════════════════════════════
  if (pathname === '/' || pathname === '/index.html') {
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to load index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      }
    });
    return;
  }

  const safePath = path.join(__dirname, pathname);
  if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    const ext = path.extname(safePath).toLowerCase();
    const mimeMap = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff2': 'font/woff2',
    };
    fs.readFile(safePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Read error');
      } else {
        res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
        res.end(data);
      }
    });
    return;
  }

  return sendJSON(res, 404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  ☕  BREW & CO — Unified Cafe Management Hub & Central API');
  console.log(`  🌐  Hub Control Panel:  http://localhost:${PORT}/`);
  console.log(`  ⚙️   Module Config API:  http://localhost:${PORT}/api/config`);
  console.log(`  🍽️  Central Cafe API:   http://localhost:${PORT}/api/cafe`);
  console.log(`  📜  Central Menu API:   http://localhost:${PORT}/api/menu`);
  console.log(`  🪑  Central Tables API: http://localhost:${PORT}/api/tables`);
  console.log(`  📅  Central Bookings:   http://localhost:${PORT}/api/bookings`);
  console.log(`  🛒  Central Orders:     http://localhost:${PORT}/api/orders`);
  console.log(`  ⚡  Live Event Stream:  http://localhost:${PORT}/api/events`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
});

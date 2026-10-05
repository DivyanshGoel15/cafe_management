const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIR = __dirname;

// In-memory cafe state (synchronized with cafe.json workflow logic)
const cafeState = {
  bookings: [
    { id: 'RES-2410', name: 'Priya Sharma', phone: '9876543210', date: '2026-08-31', time: '12:30', guests: 4, status: 'confirmed', channel: 'WhatsApp' },
    { id: 'RES-2409', name: 'Arjun Mehta', phone: '9812345678', date: '2026-08-31', time: '13:00', guests: 2, status: 'confirmed', channel: 'WhatsApp' },
    { id: 'RES-2408', name: 'Sonal Gupta', phone: '9098765432', date: '2026-08-31', time: '19:30', guests: 6, status: 'confirmed', channel: 'Phone' },
    { id: 'RES-2407', name: 'Rahul Verma', phone: '9765432109', date: '2026-08-31', time: '20:00', guests: 2, status: 'pending', channel: 'WhatsApp' },
  ],
  orders: [
    { id: 'ORD-5521', customer: 'Priya Sharma', items: 'Cappuccino x2, Paneer Sandwich', total: 580, type: 'Dine-in', status: 'delivered', time: '12:45' },
    { id: 'ORD-5520', customer: 'Arjun Mehta', items: 'Cold Coffee, Margherita Pizza', total: 510, type: 'Dine-in', status: 'delivered', time: '13:10' },
    { id: 'ORD-5519', customer: 'Rohan Das', items: 'Masala Chai x3, Samosa x4', total: 340, type: 'Takeaway', status: 'paid', time: '11:30' },
  ],
  aiLogs: []
};

// Load cafe.json workflow template
let workflowData = null;
try {
  workflowData = JSON.parse(fs.readFileSync(path.join(DIR, 'cafe.json'), 'utf8'));
} catch (e) {
  console.error('Error reading cafe.json:', e);
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({ raw: body });
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. API: Get n8n workflow metadata
  if (pathname === '/api/workflow') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      workflowName: workflowData?.name,
      totalNodes: workflowData?.nodes?.length || 0,
      webhooks: workflowData?.nodes?.filter(n => n.type.includes('webhook')).map(n => ({
        name: n.name,
        path: n.parameters?.path,
        httpMethod: n.parameters?.httpMethod || 'GET'
      })),
      aiNodes: workflowData?.nodes?.filter(n => n.name.toLowerCase().includes('sarvam') || n.name.toLowerCase().includes('ai')).map(n => n.name)
    }, null, 2));
    return;
  }

  // 2. API: Raw cafe.json download
  if (pathname === '/cafe.json') {
    const filePath = path.join(DIR, 'cafe.json');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('cafe.json not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });
    return;
  }

  // 3. n8n Simulated Webhook: POST /cafe/whatsapp/incoming (Simulates Sarvam AI + WhatsApp router)
  if (pathname === '/cafe/whatsapp/incoming' && req.method === 'POST') {
    const payload = await parseJsonBody(req);
    const msg = payload.messages?.[0] || payload;
    const contact = payload.contacts?.[0] || {};
    const text = msg.text?.body || msg.text || payload.text || '';
    const phone = msg.from || payload.phone || '+91 9876543210';
    const name = contact.profile?.name || payload.name || 'Guest';

    // Basic Intent extraction mirroring Sarvam AI router logic
    let intent = 'HUMAN';
    let reply = 'Thank you for contacting Brew & Co! Our team will get back to you shortly.';
    const lower = text.toLowerCase();

    if (lower.includes('book') || lower.includes('table') || lower.includes('reserve')) {
      intent = 'BOOKING';
      const guestsMatch = text.match(/(\d+)\s*(people|guests|pax|person)?/i);
      const guests = guestsMatch ? parseInt(guestsMatch[1]) : 2;
      const resId = 'RES-' + Math.floor(1000 + Math.random() * 9000);
      cafeState.bookings.unshift({
        id: resId,
        name: name,
        phone: phone,
        date: new Date().toISOString().split('T')[0],
        time: '19:30',
        guests: guests,
        status: 'confirmed',
        channel: 'WhatsApp'
      });
      reply = `Table for ${guests} confirmed at Brew & Co! Your booking reference is ${resId}. See you soon! ☕`;
    } else if (lower.includes('menu')) {
      intent = 'MENU';
      reply = `*Brew & Co Menu*:\n☕ Cappuccino ₹180 | Cold Brew ₹200 | Latte ₹190\n🍕 Paneer Sandwich ₹220 | Margherita Pizza ₹350\n🍰 Chocolate Cake ₹240 | Cheesecake ₹260\nReply with your order for instant checkout!`;
    } else if (lower.includes('order') || lower.includes('cappuccino') || lower.includes('pizza') || lower.includes('sandwich')) {
      intent = 'ORDER';
      const orderId = 'ORD-' + Math.floor(5000 + Math.random() * 1000);
      cafeState.orders.unshift({
        id: orderId,
        customer: name,
        items: text.slice(0, 40),
        total: 380,
        type: 'Dine-in',
        status: 'pending',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
      reply = `Order ${orderId} received! Total: ₹380. Tap here to complete UPI payment: https://pay.brewandco.example/${orderId}`;
    } else if (lower.includes('status')) {
      intent = 'STATUS';
      reply = `Your recent order is being freshly prepared in the kitchen. ETA: 8 minutes. ✅`;
    } else if (lower.includes('good') || lower.includes('great') || lower.includes('love') || lower.includes('amazing') || lower.includes('bad') || lower.includes('feedback')) {
      intent = 'FEEDBACK';
      reply = `Thank you so much for your feedback! It means the world to us. Leave us a review on Google: https://g.page/brewandco ☕`;
    }

    cafeState.aiLogs.unshift({
      phone,
      name,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      intent,
      text,
      reply
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      intent,
      reply,
      phone,
      simulatedNode: 'Sarvam — AI Router + Intent Dispatch'
    }));
    return;
  }

  // 4. n8n Simulated Sarvam Tools
  if (pathname === '/cafe/sarvam/check-availability' && req.method === 'POST') {
    const data = await parseJsonBody(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ available: true, date: data.date || 'today', guests: Number(data.guests || 2), alternatives: [] }));
    return;
  }

  if (pathname === '/cafe/sarvam/create-booking' && req.method === 'POST') {
    const data = await parseJsonBody(req);
    const id = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, reservation_id: id, name: data.name, phone: data.phone }));
    return;
  }

  if (pathname === '/cafe/sarvam/menu') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      currency: 'INR',
      categories: [
        { name: 'Coffee', items: [{ name: 'Cappuccino', price: 180 }, { name: 'Cold Brew', price: 200 }] },
        { name: 'Food', items: [{ name: 'Paneer Sandwich', price: 220 }, { name: 'Margherita Pizza', price: 350 }] }
      ]
    }));
    return;
  }

  // 5. Default: Serve CAFE_CRM_Dashboard.html and assets
  let filePath = path.join(DIR, (pathname === '/' || pathname === '/dashboard') ? 'CAFE_CRM_Dashboard.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIR, 'CAFE_CRM_Dashboard.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(` Brew & Co — Cafe Management & AI Hub`);
  console.log(` Running at: http://localhost:${PORT}/`);
  console.log(` Raw workflow: http://localhost:${PORT}/cafe.json`);
  console.log(` Workflow metadata API: http://localhost:${PORT}/api/workflow`);
  console.log(` WhatsApp AI Webhook: http://localhost:${PORT}/cafe/whatsapp/incoming`);
  console.log(`=================================================\n`);
});

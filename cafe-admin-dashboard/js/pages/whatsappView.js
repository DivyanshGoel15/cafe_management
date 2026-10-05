/* ══════════════════════════════════════════════════════════════
   BREW & CO — WHATSAPP AUTOMATION & SIMULATOR VIEW
   Meta Cloud API status, message templates, campaigns & live bot
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let waActiveTab = 'simulator'; // 'simulator', 'templates', 'campaigns'

export function renderWhatsApp() {
  const state = store.getState();
  const el = document.getElementById('view-whatsapp');
  if (!el) return;

  const wa = state.whatsapp;

  el.innerHTML = `
    <!-- WhatsApp Connection & Metrics Card -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:18px 22px; margin-bottom:18px; box-shadow:var(--shadow-sm);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:42px; height:42px; border-radius:50%; background:#25D366; display:flex; align-items:center; justify-content:center; color:#fff; font-size:22px; box-shadow:0 3px 8px rgba(37,211,102,0.3);">
            💬
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px; font-weight:700; color:var(--text);">Meta WhatsApp Cloud API</span>
              <span class="badge badge-green">${wa.connection.status}</span>
            </div>
            <div style="font-size:12px; color:var(--muted); margin-top:2px;">
              Active Number: <strong>${wa.connection.number}</strong> &middot; Webhook: <code>/cafe/whatsapp/incoming</code>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline btn-sm" onclick="window.testWhatsAppWebhook()">⚡ Test Webhook Health</button>
          <button class="btn btn-primary btn-sm" onclick="window.openNewTemplateModal()">+ New Template</button>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Messages Sent Today</div>
        <div class="stat-value">${wa.stats.sentToday}</div>
        <div class="stat-delta up">98.6% delivery success rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Delivered &amp; Read</div>
        <div class="stat-value">${wa.stats.read}</div>
        <div class="stat-delta up">89% read rate within 5 mins</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Inbound Bot Handled</div>
        <div class="stat-value">${wa.stats.inboundResolved}</div>
        <div class="stat-delta up">94% auto-resolved via Sarvam AI</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Quality Rating</div>
        <div class="stat-value" style="color:var(--green)">High</div>
        <div class="stat-delta up">Tier 2 (10,000 msgs/day)</div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${waActiveTab === 'simulator' ? 'active' : ''}" onclick="window.switchWaTab('simulator')">📱 Live Bot Simulator</button>
        <button class="ftab ${waActiveTab === 'templates' ? 'active' : ''}" onclick="window.switchWaTab('templates')">📑 Message Templates (${wa.templates.length})</button>
        <button class="ftab ${waActiveTab === 'campaigns' ? 'active' : ''}" onclick="window.switchWaTab('campaigns')">🚀 Broadcast Campaigns (${wa.scheduled.length})</button>
      </div>
    </div>

    <!-- Tab 1: Live Simulator & Chat Logs -->
    ${waActiveTab === 'simulator' ? `
      <div class="wa-container">
        <!-- Interactive WhatsApp Test Phone UI -->
        <div class="wa-phone">
          <div class="wa-top">
            <div class="wa-avatar">☕</div>
            <div style="flex:1">
              <div class="wa-top-title">Brew &amp; Co AI Bot</div>
              <div class="wa-top-status">Online (WhatsApp Webhook Active)</div>
            </div>
            <span class="badge badge-green" style="background:#25D366; color:#fff; border-radius:12px; padding:2px 8px; font-size:10px;">Live</span>
          </div>

          <div class="wa-chat" id="wa-chat-box">
            <div class="wa-bubble out">
              Hi! Welcome to Brew &amp; Co Cafe. ☕ How can I assist you today? You can ask for our menu, book a table, place an order, or check an existing order status!
              <div class="wa-bubble-time">Just now</div>
            </div>
          </div>

          <div class="wa-chips">
            <button type="button" class="wa-chip" onclick="window.quickSendWa('Menu bhejna please')">☕ View Menu</button>
            <button type="button" class="wa-chip" onclick="window.quickSendWa('Book a table for 4 tonight at 8 PM')">📅 Book Table</button>
            <button type="button" class="wa-chip" onclick="window.quickSendWa('2 Cappuccinos and 1 Paneer Sandwich takeaway')">🍕 Place Order</button>
            <button type="button" class="wa-chip" onclick="window.quickSendWa('Order ORD-5513 ka status kya hai?')">🔍 Order Status</button>
            <button type="button" class="wa-chip" onclick="window.quickSendWa('Amazing coffee and service today! 5/5')">⭐ Feedback</button>
          </div>

          <form class="wa-input-box" onsubmit="event.preventDefault(); window.submitWaMessage();">
            <input type="text" id="wa-msg-input" class="wa-input" placeholder="Type a message (e.g. 'table for 2 tonight')..." autocomplete="off">
            <button type="submit" class="wa-send-btn" title="Send">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </form>
        </div>

        <!-- Recent WhatsApp Customer Conversations -->
        <div>
          <div class="section-header">
            <div class="section-title">Live Inbound Conversations &amp; Intent Routing</div>
            <span style="font-size:12px; color:var(--muted)">Syncs with /cafe/whatsapp/incoming</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;" id="ai-logs-container">
            ${wa.chatLogs.map(log => `
              <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:14px 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <div>
                    <span style="font-weight:700; font-size:13px;">${log.phone}</span>
                    <span style="font-size:11px; color:var(--muted); margin-left:6px;">${log.time} &middot; Today</span>
                  </div>
                  <span class="badge ${log.intent === 'BOOKING' ? 'badge-yellow' : log.intent === 'ORDER' ? 'badge-blue' : log.intent === 'STATUS' ? 'badge-green' : 'badge-purple'}">
                    ${log.intent}
                  </span>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${log.msgs.map(m => `
                    <div style="display:flex; gap:8px; align-items:flex-start; ${m.dir === 'out' ? 'flex-direction:row-reverse;' : ''}">
                      <div style="padding:6px 10px; border-radius:8px; font-size:12px; max-width:80%; line-height:1.4; background:${m.dir === 'in' ? '#F0EFED' : 'var(--accent-dim)'};">
                        ${m.text.replace(/\n/g, '<br>')}
                      </div>
                      <div style="font-size:10px; color:var(--muted); align-self:flex-end;">${m.dir === 'in' ? 'Customer' : 'AI Bot'}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : waActiveTab === 'templates' ? `
      <!-- Tab 2: Pre-approved Meta Cloud Templates -->
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">
        ${wa.templates.map(tmp => `
          <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:18px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="td-mono td-bold">${tmp.name}</span>
              <span class="badge badge-green">Meta Approved</span>
            </div>
            <div style="font-size:11.5px; color:var(--muted); margin-bottom:12px;">Category: <strong>${tmp.category}</strong> &middot; Language: <strong>${tmp.language}</strong></div>
            <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:6px; padding:12px; font-size:12.5px; line-height:1.5; color:var(--text); margin-bottom:14px; flex:1;">
              "${tmp.preview}"
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px;">
              <button class="btn btn-outline btn-sm" onclick="window.useTemplateBroadcast('${tmp.id}')">📢 Send Broadcast</button>
            </div>
          </div>
        `).join('')}
      </div>
    ` : `
      <!-- Tab 3: Scheduled Campaigns -->
      <div class="table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Campaign ID</th>
                <th>Template</th>
                <th>Target Customer Audience</th>
                <th>Scheduled Date &amp; Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${wa.scheduled.map(s => `
                <tr>
                  <td class="td-mono td-bold">${s.id}</td>
                  <td><strong>${s.template}</strong></td>
                  <td><span class="badge badge-blue">${s.audience}</span></td>
                  <td class="td-muted">${s.scheduledDate}</td>
                  <td><span class="badge badge-yellow">${s.status}</span></td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.toast.info('Broadcast dispatched immediately.')">Send Now</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `}
  `;
}

window.switchWaTab = (tab) => {
  waActiveTab = tab;
  renderWhatsApp();
};

window.testWhatsAppWebhook = () => {
  toast.success('Webhook health check: 200 OK. Latency: 42ms. Sarvam AI router operational.');
};

window.quickSendWa = (text) => {
  window.sendSimulatedMessage(text);
};

window.submitWaMessage = () => {
  const inp = document.getElementById('wa-msg-input');
  if (!inp || !inp.value.trim()) return;
  const val = inp.value.trim();
  inp.value = '';
  window.sendSimulatedMessage(val);
};

window.sendSimulatedMessage = (text) => {
  const chatBox = document.getElementById('wa-chat-box');
  if (!chatBox) return;

  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Inbound customer bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'wa-bubble in';
  userBubble.innerHTML = `${text}<div class="wa-bubble-time">${now}</div>`;
  chatBox.appendChild(userBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Typing indicator
  const typingBubble = document.createElement('div');
  typingBubble.className = 'wa-bubble out';
  typingBubble.innerHTML = `<em>AI Concierge is typing...</em>`;
  chatBox.appendChild(typingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Simulated AI Intent Router
  setTimeout(() => {
    let reply = '';
    let intent = 'INQUIRY';
    const lower = text.toLowerCase();

    if (lower.includes('menu')) {
      intent = 'MENU';
      reply = `Here is our popular menu:\n☕ Coffee: Cappuccino ₹180, Cold Coffee ₹160, Latte ₹190\n🍕 Food: Paneer Sandwich ₹220, Margherita Pizza ₹350\n🍰 Desserts: Chocolate Cake ₹240, Cheesecake ₹260\nWould you like to place an order?`;
    } else if (lower.includes('table') || lower.includes('book')) {
      intent = 'BOOKING';
      const newResId = 'RES-' + Math.floor(2420 + Math.random() * 80);
      reply = `Table for your party has been confirmed! Booking ID: ${newResId} for tonight. A confirmation WhatsApp notification has been issued. ☕`;
      store.createBooking({
        id: newResId,
        name: 'WhatsApp Guest',
        phone: '+91 98765 43210',
        date: '2026-08-31',
        time: '08:00 PM',
        guests: 4,
        table: 'Table 4',
        status: 'Confirmed',
        channel: 'WhatsApp',
        specialRequests: 'Booked via AI Simulator'
      });
    } else if (lower.includes('order') || lower.includes('cappuccino') || lower.includes('sandwich')) {
      intent = 'ORDER';
      const newOrdId = 'ORD-' + Math.floor(5535 + Math.random() * 80);
      reply = `Your order ${newOrdId} (${text.slice(0, 30)}) has been received and confirmed! Total: ₹580. Payment link dispatched via UPI.`;
      store.createOrder({
        id: newOrdId,
        customer: 'WhatsApp Guest',
        phone: '+91 98765 43210',
        type: 'Takeaway',
        table: 'Pickup Counter',
        items: [{ name: 'Cappuccino', qty: 2, price: 180, total: 360 }, { name: 'Paneer Sandwich', qty: 1, price: 220, total: 220 }],
        subtotal: 580,
        tax: 29,
        serviceCharge: 0,
        discount: 0,
        total: 609,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: 'UPI',
        time: now,
        date: '2026-08-31',
        notes: 'Placed via WhatsApp AI'
      });
    } else if (lower.includes('status')) {
      intent = 'STATUS';
      reply = `Order ORD-5513 is Ready for pickup at the counter! Please show this message to the barista. ✅`;
    } else if (lower.includes('feedback') || lower.includes('5/5') || lower.includes('amazing')) {
      intent = 'FEEDBACK';
      reply = `Bahut shukriya! We are thrilled you enjoyed the artisanal brew. 🌟 Here is our Google Review link: g.page/brewandco. Hope to see you again soon!`;
    } else {
      reply = `Thank you for reaching out to Brew & Co! Our barista team has received your inquiry and will follow up shortly. You can also call us directly at +91 98765 43210.`;
    }

    typingBubble.innerHTML = `${reply.replace(/\n/g, '<br>')}<div class="wa-bubble-time">${now}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    // Record into logs
    store.addWhatsAppMessage({
      phone: '+91 98765 43210',
      name: 'WhatsApp Guest',
      time: now,
      intent: intent,
      msgs: [
        { dir: 'in', text: text },
        { dir: 'out', text: reply }
      ]
    });
  }, 600);
};

window.openNewTemplateModal = () => {
  let modalEl = document.getElementById('modal-wa-template');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-wa-template';
    modalEl.className = 'modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Create WhatsApp Message Template</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-wa-template')">✕</button>
      </div>
      <form onsubmit="window.saveNewTemplate(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Template Name (lowercase snake_case) *</label>
              <input type="text" class="form-input" id="tpl-name" required placeholder="e.g. table_ready_alert">
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="tpl-cat">
                <option value="Utility">Utility</option>
                <option value="Marketing">Marketing</option>
                <option value="Authentication">Authentication (OTP)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Message Body Preview *</label>
            <textarea class="form-textarea" id="tpl-text" required placeholder="e.g. Hello {{1}}, your table {{2}} is ready! Please proceed to the host desk."></textarea>
            <div class="form-hint">Use {{1}}, {{2}} for dynamic variables.</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-wa-template')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Submit to Meta for Approval</button>
        </div>
      </form>
    </div>
  `;

  modal.open('modal-wa-template');
};

window.saveNewTemplate = (e) => {
  e.preventDefault();
  const name = document.getElementById('tpl-name').value.trim().toLowerCase().replace(/\s+/g, '_');
  const cat = document.getElementById('tpl-cat').value;
  const text = document.getElementById('tpl-text').value.trim();

  store.createWhatsAppTemplate({
    id: 'TMP-' + Date.now(),
    name,
    category: cat,
    language: 'en_IN',
    preview: text
  });

  modal.close('modal-wa-template');
  toast.success(`Template "${name}" submitted to Meta Cloud API!`);
  renderWhatsApp();
};

window.useTemplateBroadcast = (id) => {
  toast.info('Broadcast campaign created for target segment.');
};

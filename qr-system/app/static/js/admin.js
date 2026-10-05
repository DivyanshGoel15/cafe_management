/**
 * CAFE AROMA - TABLE & QR CODE MANAGEMENT LOGIC
 * Permanent QR Sticker Generation, Physical Printing, and Multi-Customer Session Aggregation
 */

(function () {
  'use strict';

  // --- State ---
  let tablesList = [];
  let selectedTable = null;

  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSearch();
    initModalControls();
    loadTables();
  });

  // 1. Tab Navigation
  function initTabs() {
    const tabTables = document.getElementById('btnTabTables');
    const tabSessions = document.getElementById('btnTabSessions');
    const secTables = document.getElementById('tabContentTables');
    const secSessions = document.getElementById('tabContentSessions');

    tabTables.addEventListener('click', () => {
      tabTables.classList.add('active');
      tabSessions.classList.remove('active');
      secTables.style.display = 'block';
      secSessions.style.display = 'none';
    });

    tabSessions.addEventListener('click', () => {
      tabSessions.classList.add('active');
      tabTables.classList.remove('active');
      secTables.style.display = 'none';
      secSessions.style.display = 'block';
      loadSessionAggregation();
    });
  }

  // 2. Load Tables & Permanent QR Data
  async function loadTables() {
    try {
      const res = await fetch('/qr/tables');
      if (!res.ok) throw new Error('Could not load tables');
      tablesList = await res.json();
      document.getElementById('totalTablesCount').textContent = tablesList.length;
      renderTablesGrid(tablesList);
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  function initSearch() {
    const searchInput = document.getElementById('tableSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = tablesList.filter(t => 
          `table ${t.table_number}`.includes(query) ||
          t.table_id.toLowerCase().includes(query) ||
          t.status.toLowerCase().includes(query)
        );
        renderTablesGrid(filtered);
      });
    }
  }

  // 3. Render Tables Grid
  function renderTablesGrid(tables) {
    const grid = document.getElementById('tablesGrid');
    if (!grid) return;

    if (tables.length === 0) {
      grid.innerHTML = `<p style="color:#94a3b8; padding:30px; text-align:center; grid-column:1/-1;">No tables found.</p>`;
      return;
    }

    let html = '';
    tables.forEach(t => {
      html += `
        <div class="table-admin-card" data-id="${t.table_id}">
          <div class="table-card-top">
            <h3 class="table-number-heading">Table ${t.table_number}</h3>
            <span class="table-status-pill ${t.status}">${t.status}</span>
          </div>

          <div class="table-qr-preview-box" data-id="${t.table_id}" title="Click to preview printable sticker">
            <img class="table-qr-img" src="${t.qr_image_data}" alt="Table ${t.table_number} QR Code">
          </div>

          <div class="table-meta-rows">
            <div>Capacity: <strong>${t.capacity} Guests</strong></div>
            <div>Permanent URL: <code>${t.permanent_url}</code></div>
            ${t.current_session_id ? `<div>Active Session: <strong>${t.current_session_id}</strong></div>` : ''}
          </div>

          <div class="table-card-actions">
            <button class="btn-card-action primary btn-preview-sticker" data-id="${t.table_id}">
              🏷️ Sticker Preview
            </button>
            <a href="/table/${t.table_id}" target="_blank" class="btn-card-action" title="Open Customer Menu in new tab">
              Menu ↗
            </a>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    // Attach Preview Click Handlers
    grid.querySelectorAll('.btn-preview-sticker, .table-qr-preview-box').forEach(el => {
      el.addEventListener('click', () => {
        const tId = el.getAttribute('data-id');
        const tbl = tablesList.find(x => x.table_id === tId);
        if (tbl) openStickerModal(tbl);
      });
    });
  }

  // 4. Sticker Preview Modal
  function openStickerModal(table) {
    selectedTable = table;
    document.getElementById('modalTableTitle').textContent = `Table ${table.table_number} Permanent Sticker`;
    document.getElementById('stickerTableNumber').textContent = `TABLE ${table.table_number}`;
    document.getElementById('stickerQrImage').src = table.qr_image_data;
    
    // Display URL without protocol
    const cleanUrl = table.permanent_url.replace(/^https?:\/\//, '');
    document.getElementById('stickerFooterUrl').textContent = cleanUrl;

    // Download button link
    const dlBtn = document.getElementById('btnDownloadQr');
    dlBtn.href = table.qr_image_data;
    dlBtn.download = `cafe_aroma_table_${table.table_number}_qr.png`;

    document.getElementById('qrModal').style.display = 'flex';
  }

  function initModalControls() {
    document.getElementById('closeQrModalBtn').addEventListener('click', () => {
      document.getElementById('qrModal').style.display = 'none';
    });

    // Print Sticker
    document.getElementById('btnPrintSticker').addEventListener('click', () => {
      window.print();
    });

    // Regenerate QR
    document.getElementById('btnRegenerateQr').addEventListener('click', async () => {
      if (!selectedTable) return;
      if (!confirm(`Are you sure you want to regenerate the QR code for Table ${selectedTable.table_number}? This is only recommended if the physical sticker is replaced.`)) {
        return;
      }

      try {
        const res = await fetch('/qr/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table_id: selectedTable.table_id,
            force_regenerate: true
          })
        });

        if (!res.ok) throw new Error('Regeneration failed');
        const updatedQr = await res.json();
        
        // Update current table
        selectedTable.qr_image_data = updatedQr.qr_image_data;
        document.getElementById('stickerQrImage').src = updatedQr.qr_image_data;

        showToast(`QR for Table ${selectedTable.table_number} regenerated successfully`, 'success');
        await loadTables();
      } catch (e) {
        showToast(e.message, 'error');
      }
    });

    // Close on backdrop
    const modal = document.getElementById('qrModal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // 5. Multi-Customer Dine-In Session Aggregation Inspector
  async function loadSessionAggregation() {
    const container = document.getElementById('sessionsContainer');
    if (!container) return;

    container.innerHTML = `<p style="color:#94a3b8; padding:20px; text-align:center;">Loading table sessions...</p>`;

    try {
      // Find all occupied tables or tables with sessions
      const sessionPromises = tablesList.map(async tbl => {
        try {
          const res = await fetch(`/tables/${tbl.table_id}`);
          if (res.ok) {
            const tableObj = await res.json();
            if (tableObj.current_session_id) {
              const sRes = await fetch(`/sessions/${tableObj.current_session_id}`);
              if (sRes.ok) {
                return await sRes.json();
              }
            }
          }
        } catch (e) {
          // Ignore
        }
        return null;
      });

      const sessionsResults = (await Promise.all(sessionPromises)).filter(s => s !== null);

      if (sessionsResults.length === 0) {
        container.innerHTML = `
          <div class="session-card">
            <p style="color:#94a3b8; text-align:center;">No active dine-in table sessions at the moment.</p>
            <p style="color:#64748b; font-size:0.85rem; text-align:center; margin-top:6px;">
              Open a customer menu link above to simulate multiple customers placing orders at a table!
            </p>
          </div>
        `;
        return;
      }

      let html = '';
      sessionsResults.forEach(item => {
        const sess = item.session;
        const orders = item.orders || [];

        let ordersHtml = '';
        if (orders.length === 0) {
          ordersHtml = `<tr><td colspan="5" style="text-align:center; color:#64748b;">No paid orders placed yet for this table session.</td></tr>`;
        } else {
          orders.forEach(o => {
            const itemsBrief = o.items.map(i => `${i.quantity}x ${i.item_name}`).join(', ');
            ordersHtml += `
              <tr>
                <td><strong>#${o.order_number}</strong></td>
                <td>👤 ${o.customer_name}</td>
                <td>${itemsBrief}</td>
                <td><span class="table-status-pill ${o.status}">${o.status}</span></td>
                <td><strong>₹${o.total_amount.toFixed(2)}</strong></td>
              </tr>
            `;
          });
        }

        html += `
          <div class="session-card">
            <div class="session-card-header">
              <div>
                <span class="session-table-badge">Table ${sess.table_number} Dine-In Session</span>
                <div style="font-size:0.8rem; color:#94a3b8; margin-top:2px;">
                  Session ID: <code>${sess.session_id}</code> • Seated Customers: <strong>${item.customer_count}</strong>
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.75rem; text-transform:uppercase; color:#94a3b8;">Table Total (Aggregated)</div>
                <div class="session-total-highlight">₹${sess.total_amount.toFixed(2)}</div>
              </div>
            </div>

            <table class="session-orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Dishes</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${ordersHtml}
              </tbody>
            </table>
          </div>
        `;
      });

      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = `<p style="color:#ef4444; padding:20px;">Error loading sessions: ${e.message}</p>`;
    }
  }

  function showToast(msg, type = 'info') {
    const toast = document.getElementById('adminToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.background = type === 'error' ? '#ef4444' : '#10b981';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.display = 'block';
    toast.style.zIndex = '999';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
  }

})();

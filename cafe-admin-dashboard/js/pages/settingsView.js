/* ══════════════════════════════════════════════════════════════
   BREW & CO — SETTINGS & CONFIGURATION VIEW CONTROLLER
   Business Profile, Restaurant rules, Security, Alerts & API Keys
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';

let settingsSubTab = 'business'; // 'business', 'restaurant', 'account', 'notifications'

export function renderSettings() {
  const state = store.getState();
  const el = document.getElementById('view-settings');
  if (!el) return;

  const s = state.settings;

  el.innerHTML = `
    <!-- Settings Header & Navigation Tabs -->
    <div class="section-header">
      <div>
        <div class="section-title">Settings &amp; Cafe Configuration</div>
        <div style="font-size:12px; color:var(--muted); margin-top:2px;">Manage operations, fiscal rules, account security &amp; alert policies</div>
      </div>
    </div>

    <div class="filter-tabs" style="margin-bottom:20px;">
      <button class="ftab ${settingsSubTab === 'business' ? 'active' : ''}" onclick="window.switchSettingsTab('business')">🏢 Business Profile</button>
      <button class="ftab ${settingsSubTab === 'restaurant' ? 'active' : ''}" onclick="window.switchSettingsTab('restaurant')">🍽️ Restaurant Rules &amp; Taxes</button>
      <button class="ftab ${settingsSubTab === 'account' ? 'active' : ''}" onclick="window.switchSettingsTab('account')">👤 Account &amp; Security</button>
      <button class="ftab ${settingsSubTab === 'notifications' ? 'active' : ''}" onclick="window.switchSettingsTab('notifications')">🔔 Notification Prefs</button>
    </div>

    <!-- Content Sections -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:24px; max-width:840px; box-shadow:var(--shadow-sm);">
      ${settingsSubTab === 'business' ? `
        <!-- 1. Business Profile -->
        <form onsubmit="window.saveBusinessProfile(event)">
          <div style="font-size:15px; font-weight:700; margin-bottom:4px;">Cafe Business Profile</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:18px;">Public profile displayed on receipts, WhatsApp and customer booking link.</div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cafe Trade Name *</label>
              <input type="text" class="form-input" id="set-biz-name" required value="${s.business.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Tagline / Brand Bio</label>
              <input type="text" class="form-input" id="set-biz-tagline" value="${s.business.tagline}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Contact Phone *</label>
              <input type="tel" class="form-input" id="set-biz-phone" required value="${s.business.phone}">
            </div>
            <div class="form-group">
              <label class="form-label">Official Email *</label>
              <input type="email" class="form-input" id="set-biz-email" required value="${s.business.email}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Full Street Address *</label>
            <textarea class="form-textarea" id="set-biz-address" required>${s.business.address}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">FSSAI Food License #</label>
              <input type="text" class="form-input" id="set-biz-fssai" value="${s.business.fssaiLicense}">
            </div>
            <div class="form-group">
              <label class="form-label">Operating Hours</label>
              <input type="text" class="form-input" id="set-biz-hours" value="${s.business.openingHours}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Instagram Handle</label>
              <input type="text" class="form-input" id="set-biz-insta" value="${s.business.instagram}">
            </div>
            <div class="form-group">
              <label class="form-label">Google Maps CID / URL</label>
              <input type="url" class="form-input" id="set-biz-maps" value="${s.business.googleMapsUrl}">
            </div>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary btn-sm">Save Business Profile</button>
          </div>
        </form>
      ` : settingsSubTab === 'restaurant' ? `
        <!-- 2. Restaurant Rules & Taxes -->
        <form onsubmit="window.saveRestaurantSettings(event)">
          <div style="font-size:15px; font-weight:700; margin-bottom:4px;">Restaurant Operations, Fiscal &amp; Tax Rules</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:18px;">Tax computations, service charge policies, and table turnover calculations.</div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">GST Tax Rate (%) *</label>
              <input type="number" min="0" max="28" step="0.5" class="form-input" id="set-tax-gst" required value="${s.restaurant.gstPercentage}">
              <div class="form-hint">Standard restaurant composite GST is 5%.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Service Charge (%)</label>
              <input type="number" min="0" max="20" step="0.5" class="form-input" id="set-tax-service" value="${s.restaurant.serviceChargePercentage}">
              <div class="form-hint">Optional discretionary charge.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Currency Symbol</label>
              <input type="text" class="form-input" id="set-tax-curr" value="${s.restaurant.currency}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Target Table Turnover (Mins)</label>
              <input type="number" min="15" max="180" class="form-input" id="set-turnover" value="${s.restaurant.turnoverMins}">
            </div>
            <div class="form-group">
              <label class="form-label">Max Party Size for Instant Booking</label>
              <input type="number" min="1" max="50" class="form-input" id="set-max-party" value="${s.restaurant.maxPartySize}">
            </div>
          </div>

          <div class="form-group" style="margin-top:10px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="set-auto-confirm" ${s.restaurant.autoConfirmBookings ? 'checked' : ''}>
              <span style="font-size:13px; font-weight:500;">Auto-confirm table reservations received via WhatsApp AI if table is available</span>
            </label>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary btn-sm">Save Restaurant Rules</button>
          </div>
        </form>
      ` : settingsSubTab === 'account' ? `
        <!-- 3. Account & Security -->
        <form onsubmit="window.saveAccountSecurity(event)">
          <div style="font-size:15px; font-weight:700; margin-bottom:4px;">Account Profile &amp; Security</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:18px;">Manage your login credentials, active sessions and two-factor authentication.</div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input type="password" class="form-input" id="set-curr-pass" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input type="password" class="form-input" id="set-new-pass" placeholder="Enter new strong password">
            </div>
          </div>

          <div style="padding:14px 16px; background:#FAFAF9; border:1px solid var(--border); border-radius:8px; margin:16px 0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; font-size:13.5px;">Two-Factor Authentication (2FA)</div>
                <div style="font-size:11.5px; color:var(--muted); margin-top:2px;">Requires an SMS OTP or Authenticator token on login.</div>
              </div>
              <label class="toggle">
                <input type="checkbox" checked onchange="window.toast.info('2FA settings updated')">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary btn-sm">Update Security Settings</button>
          </div>
        </form>
      ` : settingsSubTab === 'notifications' ? `
        <!-- 4. Notification Preferences -->
        <form onsubmit="window.saveNotificationPrefs(event)">
          <div style="font-size:15px; font-weight:700; margin-bottom:4px;">Notification Preferences</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:18px;">Choose which operational events trigger sound alerts, emails or WhatsApp ping.</div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            <label style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#FAFAF9; border:1px solid var(--border); border-radius:6px; cursor:pointer;">
              <div>
                <div style="font-weight:600;">Sound Alert on New Order / Booking</div>
                <div style="font-size:11.5px; color:var(--muted);">Plays a gentle counter chime in the browser.</div>
              </div>
              <input type="checkbox" id="set-notif-audio" ${s.notificationPrefs.audioChime ? 'checked' : ''}>
            </label>

            <label style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#FAFAF9; border:1px solid var(--border); border-radius:6px; cursor:pointer;">
              <div>
                <div style="font-weight:600;">Instant WhatsApp Alert to Manager</div>
                <div style="font-size:11.5px; color:var(--muted);">Forwards party reservations over 6 guests immediately.</div>
              </div>
              <input type="checkbox" id="set-notif-wa" ${s.notificationPrefs.whatsappAlerts ? 'checked' : ''}>
            </label>

            <label style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#FAFAF9; border:1px solid var(--border); border-radius:6px; cursor:pointer;">
              <div>
                <div style="font-weight:600;">End of Day Revenue Digest (Email)</div>
                <div style="font-size:11.5px; color:var(--muted);">Daily automated summary report dispatched at midnight.</div>
              </div>
              <input type="checkbox" id="set-notif-digest" ${s.notificationPrefs.dailyDigest ? 'checked' : ''}>
            </label>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary btn-sm">Save Preferences</button>
          </div>
        </form>
      ` : ''}
    </div>
  `;
}

window.switchSettingsTab = (tab) => {
  settingsSubTab = tab;
  renderSettings();
};

window.saveBusinessProfile = (e) => {
  e.preventDefault();
  store.updateSettings('business', {
    name: document.getElementById('set-biz-name').value.trim(),
    tagline: document.getElementById('set-biz-tagline').value.trim(),
    phone: document.getElementById('set-biz-phone').value.trim(),
    email: document.getElementById('set-biz-email').value.trim(),
    address: document.getElementById('set-biz-address').value.trim(),
    fssaiLicense: document.getElementById('set-biz-fssai').value.trim(),
    openingHours: document.getElementById('set-biz-hours').value.trim(),
    instagram: document.getElementById('set-biz-insta').value.trim(),
    googleMapsUrl: document.getElementById('set-biz-maps').value.trim()
  });
  toast.success('Business profile updated successfully!');
};

window.saveRestaurantSettings = (e) => {
  e.preventDefault();
  store.updateSettings('restaurant', {
    gstPercentage: parseFloat(document.getElementById('set-tax-gst').value),
    serviceChargePercentage: parseFloat(document.getElementById('set-tax-service').value),
    currency: document.getElementById('set-tax-curr').value.trim(),
    turnoverMins: parseInt(document.getElementById('set-turnover').value, 10),
    maxPartySize: parseInt(document.getElementById('set-max-party').value, 10),
    autoConfirmBookings: document.getElementById('set-auto-confirm').checked
  });
  toast.success('Restaurant and tax configuration updated.');
};

window.saveAccountSecurity = (e) => {
  e.preventDefault();
  toast.success('Account password and security preferences updated.');
};

window.saveNotificationPrefs = (e) => {
  e.preventDefault();
  store.updateSettings('notificationPrefs', {
    audioChime: document.getElementById('set-notif-audio').checked,
    whatsappAlerts: document.getElementById('set-notif-wa').checked,
    dailyDigest: document.getElementById('set-notif-digest').checked
  });
  toast.success('Notification preferences saved.');
};

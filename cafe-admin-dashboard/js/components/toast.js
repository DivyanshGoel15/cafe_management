/* ══════════════════════════════════════════════════════════════
   BREW & CO — TOAST NOTIFICATION COMPONENT
   ══════════════════════════════════════════════════════════════ */

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    let el = document.getElementById('toast-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-container';
      el.className = 'toast-container';
      document.body.appendChild(el);
    }
    this.container = el;
  }

  show(message, type = 'info', duration = 3500) {
    if (!this.container) this.init();

    const icons = {
      success: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2E7D55" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
      error: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C0392B" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      warning: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#B8860B" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#B87333" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.innerHTML = `
      <div style="flex-shrink:0; display:flex; align-items:center;">${icons[type] || icons.info}</div>
      <div style="flex:1; line-height:1.35; font-size:13px;">${message}</div>
      <button style="color:rgba(255,255,255,0.4); padding:2px; font-size:16px; line-height:1; cursor:pointer;" onclick="this.parentElement.remove()">×</button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px) scale(0.95)';
        toast.style.transition = 'all 0.25s ease';
        setTimeout(() => toast.remove(), 250);
      }
    }, duration);
  }

  success(msg, duration) { this.show(msg, 'success', duration); }
  error(msg, duration) { this.show(msg, 'error', duration); }
  warning(msg, duration) { this.show(msg, 'warning', duration); }
  info(msg, duration) { this.show(msg, 'info', duration); }
}

export const toast = new ToastManager();

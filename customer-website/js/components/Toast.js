/**
 * Global Toast Notification Manager
 */
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;
    let existing = document.getElementById('toast-container');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'toast-container';
      existing.className = 'toast-container';
      document.body.appendChild(existing);
    }
    this.container = existing;
  }

  show(message, type = 'info', duration = 3500) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '☕';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `
      <span style="font-size:1.1rem; line-height:1;">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.dismiss(toast));

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }
  }

  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  }
}

export const Toast = new ToastManager();

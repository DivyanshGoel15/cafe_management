/* ══════════════════════════════════════════════════════════════
   BREW & CO — MODAL & CONFIRMATION DIALOG MANAGER
   ══════════════════════════════════════════════════════════════ */

class ModalManager {
  constructor() {
    this.activeModal = null;
    this.activeDrawer = null;
    this.confirmCallback = null;
    this.initEvents();
  }

  initEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.activeModal) {
          this.close(this.activeModal.id);
        }
        if (this.activeDrawer) {
          this.closeDrawer(this.activeDrawer.id);
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.close(e.target.id);
      }
      if (e.target.classList.contains('drawer-backdrop')) {
        this.closeAllDrawers();
      }
    });
  }

  open(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.classList.add('show');
    this.activeModal = el;
    document.body.style.overflow = 'hidden';
  }

  close(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    el.classList.remove('show');
    if (this.activeModal === el) {
      this.activeModal = null;
    }
    if (!this.activeModal && !this.activeDrawer) {
      document.body.style.overflow = '';
    }
  }

  openDrawer(drawerId) {
    const el = document.getElementById(drawerId);
    const backdrop = document.getElementById('drawer-backdrop');
    if (!el) return;
    if (backdrop) backdrop.classList.add('show');
    el.classList.add('show');
    this.activeDrawer = el;
    document.body.style.overflow = 'hidden';
  }

  closeDrawer(drawerId) {
    const el = document.getElementById(drawerId);
    const backdrop = document.getElementById('drawer-backdrop');
    if (!el) return;
    el.classList.remove('show');
    if (backdrop) backdrop.classList.remove('show');
    if (this.activeDrawer === el) {
      this.activeDrawer = null;
    }
    if (!this.activeModal && !this.activeDrawer) {
      document.body.style.overflow = '';
    }
  }

  closeAllDrawers() {
    document.querySelectorAll('.drawer-panel').forEach(d => d.classList.remove('show'));
    const backdrop = document.getElementById('drawer-backdrop');
    if (backdrop) backdrop.classList.remove('show');
    this.activeDrawer = null;
    if (!this.activeModal) {
      document.body.style.overflow = '';
    }
  }

  confirm({ title, message, onConfirm, confirmText = 'Confirm', isDanger = false }) {
    let confirmModal = document.getElementById('modal-generic-confirm');
    if (!confirmModal) {
      confirmModal = document.createElement('div');
      confirmModal.id = 'modal-generic-confirm';
      confirmModal.className = 'modal-backdrop';
      confirmModal.innerHTML = `
        <div class="modal-box" style="max-width: 420px;">
          <div class="modal-header">
            <div class="modal-title" id="confirm-modal-title">Confirm Action</div>
            <button class="modal-close-btn" onclick="window.modal.close('modal-generic-confirm')">✕</button>
          </div>
          <div class="modal-body">
            <p id="confirm-modal-message" style="font-size:13.5px; color:var(--text); line-height:1.5;"></p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-generic-confirm')">Cancel</button>
            <button class="btn btn-sm" id="confirm-modal-action-btn">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmModal);
    }

    document.getElementById('confirm-modal-title').textContent = title || 'Confirm Action';
    document.getElementById('confirm-modal-message').textContent = message || 'Are you sure you want to proceed?';
    
    const actionBtn = document.getElementById('confirm-modal-action-btn');
    actionBtn.textContent = confirmText;
    actionBtn.className = `btn btn-sm ${isDanger ? 'btn-danger' : 'btn-primary'}`;

    actionBtn.onclick = () => {
      this.close('modal-generic-confirm');
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
    };

    this.open('modal-generic-confirm');
  }
}

export const modal = new ModalManager();
window.modal = modal;

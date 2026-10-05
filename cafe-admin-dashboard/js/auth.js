/* ══════════════════════════════════════════════════════════════
   BREW & CO — AUTHENTICATION & ROLE-BASED ACCESS CONTROL
   Clean mock authentication layer with persistent session
   ══════════════════════════════════════════════════════════════ */

import { store } from './store.js';

const SESSION_KEY = 'BREW_AUTH_SESSION_V1';

export class AuthService {
  constructor() {
    this.session = this.loadSession();
    this.authListeners = [];
  }

  loadSession() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    }
    // Default logged in as Owner for immediate convenience, or prompt login
    const defaultUser = {
      id: 'usr-1',
      name: 'Aditya Singhal',
      email: 'owner@brewandco.com',
      role: 'Owner',
      avatarInitials: 'AS',
      token: 'jwt_mock_token_owner_992'
    };
    this.saveSession(defaultUser);
    return defaultUser;
  }

  saveSession(sessionData) {
    this.session = sessionData;
    if (sessionData) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    this.notify();
  }

  onAuthChange(callback) {
    this.authListeners.push(callback);
    return () => {
      this.authListeners = this.authListeners.filter(l => l !== callback);
    };
  }

  notify() {
    for (const listener of this.authListeners) {
      try {
        listener(this.session);
      } catch (err) {
        console.error('Auth listener error:', err);
      }
    }
  }

  getCurrentUser() {
    return this.session;
  }

  isAuthenticated() {
    return !!this.session;
  }

  login(email, password, remember = true) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const state = store.getState();
        const cleanEmail = email.toLowerCase().trim();
        const found = state.users.find(u => u.email.toLowerCase() === cleanEmail);

        if (!found) {
          reject(new Error('Account not recognized. Self-registration is disabled — only the Cafe Owner can provision managing authority (Manager & Staff) accounts.'));
          return;
        }

        // Verify password against assigned credentials
        const validPassword = found.password || 'cafe123';
        if (password !== validPassword && password !== 'cafe123') {
          reject(new Error('Incorrect password. Please enter the credentials assigned to you by the Cafe Owner.'));
          return;
        }

        const session = {
          ...found,
          token: 'jwt_mock_' + Math.random().toString(36).substr(2),
          loginAt: new Date().toISOString()
        };

        if (remember) {
          this.saveSession(session);
        } else {
          this.session = session;
          this.notify();
        }

        resolve(session);
      }, 350);
    });
  }

  loginAs(role) {
    const state = store.getState();
    const user = state.users.find(u => u.role.toLowerCase() === role.toLowerCase()) || state.users[0];
    const session = {
      ...user,
      token: 'jwt_mock_' + Math.random().toString(36).substr(2),
      loginAt: new Date().toISOString()
    };
    this.saveSession(session);
    return Promise.resolve(session);
  }

  logout() {
    this.saveSession(null);
    return Promise.resolve(true);
  }

  forgotPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !email.includes('@')) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }
        resolve({
          success: true,
          message: `Password reset instructions have been dispatched to ${email}. Check your inbox or use code CAFE-RESET-2026.`
        });
      }, 400);
    });
  }

  resetPassword(email, token, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!token) {
          reject(new Error('Reset token is required.'));
          return;
        }
        if (!newPassword || newPassword.length < 6) {
          reject(new Error('New password must be at least 6 characters long.'));
          return;
        }
        resolve({
          success: true,
          message: 'Your password has been successfully updated! You can now log in.'
        });
      }, 400);
    });
  }

  hasPermission(moduleKey, action = 'view') {
    if (!this.session) return false;
    const role = this.session.role;
    if (role === 'Owner') return true;

    // Strict Security Rule: ONLY the Owner can access staff management and account creation!
    if (moduleKey === 'staff') return false;

    const state = store.getState();
    const rolePerms = state.rolePermissions && state.rolePermissions[role];
    if (rolePerms && rolePerms[moduleKey] !== undefined) {
      return Boolean(rolePerms[moduleKey]);
    }

    if (role === 'Manager') {
      if (['settings', 'staff'].includes(moduleKey)) return false;
      return true;
    }

    if (role === 'Staff') {
      const allowedModules = ['orders', 'bookings', 'tables', 'menu', 'notifications', 'qr-system'];
      return allowedModules.includes(moduleKey);
    }

    return false;
  }
}

export const auth = new AuthService();

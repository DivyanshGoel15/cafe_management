/**
 * ══════════════════════════════════════════════════════════════
 *  BREW & CO — MODULE PROCESS & LIFECYCLE MANAGER
 *  Detects, starts, stops, monitors, and isolates module services.
 *  Prevents crashes in one module from affecting the rest.
 * ══════════════════════════════════════════════════════════════
 */
import { spawn } from 'child_process';
import net from 'net';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MODULE_ALIASES = {
  'customerwebsite': 'customer-website',
  'customer_website': 'customer-website',
  'customer-website': 'customer-website',
  'admindashboard': 'cafe-admin-dashboard',
  'cafe_admin_dashboard': 'cafe-admin-dashboard',
  'cafe-admin-dashboard': 'cafe-admin-dashboard',
  'qrsystem': 'qr-system',
  'qr_system': 'qr-system',
  'qr-system': 'qr-system',
  'whatsappautomation': 'whatsapp-automation',
  'whatsapp_automation': 'whatsapp-automation',
  'whatsapp-automation': 'whatsapp-automation',
  'aicalling': 'ai-calling',
  'ai_calling': 'ai-calling',
  'ai-calling': 'ai-calling'
};

export function normalizeModuleId(id) {
  if (!id) return null;
  const clean = String(id).toLowerCase().replace(/[\s_-]/g, '');
  return MODULE_ALIASES[clean] || MODULE_ALIASES[String(id).toLowerCase()] || id;
}

export function isPortOpen(port, host = 'localhost', timeout = 600) {
  return new Promise(resolve => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      if (host === 'localhost') {
        const fallback = new net.Socket();
        fallback.setTimeout(timeout);
        fallback.once('connect', () => { fallback.destroy(); resolve(true); });
        fallback.once('timeout', () => { fallback.destroy(); resolve(false); });
        fallback.once('error', () => { fallback.destroy(); resolve(false); });
        fallback.connect(port, '127.0.0.1');
      } else {
        resolve(false);
      }
    });
    socket.connect(port, host);
  });
}

function getDefaultConfig() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'modules.config.json'), 'utf8'));
  } catch {
    return { modules: {} };
  }
}

class ModuleProcessManager {
  constructor() {
    this.processes = new Map(); // canonicalId -> child_process
    this.errors = new Map();    // canonicalId -> string error message
    this.stopping = new Set();  // canonicalId -> boolean

    // Handle process exits gracefully
    process.on('SIGINT', () => this.stopAll());
    process.on('SIGTERM', () => this.stopAll());
    process.on('exit', () => this.stopAll());
  }

  async getStatus(rawId, modConfig = null) {
    const canonicalId = normalizeModuleId(rawId);
    if (!modConfig) {
      const cfg = getDefaultConfig();
      modConfig = cfg?.modules?.[canonicalId];
    }

    if (!modConfig) {
      return {
        id: canonicalId,
        detected: false,
        status: 'missing',
        error: `Module configuration for '${rawId}' not found`
      };
    }

    const modDir = path.resolve(__dirname, modConfig.path || `./${canonicalId}`);
    const detected = fs.existsSync(modDir);

    if (!detected) {
      return {
        id: canonicalId,
        name: modConfig.name,
        detected: false,
        status: 'missing',
        enabled: !!modConfig.enabled,
        port: modConfig.port,
        error: `Module directory not found on disk at '${modConfig.path}'`
      };
    }

    const portOpen = await isPortOpen(modConfig.port);
    const childProc = this.processes.get(canonicalId);
    const running = portOpen || (childProc && !childProc.killed);
    const lastError = this.errors.get(canonicalId);

    let status = 'stopped';
    if (running) {
      status = 'running';
    } else if (lastError) {
      status = 'error';
    }

    return {
      id: canonicalId,
      name: modConfig.name,
      type: modConfig.type,
      detected: true,
      status,
      running,
      enabled: !!modConfig.enabled,
      port: modConfig.port,
      portOpen,
      pid: childProc?.pid || null,
      error: running ? null : (lastError || null)
    };
  }

  async getAllStatuses(config = null) {
    if (!config) config = getDefaultConfig();
    const result = {};
    if (!config || !config.modules) return result;
    for (const [id, mod] of Object.entries(config.modules)) {
      result[id] = await this.getStatus(id, mod);
    }
    return result;
  }

  async startModule(rawId, modConfig = null) {
    const canonicalId = normalizeModuleId(rawId);
    if (!modConfig) {
      const cfg = getDefaultConfig();
      modConfig = cfg?.modules?.[canonicalId];
    }

    if (!modConfig) {
      return { success: false, error: `Module '${rawId}' is not configured.` };
    }

    const modDir = path.resolve(__dirname, modConfig.path || `./${canonicalId}`);
    if (!fs.existsSync(modDir)) {
      this.errors.set(canonicalId, `Directory '${modConfig.path}' does not exist on disk.`);
      return { success: false, error: `Module '${canonicalId}' directory missing.`, status: 'missing' };
    }

    // Check if port is already running
    const portOpen = await isPortOpen(modConfig.port);
    if (portOpen) {
      this.errors.delete(canonicalId);
      return {
        success: true,
        message: `Module '${modConfig.name}' is already running on port ${modConfig.port}.`,
        status: 'running'
      };
    }

    try {
      this.errors.delete(canonicalId);
      const cmdStr = modConfig.startCommand || 'npm run dev';

      const child = spawn(cmdStr, [], {
        cwd: modDir,
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          PORT: String(modConfig.port),
          HUB_URL: 'http://localhost:4000',
          MOCK_MODE: 'true',
          PYTHONUNBUFFERED: '1'
        }
      });

      this.processes.set(canonicalId, child);

      child.stderr?.on('data', chunk => {
        const text = chunk.toString();
        if (text.includes('Error:') || text.includes('Traceback')) {
          this.errors.set(canonicalId, text.slice(0, 400));
        }
      });

      child.on('error', err => {
        this.errors.set(canonicalId, err.message);
        this.processes.delete(canonicalId);
      });

      child.on('exit', (code, signal) => {
        this.processes.delete(canonicalId);
        if (code !== 0 && code !== null && !this.stopping.has(canonicalId)) {
          this.errors.set(canonicalId, `Exited with status code ${code}`);
        }
      });

      return {
        success: true,
        message: `Started module '${modConfig.name}' (PID: ${child.pid}) on port ${modConfig.port}.`,
        pid: child.pid,
        status: 'running'
      };
    } catch (err) {
      this.errors.set(canonicalId, err.message);
      return { success: false, error: err.message, status: 'error' };
    }
  }

  async stopModule(rawId, modConfig = null) {
    const canonicalId = normalizeModuleId(rawId);
    if (!modConfig) {
      const cfg = getDefaultConfig();
      modConfig = cfg?.modules?.[canonicalId];
    }

    this.stopping.add(canonicalId);

    const child = this.processes.get(canonicalId);
    if (child && child.pid) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
        } else {
          child.kill('SIGTERM');
        }
      } catch (e) {}
      this.processes.delete(canonicalId);
    }

    // If port still occupied by external process on Windows, kill port owner
    if (modConfig && modConfig.port) {
      try {
        if (process.platform === 'win32') {
          const findCmd = `for /f "tokens=5" %a in ('netstat -aon ^| findstr :${modConfig.port} ^| findstr LISTENING') do taskkill /F /PID %a`;
          spawn('cmd.exe', ['/c', findCmd], { stdio: 'ignore' });
        }
      } catch (e) {}
    }

    setTimeout(() => this.stopping.delete(canonicalId), 1000);
    this.errors.delete(canonicalId);

    return {
      success: true,
      message: `Stopped module '${canonicalId}'.`,
      status: 'stopped'
    };
  }

  async restartModule(rawId, modConfig = null) {
    await this.stopModule(rawId, modConfig);
    await new Promise(r => setTimeout(r, 600));
    return await this.startModule(rawId, modConfig);
  }

  async startAll(config = null) {
    if (!config) config = getDefaultConfig();
    const results = {};
    for (const [id, mod] of Object.entries(config.modules || {})) {
      results[id] = await this.startModule(id, mod);
    }
    return results;
  }

  async stopAll(config = null) {
    if (!config) config = getDefaultConfig();
    const results = {};
    for (const [id, mod] of Object.entries(config.modules || {})) {
      results[id] = await this.stopModule(id, mod);
    }
    return results;
  }

  async startAllEnabled(config = null) {
    if (!config) config = getDefaultConfig();
    if (!config || !config.modules) return {};
    const results = {};
    for (const [id, mod] of Object.entries(config.modules)) {
      if (mod.enabled) {
        try {
          results[id] = await this.startModule(id, mod);
        } catch (err) {
          results[id] = { success: false, error: err.message };
        }
      }
    }
    return results;
  }
}

export const moduleProcessManager = new ModuleProcessManager();

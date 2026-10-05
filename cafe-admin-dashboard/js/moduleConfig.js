/* ══════════════════════════════════════════════════════════════
   BREW & CO — MODULE CONFIG BRIDGE
   Reads modules.config.json from the hub and controls which
   sidebar navigation items and page views are visible.
   This creates seamless integration between the hub toggles
   and the admin dashboard.
   ══════════════════════════════════════════════════════════════ */

// Module-to-route mapping
// Maps module IDs from modules.config.json to admin dashboard route names
const MODULE_ROUTE_MAP = {
  'whatsapp-automation': ['whatsapp'],
  'ai-calling': ['ai-calling'],
  'qr-system': ['qr-system'],
  // The admin dashboard and customer website don't disable their own routes
  // but the hub can control whether they're accessible from the command center
};

// Hub API URL (dynamic in production, localhost in development)
const HUB_API_URL = (typeof window !== 'undefined' && window.location.origin) ? `${window.location.origin}/api/config` : 'http://localhost:4000/api/config';

// Cache for module config (avoid hammering the API)
let _cachedConfig = null;
let _lastFetch = 0;
const CACHE_TTL_MS = 10000; // Refresh every 10 seconds

/**
 * Fetch module config from the hub server.
 * Falls back gracefully — if hub is down, all modules stay enabled.
 */
export async function fetchModuleConfig() {
  const now = Date.now();
  if (_cachedConfig && (now - _lastFetch) < CACHE_TTL_MS) {
    return _cachedConfig;
  }

  try {
    const res = await fetch(HUB_API_URL, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      _cachedConfig = await res.json();
      _lastFetch = now;
      return _cachedConfig;
    }
  } catch (err) {
    // Hub not running or unreachable — return null (all modules stay visible)
    console.warn('[ModuleConfig] Hub unreachable, all modules enabled by default:', err.message);
  }
  return null;
}

/**
 * Check if a specific route/module is enabled in the hub config.
 * If the hub is not running, defaults to true (enabled).
 */
export function isModuleEnabled(config, routeName) {
  if (!config || !config.modules) return true;

  // Direct mapping check
  for (const [moduleId, routes] of Object.entries(MODULE_ROUTE_MAP)) {
    if (routes.includes(routeName)) {
      const mod = config.modules[moduleId];
      return mod ? mod.enabled !== false : true;
    }
  }

  // No mapping found = always enabled (core dashboard features)
  return true;
}

/**
 * Apply module visibility to the sidebar navigation.
 * Hides sidebar items whose backing module is disabled in the hub.
 */
export function applyModuleVisibility(config) {
  if (!config) return;

  document.querySelectorAll('.sb-item[data-route]').forEach(item => {
    const route = item.getAttribute('data-route');
    const enabled = isModuleEnabled(config, route);

    // Only override visibility for hub-controlled modules
    // Don't touch core dashboard routes
    if (MODULE_ROUTE_MAP && Object.values(MODULE_ROUTE_MAP).flat().includes(route)) {
      if (!enabled) {
        item.style.display = 'none';
        // Also hide the corresponding page view
        const viewEl = document.getElementById(`view-${route}`);
        if (viewEl) {
          viewEl.innerHTML = `
            <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:44px 24px; text-align:center; max-width:560px; margin:40px auto; box-shadow:var(--shadow-sm);">
              <div style="width:64px; height:64px; border-radius:50%; background:var(--amber-bg,rgba(251,191,36,0.12)); color:#FBBF24; font-size:32px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">
                🔌
              </div>
              <div style="font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px;">Module Disabled</div>
              <p style="font-size:13.5px; color:var(--muted); line-height:1.5; margin-bottom:20px;">
                This module has been turned off from the <strong>Hub Command Center</strong>.
                Go to <code>http://localhost:4000</code> or edit <code>modules.config.json</code> to re-enable it.
              </p>
              <div style="display:flex; justify-content:center; gap:10px;">
                <button class="btn btn-outline btn-sm" onclick="window.router.navigate('dashboard')">← Return to Dashboard</button>
                <a href="http://localhost:4000" target="_blank" class="btn btn-primary btn-sm" style="text-decoration:none;">Open Hub →</a>
              </div>
            </div>
          `;
        }
      }
      // If enabled, don't force display:flex here, let the RBAC system handle it
    }
  });

  // Re-run section label visibility
  document.querySelectorAll('.sb-nav-wrap .sb-section-label').forEach(label => {
    let next = label.nextElementSibling;
    let hasVisibleItem = false;
    while (next && !next.classList.contains('sb-section-label')) {
      if (next.classList.contains('sb-item') && next.style.display !== 'none') {
        hasVisibleItem = true;
        break;
      }
      next = next.nextElementSibling;
    }
    label.style.display = hasVisibleItem ? 'block' : 'none';
  });
}

/**
 * Get integration status — check if a specific cross-module integration is active.
 */
export function isIntegrationActive(config, integrationKey) {
  if (!config || !config.integrations) return true;
  return config.integrations[integrationKey] !== false;
}

/**
 * Initialize module config bridge — call on app startup.
 */
export async function initModuleConfig() {
  const config = await fetchModuleConfig();
  if (config) {
    applyModuleVisibility(config);
  }

  // Periodically re-check (so hub toggle changes are reflected live)
  setInterval(async () => {
    const freshConfig = await fetchModuleConfig();
    if (freshConfig) {
      applyModuleVisibility(freshConfig);
    }
  }, 15000); // Every 15 seconds

  return config;
}

import { contextBridge, ipcRenderer } from 'electron';

const isolatedPatches = ipcRenderer.sendSync('lgx:isolated-bootstrap') as Array<{ worldId: number; token: string }>;
for (const patch of isolatedPatches) {
  contextBridge.exposeInIsolatedWorld(patch.worldId, 'LGX', {
    net: { fetch: (url: string, options?: unknown) => ipcRenderer.invoke('lgx:net-fetch', { token: patch.token, url, options }) },
    log: (...args: unknown[]) => console.info('[lg-native patch]', ...args),
  });
}

type IPCValue = unknown;
type PatchReport = { siteVer: string; entries: Array<{ patchId: string; status: string; reason?: string; siteVer: string }>; safeMode: boolean; generatedAt: string };

const allowed = new Set(['lgx:notify', 'lgx:open-window', 'lgx:net-fetch', 'lgx:patch-report']);
const invoke = (channel: string, value?: IPCValue): Promise<unknown> => {
  if (!allowed.has(channel)) return Promise.reject(new Error('ipc-channel-denied'));
  return ipcRenderer.invoke(channel, value);
};

const exposed = new Map<string, unknown>();
const listeners = new Map<string, Set<(data: unknown) => void>>();
const lgx = {
  version: () => ({ siteVer: '' }),
  expose: (name: string, value: unknown) => { exposed.set(name, value); },
  get: (name: string) => exposed.get(name),
  hook: (obj: Record<string, unknown>, method: string, wrapper: (original: (...args: unknown[]) => unknown, ...args: unknown[]) => unknown) => {
    const original = obj[method];
    if (typeof original !== 'function') throw new Error(`method-not-found:${method}`);
    const fn = original as (...args: unknown[]) => unknown;
    obj[method] = (...args: unknown[]) => wrapper(fn.bind(obj), ...args);
    return () => { obj[method] = original; };
  },
  ready: async (feature: string, timeoutMs = 5000): Promise<unknown> => {
    const end = Date.now() + timeoutMs;
    while (Date.now() < end) {
      const value = feature.startsWith('global:') ? (globalThis as Record<string, unknown>)[feature.slice(7)] : document.querySelector(feature);
      if (value) return value;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error(`timeout:${feature}`);
  },
  on: (event: string, fn: (data: unknown) => void) => {
    const set = listeners.get(event) ?? new Set<(data: unknown) => void>();
    set.add(fn); listeners.set(event, set); return () => set.delete(fn);
  },
  emit: (event: string, data?: unknown) => { for (const fn of listeners.get(event) ?? []) fn(data); },
  settings: (patchId: string) => { console.debug(`[lg-native:${patchId}] settings requested`); return {}; },
  log: (patchId: string, ...args: unknown[]) => console.info(`[lg-native:${patchId}]`, ...args),
  patchReport: () => invoke('lgx:patch-report') as Promise<PatchReport[]>,
  native: {
    notify: (title: string, body: string) => invoke('lgx:notify', { title, body }).then(() => undefined),
    openWindow: (url: string) => invoke('lgx:open-window', { url }).then(() => undefined),
  },
  net: {
    fetch: (url: string, options?: { method?: string; headers?: Record<string, string>; body?: string }) => invoke('lgx:net-fetch', { url, options }) as Promise<{ status: number; headers: Record<string, string>; body: string }>,
  },
};

contextBridge.exposeInMainWorld('LGX', lgx);

function printPatchReport(attempt = 0): void {
  void lgx.patchReport().then((reports) => {
    if (reports.length === 0 && attempt < 5) {
      window.setTimeout(() => printPatchReport(attempt + 1), 1000);
      return;
    }
    const entries = reports.flatMap((report) => report.entries);
    console.info('[lg-native] patch reports', { reports, entries });
  }).catch((error: unknown) => console.warn('[lg-native] patch report unavailable', error));
}

if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', () => window.setTimeout(() => printPatchReport(), 1000), { once: true });
else window.setTimeout(() => printPatchReport(), 1000);

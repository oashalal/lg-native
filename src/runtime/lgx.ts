export interface LGXBridge {
  version: () => { siteVer: string; account?: string };
  expose: (name: string, value: unknown) => void;
  get: (name: string) => unknown;
  hook: (obj: Record<string, unknown>, method: string, wrapper: (original: (...args: unknown[]) => unknown, ...args: unknown[]) => unknown) => () => void;
  ready: (feature: string, timeoutMs?: number) => Promise<unknown>;
  on: (event: string, fn: (data: unknown) => void) => () => void;
  emit: (event: string, data?: unknown) => void;
  settings: (patchId: string) => Record<string, unknown>;
  log: (patchId: string, ...args: unknown[]) => void;
  native: { notify: (title: string, body: string) => Promise<void>; openWindow: (url: string) => Promise<void> };
  net: { fetch: (url: string, options?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ status: number; headers: Record<string, string>; body: string }> };
}

export function createLGX(deps: { siteVer: string; account?: string; settings: (id: string) => Record<string, unknown>; ipc: (channel: string, value: unknown) => Promise<unknown>; log: (id: string, args: unknown[]) => void }): LGXBridge {
  const exposed = new Map<string, unknown>(); const listeners = new Map<string, Set<(data: unknown) => void>>();
  const bridge: LGXBridge = {
    version: () => deps.account === undefined ? { siteVer: deps.siteVer } : { siteVer: deps.siteVer, account: deps.account }, expose: (name, value) => { exposed.set(name, value); }, get: (name) => exposed.get(name),
    hook: (obj, method, wrapper) => { const original = obj[method]; if (typeof original !== 'function') throw new Error(`method-not-found:${method}`); const fn = original as (...args: unknown[]) => unknown; obj[method] = (...args: unknown[]) => wrapper(fn.bind(obj), ...args); return () => { obj[method] = original; }; },
    ready: async (feature, timeoutMs = 5000) => { const end = Date.now() + timeoutMs; while (Date.now() < end) { const value = feature.startsWith('global:') ? (globalThis as Record<string, unknown>)[feature.slice(7)] : document.querySelector(feature); if (value) return value; await new Promise((resolve) => setTimeout(resolve, 50)); } throw new Error(`timeout:${feature}`); },
    on: (event, fn) => { const set = listeners.get(event) ?? new Set(); set.add(fn); listeners.set(event, set); return () => set.delete(fn); }, emit: (event, data) => { for (const fn of listeners.get(event) ?? []) fn(data); }, settings: deps.settings, log: (id, ...args) => deps.log(id, args),
    native: { notify: (title, body) => deps.ipc('lgx:notify', { title, body }).then(() => undefined), openWindow: (url) => deps.ipc('lgx:open-window', { url }).then(() => undefined) },
    net: { fetch: (url, options) => deps.ipc('lgx:net-fetch', { url, options }) as Promise<{ status: number; headers: Record<string, string>; body: string }> },
  }; return bridge;
}

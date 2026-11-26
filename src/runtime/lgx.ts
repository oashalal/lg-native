import { createUI } from './ui.js';

// Serialized into app.js; dependencies are passed explicitly because imports are not captured.
export function installPageLGX(siteVer: string, patchSettings: Record<string, Record<string, unknown>>, createUIHelper: typeof createUI): void {
  const exposed = new Map<string, unknown>();
  const listeners = new Map<string, Set<(data: unknown) => void>>();
  const cleanups = new Set<() => void>();
  const patchRoots = new Map<string, HTMLElement>();
  const cleanupFor = (fn: () => void): (() => void) => { cleanups.add(fn); return () => { cleanups.delete(fn); }; };
  const sharedUI = createUIHelper('', {}, cleanupFor);
  const bridge = (globalThis as unknown as { __lgNative?: { patchReport: () => Promise<unknown>; notify: (title: string, body: string) => Promise<void>; openWindow: (url: string) => Promise<void> } }).__lgNative;
  const MAX_JSON_BYTES = 64 * 1024;
  const MAX_JSON_DEPTH = 8;
  const channelListeners = new Set<(value: unknown) => void>();
  let channelWindow = 0; let channelCount = 0;
  const jsonValue = (value: unknown, depth = 0): unknown => {
    if (depth > MAX_JSON_DEPTH) throw new Error('channel-depth');
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (Array.isArray(value)) return value.map((item) => jsonValue(item, depth + 1));
    if (typeof value === 'object') { const result: Record<string, unknown> = {}; for (const [key, item] of Object.entries(value as Record<string, unknown>)) result[key] = jsonValue(item, depth + 1); return result; }
    throw new Error('channel-json');
  };
  const channelSend = (value: unknown): void => {
    const now = Date.now(); if (now - channelWindow >= 1000) { channelWindow = now; channelCount = 0; }
    if (++channelCount > 30) throw new Error('channel-rate-limit');
    const safe = jsonValue(value); if (JSON.stringify(safe).length > MAX_JSON_BYTES) throw new Error('channel-too-large');
    for (const listener of channelListeners) listener(safe);
  };
  const lgx = {
    version: () => ({ siteVer }),
    expose: (name: string, ...values: unknown[]) => {
      if (values.length) exposed.set(name, values[0]);
      return exposed.get(name);
    },
    get: (name: string) => exposed.get(name),
    hook: (obj: Record<string, unknown>, method: string, wrapper: (original: (...args: unknown[]) => unknown, ...args: unknown[]) => unknown) => {
      const original = obj[method];
      if (typeof original !== 'function') throw new Error(`method-not-found:${method}`);
      const fn = original as (...args: unknown[]) => unknown;
      obj[method] = function (this: unknown, ...args: unknown[]) { return wrapper(fn.bind(this), ...args); };
      return () => { obj[method] = original; };
    },
    ready: async (feature: string, timeoutMs = 5000): Promise<unknown> => { if (!feature.startsWith('global:')) return sharedUI.ready(feature, timeoutMs); const end = Date.now() + timeoutMs; while (Date.now() < end) { const value = (globalThis as unknown as Record<string, unknown>)[feature.slice(7)]; if (value) return value; await new Promise((resolve) => setTimeout(resolve, 50)); } throw new Error(`timeout:${feature}`); },
    on: (event: string, fn: (data: unknown) => void) => { const set = listeners.get(event) ?? new Set(); set.add(fn); listeners.set(event, set); const off = () => set.delete(fn); cleanups.add(off); return off; },
    emit: (event: string, data?: unknown) => { for (const fn of listeners.get(event) ?? []) fn(data); },
    settings: (id: string) => createUIHelper(id, patchSettings[id] ?? {}, cleanupFor).settings(),
    log: (id: string, ...args: unknown[]) => console.info(`[lg-native:${id}]`, ...args),
     patchReport: () => bridge ? bridge.patchReport() : Promise.reject(new Error('bridge-unavailable')),
     channel: { send: channelSend, on: (fn: (value: unknown) => void) => { channelListeners.add(fn); const off = () => channelListeners.delete(fn); cleanups.add(off); return off; } },
     ui: { text: (value: unknown) => document.createTextNode(String(value)), jsonView: (value: unknown) => document.createTextNode(JSON.stringify(jsonValue(value))) },
     native: {
      notify: (title: string, body: string) => bridge ? bridge.notify(title, body) : Promise.reject(new Error('bridge-unavailable')),
      openWindow: (url: string) => bridge ? bridge.openWindow(url) : Promise.reject(new Error('bridge-unavailable')),
    },
    onCleanup: (fn: () => void) => { cleanups.add(fn); return () => cleanups.delete(fn); },
     dispose: () => { sharedUI.dispose(); for (const cleanup of [...cleanups]) { try { cleanup(); } catch { /* best effort */ } } cleanups.clear(); for (const root of patchRoots.values()) root.remove(); patchRoots.clear(); },
     theme: sharedUI.theme,
     mount: sharedUI.mount,
     hud: sharedUI.hud,
     modal: sharedUI.modal,
  };
  (globalThis as unknown as { LGX: typeof lgx }).LGX = lgx;
}

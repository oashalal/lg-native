// This function is serialized into app.js and must not capture module variables.
export function installPageLGX(siteVer: string, patchSettings: Record<string, Record<string, unknown>>): void {
  const exposed = new Map<string, unknown>();
  const listeners = new Map<string, Set<(data: unknown) => void>>();
  const bridge = (globalThis as unknown as { __lgNative?: { patchReport: () => Promise<unknown>; notify: (title: string, body: string) => Promise<void>; openWindow: (url: string) => Promise<void> } }).__lgNative;
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
    ready: async (feature: string, timeoutMs = 5000): Promise<unknown> => {
      const end = Date.now() + timeoutMs;
      while (Date.now() < end) {
        const value = feature.startsWith('global:') ? (globalThis as unknown as Record<string, unknown>)[feature.slice(7)] : document.querySelector(feature);
        if (value) return value;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      throw new Error(`timeout:${feature}`);
    },
    on: (event: string, fn: (data: unknown) => void) => { const set = listeners.get(event) ?? new Set(); set.add(fn); listeners.set(event, set); return () => set.delete(fn); },
    emit: (event: string, data?: unknown) => { for (const fn of listeners.get(event) ?? []) fn(data); },
    settings: (id: string) => ({ ...(patchSettings[id] ?? {}) }),
    log: (id: string, ...args: unknown[]) => console.info(`[lg-native:${id}]`, ...args),
    patchReport: () => bridge ? bridge.patchReport() : Promise.reject(new Error('bridge-unavailable')),
    native: {
      notify: (title: string, body: string) => bridge ? bridge.notify(title, body) : Promise.reject(new Error('bridge-unavailable')),
      openWindow: (url: string) => bridge ? bridge.openWindow(url) : Promise.reject(new Error('bridge-unavailable')),
    },
    net: { fetch: () => Promise.reject(new Error('patch-network-unavailable')) },
  };
  (globalThis as unknown as { LGX: typeof lgx }).LGX = lgx;
}

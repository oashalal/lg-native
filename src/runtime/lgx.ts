// This function is serialized into app.js and must not capture module variables.
export function installPageLGX(siteVer: string, patchSettings: Record<string, Record<string, unknown>>): void {
  const exposed = new Map<string, unknown>();
  const listeners = new Map<string, Set<(data: unknown) => void>>();
  const cleanups = new Set<() => void>();
  const patchRoots = new Map<string, HTMLElement>();
  const bridge = (globalThis as unknown as { __lgNative?: { patchReport: () => Promise<unknown>; notify: (title: string, body: string) => Promise<void>; openWindow: (url: string) => Promise<void>; netFetch?: (patchId: string, url: string, signal: AbortSignal) => Promise<unknown> } }).__lgNative;
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
    on: (event: string, fn: (data: unknown) => void) => { const set = listeners.get(event) ?? new Set(); set.add(fn); listeners.set(event, set); const off = () => set.delete(fn); cleanups.add(off); return off; },
    emit: (event: string, data?: unknown) => { for (const fn of listeners.get(event) ?? []) fn(data); },
    settings: (id: string) => ({ ...(patchSettings[id] ?? {}) }),
    log: (id: string, ...args: unknown[]) => console.info(`[lg-native:${id}]`, ...args),
    patchReport: () => bridge ? bridge.patchReport() : Promise.reject(new Error('bridge-unavailable')),
    native: {
      notify: (title: string, body: string) => bridge ? bridge.notify(title, body) : Promise.reject(new Error('bridge-unavailable')),
      openWindow: (url: string) => bridge ? bridge.openWindow(url) : Promise.reject(new Error('bridge-unavailable')),
    },
    onCleanup: (fn: () => void) => { cleanups.add(fn); return () => cleanups.delete(fn); },
    dispose: () => { for (const cleanup of [...cleanups]) { try { cleanup(); } catch { /* best effort */ } } cleanups.clear(); for (const root of patchRoots.values()) root.remove(); patchRoots.clear(); },
    theme: () => { const style = getComputedStyle(document.documentElement); const names = ['--bg', '--surface', '--ink', '--accent', '--line', '--gu-bg', '--gu-acc', '--gu-fg']; const values: Record<string, string> = { skin: document.documentElement.dataset.skin ?? '' }; for (const name of names) values[name] = style.getPropertyValue(name).trim(); return values; },
    mount: (id: string, node: HTMLElement | string) => { let root = patchRoots.get(id); if (!root) { root = document.createElement('div'); root.dataset.lgNativePatch = id; document.body.append(root); patchRoots.set(id, root); } root.replaceChildren(typeof node === 'string' ? (() => { const fragment = document.createRange().createContextualFragment(node); return fragment; })() : node); return root; },
    modal: (id: string, content: HTMLElement | string) => {
      const previous = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
      const overlay = document.createElement('div'); overlay.dataset.lgNativeModal = id; overlay.setAttribute('role', 'presentation');
      const dialog = document.createElement('div'); dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true'); dialog.tabIndex = -1; dialog.style.cssText = 'background:var(--surface,var(--gu-bg,#20242b));color:var(--ink,var(--gu-fg,#fff));max-width:min(560px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;padding:16px;border:1px solid var(--line,var(--gu-line,#555));border-radius:8px);';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:rgb(0 0 0 / .55);'; dialog.replaceChildren(typeof content === 'string' ? (() => { const fragment = document.createRange().createContextualFragment(content); return fragment; })() : content); overlay.append(dialog); document.body.append(overlay); const previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
      const close = () => { overlay.remove(); document.body.style.overflow = previousOverflow; previous?.focus(); cleanups.delete(close); }; const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); if (event.key === 'Tab') { const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button,a,input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter((item) => !item.hasAttribute('disabled')); if (!focusable.length) { event.preventDefault(); dialog.focus(); return; } const first = focusable[0]!; const last = focusable[focusable.length - 1]!; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } }; overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); }); overlay.addEventListener('keydown', keydown); cleanups.add(() => { overlay.removeEventListener('keydown', keydown); close(); }); dialog.focus(); return { element: overlay, close };
    },
    net: { fetch: (patchId: string, url: string, options?: { signal?: AbortSignal }) => { const controller = new AbortController(); const signal = options?.signal; const abort = () => controller.abort(); signal?.addEventListener('abort', abort, { once: true }); const promise = bridge && bridge.netFetch ? bridge.netFetch(patchId, url, controller.signal) : Promise.reject(new Error('patch-network-unavailable')); return promise.finally(() => signal?.removeEventListener('abort', abort)); } },
  };
  (globalThis as unknown as { LGX: typeof lgx }).LGX = lgx;
}

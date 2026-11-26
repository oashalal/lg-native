// Serialized into both page and isolated worlds. Keep this function self-contained.
export function createUI(
  _patchId: string,
  settings: Record<string, unknown>,
  onCleanup: (fn: () => void) => () => void,
) {
  const cleanups = new Set<() => void>();
  let disposed = false;
  const register = (fn: () => void) => {
    let active = true;
    const wrapped = () => { if (!active) return; active = false; cleanups.delete(wrapped); unregister(); fn(); };
    const unregister = onCleanup(wrapped);
    cleanups.add(wrapped);
    return wrapped;
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    for (const cleanup of [...cleanups]) { try { cleanup(); } catch { /* best effort */ } }
    cleanups.clear();
  };
  const modals: Array<{ overlay: HTMLElement; previous?: HTMLElement; close: () => void }> = [];
  let originalOverflow = '';
  return {
    ready: async (selector: string, timeoutMs = 5000): Promise<Element> => {
      const end = Date.now() + timeoutMs;
      while (Date.now() < end) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      throw new Error(`timeout:${selector}`);
    },
    settings: () => ({ ...settings }),
    theme: () => {
      const style = getComputedStyle(document.documentElement);
      const names = ['--bg', '--surface', '--ink', '--accent', '--line', '--gu-bg', '--gu-acc', '--gu-fg'];
      const values: Record<string, string> = { skin: document.documentElement.dataset.skin ?? '' };
      for (const name of names) values[name] = style.getPropertyValue(name).trim();
      return values;
    },
    text: (value: unknown) => document.createTextNode(String(value)),
    jsonView: (value: unknown) => document.createTextNode(JSON.stringify(value)),
    mount: (id: string, node: HTMLElement | string) => {
      const selector = `[data-lg-native-patch="${CSS.escape(id)}"]`;
      let root = document.querySelector<HTMLElement>(selector);
      if (!root) { root = document.createElement('div'); root.dataset.lgNativePatch = id; document.body.append(root); }
      root.replaceChildren(typeof node === 'string' ? document.createRange().createContextualFragment(node) : node);
      register(() => root?.remove());
      return root;
    },
    hud: { button: (id: string, label: string, action: () => void) => {
      const existing = document.querySelector<HTMLButtonElement>(`[data-lg-native-hud-button="${CSS.escape(id)}"]`);
      if (existing) return existing;
      const button = document.createElement('button'); button.type = 'button'; button.dataset.lgNativeHudButton = id; button.textContent = label; button.addEventListener('click', action);
      const place = () => { const hud = document.querySelector<HTMLElement>('#gu-hud .gu-main') ?? document.body; if (!hud.contains(button)) hud.append(button); };
      place(); const observer = new MutationObserver(place); observer.observe(document.body, { childList: true, subtree: true });
      register(() => { observer.disconnect(); button.removeEventListener('click', action); button.remove(); });
      return button;
    } },
    modal: (id: string, content: HTMLElement | string) => {
      const previous = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
      if (!modals.length) { originalOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
      const overlay = document.createElement('div'); overlay.dataset.lgNativeModal = id; overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:rgb(0 0 0 / .55)';
      const dialog = document.createElement('div'); dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true'); dialog.tabIndex = -1; dialog.style.cssText = 'background:var(--surface,var(--gu-bg,#20242b));color:var(--ink,var(--gu-fg,#fff));width:min(560px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;padding:16px;border:1px solid var(--line,#555);border-radius:8px;box-sizing:border-box';
      dialog.append(typeof content === 'string' ? document.createRange().createContextualFragment(content) : content); overlay.append(dialog); document.body.append(overlay);
      let closed = false;
      const keydown = (event: KeyboardEvent) => { if (modals.at(-1)?.overlay !== overlay) return; if (event.key === 'Escape') { event.stopPropagation(); close(); } else if (event.key === 'Tab') { const items = Array.from(dialog.querySelectorAll<HTMLElement>('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter((item) => !item.hasAttribute('disabled')); if (!items.length) { event.preventDefault(); dialog.focus(); } else if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); } else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); } } };
      const backdrop = (event: MouseEvent) => { if (event.target === overlay && modals.at(-1)?.overlay === overlay) close(); };
      const cleanup = () => { if (closed) return; closed = true; const index = modals.findIndex((item) => item.overlay === overlay); const top = index === modals.length - 1; const restore = modals[index]?.previous; if (index >= 0) { const next = modals[index + 1]; if (next && restore && overlay.contains(next.previous ?? null)) next.previous = restore; modals.splice(index, 1); } overlay.removeEventListener('keydown', keydown); overlay.removeEventListener('click', backdrop); overlay.remove(); if (!modals.length) document.body.style.overflow = originalOverflow; if (top && restore?.isConnected) restore.focus(); };
      const close = register(cleanup);
      modals.push({ overlay, ...(previous ? { previous } : {}), close }); overlay.addEventListener('keydown', keydown); overlay.addEventListener('click', backdrop); dialog.focus(); return { element: overlay, close };
    },
    onCleanup: register,
    dispose,
  };
}

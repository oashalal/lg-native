export interface ChannelHandle { send(value: unknown): void; on(listener: (value: unknown) => void): () => void; close(): void; }

/** Serializable installer. Run independently in page or isolated world; DOM messages are untrusted. */
export function installChannel(patchId: string, tabId: string, world: 'page' | 'isolated', limits?: { bytes?: number; depth?: number; rate?: number }): ChannelHandle {
  const maxBytes = limits?.bytes ?? 64 *  1024;
  const maxDepth = limits?.depth ?? 8;
  const maxRate = limits?.rate ?? 30;
  const eventName = '__lgx_channel_v1';
  const ownWindow = { start: Date.now(), count: 0 };
  const incomingWindow = { start: Date.now(), count: 0 };
  const listeners = new Set<(value: unknown) => void>();
  let closed = false;
  const validate = (value: unknown, depth = 0): unknown => {
    if (depth > maxDepth) throw new Error('channel-depth');
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (Array.isArray(value)) { if (value.length > maxBytes) throw new Error('channel-too-large'); return value.map((item) => validate(item, depth + 1)); }
    if (typeof value === 'object') {
      if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) throw new Error('channel-json');
      const result: Record<string, unknown> = {};
      for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') throw new Error('channel-json');
        result[key] = validate(item, depth + 1);
      }
      return result;
    }
    throw new Error('channel-json');
  };
  const receive = (event: MessageEvent): void => {
    if (closed || event.source !== window || event.data?.type !== eventName || event.data.patchId !== patchId || event.data.tabId !== tabId || event.data.world === world) return;
    try {
      const now = Date.now(); if (now - incomingWindow.start >= 1000) { incomingWindow.start = now; incomingWindow.count = 0; }
      if (++incomingWindow.count > maxRate) return;
      const safe = validate(event.data.value);
      if (new TextEncoder().encode(JSON.stringify(safe)).length > maxBytes) return;
      for (const listener of [...listeners]) listener(safe);
    } catch { /* page messages are untrusted; malformed payloads are dropped */ }
  };
  window.addEventListener('message', receive);
  const close = (): void => { if (closed) return; closed = true; listeners.clear(); window.removeEventListener('message', receive); };
  return {
    send(value: unknown): void {
      if (closed) throw new Error('channel-closed');
      const now = Date.now();
      if (now - ownWindow.start >= 1000) { ownWindow.start = now; ownWindow.count = 0; }
      const safe = validate(value);
      const serialized = JSON.stringify(safe);
      if (new TextEncoder().encode(serialized).length > maxBytes) throw new Error('channel-too-large');
      if (++ownWindow.count > maxRate) throw new Error('channel-rate-limit');
      window.postMessage({ type: eventName, patchId, tabId, world, value: safe }, '*');
    },
    on(listener: (value: unknown) => void): () => void { if (closed) return () => undefined; listeners.add(listener); return () => listeners.delete(listener); },
    close,
  };
}

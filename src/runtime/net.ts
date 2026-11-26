export type NetBridgeOptions = { method?: string; headers?: Record<string, string> };
export type NetResponse = { status: number; body: string; headers?: Record<string, string> };
export type NetBridge = {
  fetch: (url: string, options: NetBridgeOptions, requestId: string) => Promise<NetResponse>;
  abort: (requestId: string) => void;
};
export type NetOptions = NetBridgeOptions & { signal?: AbortSignal };
export type NetApi = {
  fetch: (url: string, options?: NetOptions) => Promise<NetResponse>;
  json: (url: string, options?: NetOptions) => Promise<unknown>;
  poll: (url: string, intervalMs: number, callback: (value: unknown) => void, options?: NetOptions) => () => void;
};

// Serializable: injected into an isolated world via Function#toString.
export function createNet(bridge: NetBridge, onCleanup: (cleanup: () => void) => unknown): NetApi {
  let sequence = 0;
  const active = new Set<string>();
  const net: NetApi = {
    fetch(url, options = {}) {
      const requestId = `lgx-net-${Date.now()}-${++sequence}`;
      const { signal, ...bridgeOptions } = options;
      if (signal?.aborted) return Promise.reject(new Error('aborted'));
      active.add(requestId);
      let abortSent = false;
      const abort = () => {
        if (abortSent) return;
        abortSent = true;
        bridge.abort(requestId);
      };
      const onAbort = () => abort();
      const request = bridge.fetch(url, bridgeOptions, requestId);
      signal?.addEventListener('abort', onAbort, { once: true });
      if (signal?.aborted) abort();
      return request.finally(() => {
        active.delete(requestId);
        signal?.removeEventListener('abort', onAbort);
      });
    },
    async json(url, options) {
      const response = await net.fetch(url, options);
      if (response.status < 200 || response.status >= 300) throw new Error(`bad-status:${response.status}`);
      try { return JSON.parse(response.body) as unknown; } catch { throw new Error('invalid-json'); }
    },
    poll(url, intervalMs, callback, options) {
      const interval = Math.max(250, Number.isFinite(intervalMs) ? Math.floor(intervalMs) : 250);
      const controller = new AbortController();
      let stopped = false;
      let running = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const stop = () => {
        if (stopped) return;
        stopped = true;
        if (timer !== undefined) clearTimeout(timer);
        controller.abort();
        options?.signal?.removeEventListener('abort', stop);
      };
      const pollOptions: NetOptions = { ...options, signal: controller.signal };
      const tick = async () => {
        if (stopped || running) return;
        running = true;
        try { const value = await net.json(url, pollOptions); if (!stopped) callback(value); }
        catch (error) { if (!stopped) console.warn('[lg-native patch] poll failed', error); }
        finally { running = false; if (!stopped) timer = setTimeout(tick, interval); }
      };
      onCleanup(stop);
      if (options?.signal?.aborted) { stop(); return stop; }
      options?.signal?.addEventListener('abort', stop, { once: true });
      void tick();
      return stop;
    },
  };
  onCleanup(() => { for (const requestId of active) bridge.abort(requestId); active.clear(); });
  return net;
}

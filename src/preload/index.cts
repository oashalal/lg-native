import { contextBridge, ipcRenderer } from 'electron';

type NetBridgeOptions = { method?: string; headers?: Record<string, string> };
type NetResponse = { status: number; body: string; headers?: Record<string, string> };

const isolatedPatches = ipcRenderer.sendSync('lgx:isolated-bootstrap') as Array<{ worldId: number; token: string }>;
for (const patch of isolatedPatches) {
  const netBridge = {
    fetch: (url: string, options: NetBridgeOptions, requestId: string) => ipcRenderer.invoke('lgx:net-fetch', { token: patch.token, url, options: { ...options, requestId } }) as Promise<NetResponse>,
    abort: (requestId: string) => { void ipcRenderer.invoke('lgx:net-abort', { token: patch.token, requestId }).catch(() => undefined); },
  };
  contextBridge.exposeInIsolatedWorld(patch.worldId, 'LGX', {
    net: netBridge,
    log: (...args: unknown[]) => console.info('[lg-native patch]', ...args),
  });
}

const bridge = {
  patchReport: () => ipcRenderer.invoke('lgx:patch-report') as Promise<unknown[]>,
  notify: (title: string, body: string) => ipcRenderer.invoke('lgx:notify', { title, body }).then(() => undefined),
  openWindow: (url: string) => ipcRenderer.invoke('lgx:open-window', { url }).then(() => undefined),
};
if (process.isMainFrame && location.origin === 'https://legiongame.gg') contextBridge.exposeInMainWorld('__lgNative', bridge);

function printPatchReport(attempt = 0): void {
  void bridge.patchReport().then((reports) => {
    if (reports.length === 0 && attempt < 5) {
      window.setTimeout(() => printPatchReport(attempt + 1), 1000);
      return;
    }
    console.info('[lg-native] patch reports', reports);
  }).catch((error: unknown) => console.warn('[lg-native] patch report unavailable', error));
}
if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', () => window.setTimeout(() => printPatchReport(), 1000), { once: true });
else window.setTimeout(() => printPatchReport(), 1000);

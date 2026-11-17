import { contextBridge, ipcRenderer } from 'electron';

const isolatedPatches = ipcRenderer.sendSync('lgx:isolated-bootstrap') as Array<{ worldId: number; token: string }>;
for (const patch of isolatedPatches) {
  contextBridge.exposeInIsolatedWorld(patch.worldId, 'LGX', {
    net: { fetch: (url: string, options?: unknown) => ipcRenderer.invoke('lgx:net-fetch', { token: patch.token, url, options }) },
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

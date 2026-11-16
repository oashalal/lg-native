import { app, BrowserWindow, Menu, session, shell, Tray, nativeImage, ipcMain, Notification } from 'electron';
import { join } from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { CacheStore, isPassthroughPath, isVersionedAsset } from './net/cache.js';
import { IPC } from './ipc/channels.js';
import { PatchEngine } from './patching/engine.js';

const GAME_ORIGIN = 'https://legiongame.gg';
const channel = process.env.LG_CHANNEL ?? '5opka';
const safeMode = process.argv.includes('--safe-mode');
const profile = join(app.getPath('userData'), 'profiles', 'default');
const cache = new CacheStore(join(profile, 'cache'));
let engine = new PatchEngine([], [], safeMode);
let tray: Tray | undefined;

function isAllowedNavigation(raw: string): boolean {
  try { const url = new URL(raw); return url.origin === GAME_ORIGIN || url.hostname.endsWith('.twitch.tv') || url.hostname === 'twitch.tv'; } catch { return false; }
}

async function fetchSite(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.origin !== GAME_ORIGIN) return fetch(request);
  if (isPassthroughPath(url)) return fetch(request);
  if (isVersionedAsset(url)) {
    const cached = await cache.get(url.toString());
    if (cached) {
      if (!url.pathname.endsWith('.js') && !url.pathname.endsWith('.css')) return new Response(new Uint8Array(cached));
      const result = engine.applyToFile({ path: url.pathname, content: cached.toString('utf8'), siteVer: url.searchParams.get('v') ?? 'unknown', channel, page: `/c/${channel}/` });
      return new Response(result.content, { headers: { 'content-type': url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript', 'x-lg-cache': 'hit' } });
    }
  }
  const response = await fetch(request);
  if (!response.ok) return response;
  const body = Buffer.from(await response.arrayBuffer());
  if (isVersionedAsset(url)) await cache.put(url.toString(), body);
  if (!url.pathname.endsWith('.js') && !url.pathname.endsWith('.css')) return new Response(new Uint8Array(body), { status: response.status, headers: response.headers });
  const result = engine.applyToFile({ path: url.pathname, content: body.toString('utf8'), siteVer: url.searchParams.get('v') ?? 'unknown', channel, page: `/c/${channel}/` });
  return new Response(result.content, { status: response.status, headers: { 'content-type': response.headers.get('content-type') ?? 'text/plain' } });
}

async function createWindow(): Promise<BrowserWindow> {
  const ses = session.fromPath(profile, { cache: true });
  await ses.clearStorageData({ storages: [] });
  await ses.protocol.handle('https', fetchSite);
  const win = new BrowserWindow({ width: 1440, height: 900, webPreferences: { preload: join(app.getAppPath(), 'dist/src/preload/index.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, webgl: true, backgroundThrottling: false } });
  win.webContents.setWindowOpenHandler(({ url }) => { if (isAllowedNavigation(url)) return { action: 'allow' }; void shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (event, url) => { if (!isAllowedNavigation(url)) event.preventDefault(); });
  await win.loadURL(`${GAME_ORIGIN}/c/${encodeURIComponent(channel)}/`);
  return win;
}

async function loadPatchManifests(): Promise<void> {
  const root = join(app.getAppPath(), 'patches');
  const names = await readdir(root, { withFileTypes: true });
  const manifests: unknown[] = [];
  for (const item of names) {
    if (!item.isDirectory() || item.name.startsWith('_')) continue;
    try { manifests.push(JSON.parse(await readFile(join(root, item.name, 'patch.json'), 'utf8'))); } catch { /* malformed patches are ignored and reported by validation in a future report */ }
  }
  engine = new PatchEngine(manifests, [], safeMode);
}

function installIpc(): void {
  ipcMain.handle(IPC.notify, (_event, value: unknown) => { if (!value || typeof value !== 'object') throw new Error('invalid-notify'); const data = value as { title?: unknown; body?: unknown }; new Notification({ title: String(data.title ?? ''), body: String(data.body ?? '') }).show(); });
  ipcMain.handle(IPC.openWindow, (_event, value: unknown) => { const url = (value as { url?: unknown })?.url; if (typeof url !== 'string' || !isAllowedNavigation(url)) throw new Error('url-denied'); return shell.openExternal(url); });
  // TODO (GUIDELINE §5): authenticate the patch identity before granting network access.
  ipcMain.handle(IPC.netFetch, () => { throw new Error('patch-network-unavailable'); });
}

app.whenReady().then(async () => {
  installIpc(); await loadPatchManifests(); tray = new Tray(nativeImage.createEmpty());
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: safeMode ? 'Выключить safe mode' : 'Включить safe mode', type: 'checkbox', checked: safeMode, click: () => { const args = process.argv.slice(1).filter((arg) => arg !== '--safe-mode'); if (!safeMode) args.push('--safe-mode'); app.relaunch({ args }); app.exit(0); } },
    { label: 'Открыть Legion', click: () => undefined },
  ]));
  await createWindow();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

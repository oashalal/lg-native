import { app, BrowserWindow, Menu, net, session, shell, Tray, nativeImage, ipcMain, Notification } from 'electron';
import { dirname, join } from 'node:path';
import { appendFile, mkdir, readFile, readdir } from 'node:fs/promises';
import { CacheStore, isPassthroughPath, isVersionedAsset } from './net/cache.js';
import { IPC } from './ipc/channels.js';
import { PatchEngine } from './patching/engine.js';

const GAME_ORIGIN = 'https://legiongame.gg';
const channel = process.env.LG_CHANNEL ?? process.argv.find((arg) => arg.startsWith('--channel='))?.slice('--channel='.length) ?? '5opka';
const safeMode = process.argv.includes('--safe-mode');
const profile = join(app.getPath('userData'), 'profiles', 'default');
const cache = new CacheStore(join(profile, 'cache'));
const reportFile = join(profile, 'reports', 'patches.jsonl');
let engine = new PatchEngine([], [], safeMode);
let tray: Tray | undefined;

function isAllowedNavigation(raw: string): boolean {
  try { const url = new URL(raw); return url.origin === GAME_ORIGIN || url.hostname.endsWith('.twitch.tv') || url.hostname === 'twitch.tv'; } catch { return false; }
}

async function fetchSite(request: Request, ses: Electron.Session): Promise<Response> {
  const url = new URL(request.url);
  const networkFetch = (): Promise<Response> => ses.fetch(request, { bypassCustomProtocolHandlers: true, redirect: 'follow', credentials: 'include' });
  if (url.origin !== GAME_ORIGIN || isPassthroughPath(url)) return fetchPassthrough(request, ses);
  if (isVersionedAsset(url)) {
    const cached = await cache.get(url.toString());
    if (cached) {
      if (!url.pathname.endsWith('.js') && !url.pathname.endsWith('.css')) return new Response(new Uint8Array(cached));
      const result = engine.applyToFile({ path: url.pathname, content: cached.toString('utf8'), siteVer: url.searchParams.get('v') ?? 'unknown', channel, page: `/c/${channel}/` });
      await recordPatchReport(result.report);
      return new Response(result.content, { headers: { 'content-type': url.pathname.endsWith('.css') ? 'text/css' : 'application/javascript', 'x-lg-cache': 'hit' } });
    }
  }
  const response = await networkFetch();
  if (!response.ok) return response;
  const body = Buffer.from(await response.arrayBuffer());
  if (isVersionedAsset(url)) await cache.put(url.toString(), body);
  if (!url.pathname.endsWith('.js') && !url.pathname.endsWith('.css')) return new Response(new Uint8Array(body), { status: response.status, headers: response.headers });
  const result = engine.applyToFile({ path: url.pathname, content: body.toString('utf8'), siteVer: url.searchParams.get('v') ?? 'unknown', channel, page: `/c/${channel}/` });
  await recordPatchReport(result.report);
  return new Response(result.content, { status: response.status, headers: { 'content-type': response.headers.get('content-type') ?? 'text/plain' } });
}

/** Forward auth and external-origin requests through Chromium while preserving redirects. */
async function fetchPassthrough(request: Request, ses: Electron.Session): Promise<Response> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, name) => { if (name !== 'host' && name !== 'content-length') headers[name] = value; });
  const body = request.method === 'GET' || request.method === 'HEAD' ? undefined : Buffer.from(await request.arrayBuffer());
  return new Promise<Response>((resolve, reject) => {
    const outgoing = net.request({ url: request.url, method: request.method, headers, session: ses, bypassCustomProtocolHandlers: true, redirect: 'manual', useSessionCookies: true, credentials: 'include' });
    let settled = false;
    outgoing.on('redirect', (statusCode, _method, redirectUrl) => {
      settled = true;
      resolve(Response.redirect(redirectUrl, statusCode));
      outgoing.abort();
    });
    outgoing.on('response', (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk: Buffer) => chunks.push(chunk));
      response.on('end', () => {
        if (settled) return;
        settled = true;
        const responseHeaders: Record<string, string> = {};
        for (const [name, value] of Object.entries(response.headers)) responseHeaders[name] = Array.isArray(value) ? value.join(', ') : String(value ?? '');
        resolve(new Response(Buffer.concat(chunks), { status: response.statusCode ?? 200, headers: responseHeaders }));
      });
    });
    outgoing.on('error', (error) => { if (!settled) { settled = true; reject(error); } });
    if (body) outgoing.write(body);
    outgoing.end();
  });
}

async function recordPatchReport(report: ReturnType<PatchEngine['applyToFile']>['report']): Promise<void> {
  if (!report.entries.length) return;
  try {
    await mkdir(dirname(reportFile), { recursive: true });
    await appendFile(reportFile, `${JSON.stringify(report)}\n`, 'utf8');
  } catch { /* Reports remain available via IPC if the file cannot be written. */ }
}

async function createWindow(): Promise<BrowserWindow> {
  const ses = session.fromPath(profile, { cache: true });
  await ses.protocol.handle('https', (request) => fetchSite(request, ses));
  const win = new BrowserWindow({ width: 1440, height: 900, webPreferences: { session: ses, preload: join(app.getAppPath(), 'dist/src/preload/index.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, webgl: true, backgroundThrottling: false } });
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
  ipcMain.handle(IPC.patchReport, () => engine.reports);
  ipcMain.handle(IPC.notify, (_event, value: unknown) => { if (!value || typeof value !== 'object') throw new Error('invalid-notify'); const data = value as { title?: unknown; body?: unknown }; new Notification({ title: String(data.title ?? ''), body: String(data.body ?? '') }).show(); });
  ipcMain.handle(IPC.openWindow, (_event, value: unknown) => { const url = (value as { url?: unknown })?.url; if (typeof url !== 'string' || !isAllowedNavigation(url)) throw new Error('url-denied'); return shell.openExternal(url); });
  // TODO (GUIDELINE §5): authenticate the patch identity before granting network access.
  ipcMain.handle(IPC.netFetch, () => { throw new Error('patch-network-unavailable'); });
}

app.whenReady().then(async () => {
  installIpc(); await loadPatchManifests(); tray = new Tray(nativeImage.createEmpty());
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: safeMode ? 'Выключить safe mode' : 'Включить safe mode', type: 'checkbox', checked: safeMode, click: () => { const args = process.argv.slice(1).filter((arg) => arg !== '--safe-mode'); if (!safeMode) args.push('--safe-mode'); app.relaunch({ args }); app.exit(0); } },
    { label: 'Открыть журнал патчей', click: () => { void shell.openPath(reportFile); } },
    { label: 'Открыть Legion', click: () => undefined },
  ]));
  await createWindow();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

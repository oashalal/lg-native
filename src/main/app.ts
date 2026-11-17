import { app, BrowserWindow, Menu, net, session, shell, Tray, nativeImage, ipcMain, Notification, WebContentsView } from 'electron';
import { join } from 'node:path';
import { readFile, readdir, writeFile, mkdir, rename } from 'node:fs/promises';
import { CacheStore, isPassthroughPath, isVersionedAsset } from './net/cache.js';
import { IPC } from './ipc/channels.js';
import { PatchEngine } from './patching/engine.js';
import { compatibility, parseMatrix, type CompatibilityMatrix } from './patching/compat.js';
import { restoreGameApiOrigin } from './net/origin.js';
import { parseManifest, type PatchManifest } from '../shared/manifest.js';
import { parse as parseJavaScript } from 'acorn';
import { ReportLog } from './patching/report-log.js';
import { fetchForPatch, type FetchRequest } from './net/network-policy.js';
import { randomBytes } from 'node:crypto';
import { applyOverride, publicSettings, validateOverride, type PatchOverrides } from './patching/settings.js';
import { NotificationGate, parseNotify, publicPatchReports } from './ipc/page-bridge.js';

const GAME_ORIGIN = 'https://legiongame.gg';
const channel = process.env.LG_CHANNEL ?? process.argv.find((arg) => arg.startsWith('--channel='))?.slice('--channel='.length) ?? '5opka';
const safeMode = process.argv.includes('--safe-mode');
const profile = join(app.getPath('userData'), 'profiles', 'default');
const cache = new CacheStore(join(profile, 'cache'));
const reportFile = join(profile, 'reports', 'patches.jsonl');
const reportLog = new ReportLog(reportFile);
let engine = new PatchEngine([], [], safeMode);
let tray: Tray | undefined;
let siteVer = 'unknown';
let matrix: CompatibilityMatrix = {};
let runtimeHostSeen = false;
let manifests: PatchManifest[] = [];
const capabilities = new Map<string, { manifest: PatchManifest; worldId: number; script: string }>();
let gameContents: Electron.WebContents | undefined;
let toolbarContents: Electron.WebContents | undefined;
let settingsWindow: BrowserWindow | undefined;
let serverUrl: string | undefined;
let patchOverrides: PatchOverrides = {};
const settingsFile = join(profile, 'patch-settings.json');
const notificationGates = new WeakMap<Electron.WebContents, NotificationGate>();

function isAllowedNavigation(raw: string): boolean {
  try { const url = new URL(raw); return url.origin === GAME_ORIGIN || url.hostname.endsWith('.twitch.tv') || url.hostname === 'twitch.tv'; } catch { return false; }
}

export function buildResponse(body: BodyInit | null, original: Headers, init: ResponseInit = {}): Response {
  const headers = new Headers();
  for (const name of ['content-type', 'cache-control', 'etag', 'last-modified']) {
    const value = original.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(body, { ...init, headers });
}

function contentTypeForPath(pathname: string): string | undefined {
  const ext = pathname.toLowerCase().split('.').pop();
  return ({ svg: 'image/svg+xml', png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', ico: 'image/x-icon', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', js: 'application/javascript', css: 'text/css' } as Record<string, string | undefined>)[ext ?? ''];
}

export async function fetchSite(request: Request, ses: Electron.Session): Promise<Response> {
  const url = new URL(request.url);
  const networkFetch = (): Promise<Response> => ses.fetch(request, { bypassCustomProtocolHandlers: true, redirect: 'follow', credentials: 'include' });
  if (url.origin !== GAME_ORIGIN || isPassthroughPath(url)) return fetchPassthrough(request, ses);
  if (isVersionedAsset(url)) {
    const cached = await cache.getRecord(url.toString());
    if (cached) {
      const contentType = cached.contentType ?? contentTypeForPath(url.pathname);
      const headers = new Headers(contentType ? { 'content-type': contentType } : {});
      if (!url.pathname.endsWith('.js') && !url.pathname.endsWith('.css')) return buildResponse(new Uint8Array(cached.body), headers);
      if (url.pathname === '/site/app.js') runtimeHostSeen = true;
      const result = engine.applyToFile({ path: url.pathname, content: cached.body.toString('utf8'), siteVer, channel, page: `/c/${channel}/` });
      result.report.fileVer = url.searchParams.get('v') ?? 'unknown';
      await recordPatchReport(result.report);
      return buildResponse(result.content, headers);
    }
  }
  const response = await networkFetch();
  if (!response.ok || response.status === 304) return response;
  if (response.status === 204 || response.status === 205) return buildResponse(null, response.headers, { status: response.status });
  const body = Buffer.from(await response.arrayBuffer());
  if (isVersionedAsset(url)) await cache.put(url.toString(), body, response.headers.get('content-type') ?? undefined);
  if (!url.pathname.endsWith('.js') && !url.pathname.endsWith('.css')) return buildResponse(new Uint8Array(body), response.headers, { status: response.status });
  if (url.pathname === '/site/app.js') runtimeHostSeen = true;
  const result = engine.applyToFile({ path: url.pathname, content: body.toString('utf8'), siteVer, channel, page: `/c/${channel}/` });
  result.report.fileVer = url.searchParams.get('v') ?? 'unknown';
  await recordPatchReport(result.report);
  return buildResponse(result.content, response.headers, { status: response.status });
}

/** Forward auth and external-origin requests through Chromium while preserving redirects. */
async function fetchPassthrough(request: Request, ses: Electron.Session): Promise<Response> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, name) => { if (name !== 'host' && name !== 'content-length') headers[name] = value; });
  restoreGameApiOrigin(request, headers);
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
    await reportLog.write(report);
  } catch { /* Reports remain available via IPC if the file cannot be written. */ }
}

async function createWindow(): Promise<BrowserWindow> {
  const ses = session.fromPath(profile, { cache: true });
  try {
    const response = await ses.fetch(`${GAME_ORIGIN}/site/ver`, { bypassCustomProtocolHandlers: true, cache: 'no-store' });
    const data: unknown = await response.json();
    if (response.ok && data && typeof data === 'object' && 'v' in data && typeof data.v === 'string') siteVer = data.v;
  } catch { /* Unknown version disables strict patches. */ }
  await ses.protocol.handle('https', (request) => fetchSite(request, ses));
  const win = new BrowserWindow({ width: 1440, height: 900, autoHideMenuBar: true, webPreferences: { preload: join(app.getAppPath(), 'dist/src/preload/toolbar.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  toolbarContents = win.webContents;
  win.setMenu(null);
  const view = new WebContentsView({ webPreferences: { session: ses, preload: join(app.getAppPath(), 'dist/src/preload/index.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, webgl: true, backgroundThrottling: false } });
  gameContents = view.webContents;
  win.contentView.addChildView(view);
  const layout = () => { const [width = 0, height = 0] = win.getContentSize(); view.setBounds({ x: 0, y: 38, width, height: Math.max(0, height - 38) }); };
  layout(); win.on('resize', layout);
  view.webContents.setWindowOpenHandler(({ url }) => { if (isAllowedNavigation(url)) return { action: 'allow' }; void shell.openExternal(url); return { action: 'deny' }; });
  view.webContents.on('will-navigate', (event, url) => { if (!isAllowedNavigation(url)) event.preventDefault(); });
  view.webContents.on('did-start-loading', () => { runtimeHostSeen = false; });
  view.webContents.on('did-finish-load', () => {
    let url: URL;
    try { url = new URL(view.webContents.getURL()); } catch { return; }
    if (url.origin !== GAME_ORIGIN) return;
    if (!runtimeHostSeen) void recordPatchReport(engine.runtimeHostMissing({ siteVer, channel, page: url.pathname }));
    void runIsolatedPatches(view.webContents);
  });
  await win.loadFile(join(app.getAppPath(), 'src/main/native/toolbar.html'));
  await view.webContents.loadURL(`${GAME_ORIGIN}/c/${encodeURIComponent(channel)}/`);
  return win;
}

async function loadPatchManifests(): Promise<void> {
  const root = join(app.getAppPath(), 'patches');
  const names = await readdir(root, { withFileTypes: true });
  const loaded: PatchManifest[] = [];
  for (const item of names) {
    if (!item.isDirectory() || item.name.startsWith('_')) continue;
    try {
      const manifest = parseManifest(JSON.parse(await readFile(join(root, item.name, 'patch.json'), 'utf8')));
      if (manifest.type === 'runtime') {
        let script = typeof manifest.settings.script === 'string' ? manifest.settings.script : '';
        try { script = await readFile(join(root, item.name, 'index.js'), 'utf8'); } catch { /* inline manifest script */ }
        if (!script) throw new Error('runtime script is missing');
        parseJavaScript(`(async function(){${script}\n})`, { ecmaVersion: 'latest' });
        manifest.settings = { ...manifest.settings, script };
      }
      const override = patchOverrides[manifest.id];
      if (loaded.some((existing) => existing.id === manifest.id)) throw new Error('duplicate-patch-id');
      loaded.push(applyOverride(manifest, override));
    } catch (error) { console.error(`[lg-native] patch ${item.name} unavailable`, error); }
  }
  manifests = loaded;
  engine = new PatchEngine(manifests, [], safeMode, matrix);
  capabilities.clear();
  for (const manifest of manifests) {
    if (!safeMode && manifest.enabled && manifest.type === 'runtime' && manifest.network?.hosts.length && typeof manifest.settings.script === 'string') {
      capabilities.set(randomBytes(32).toString('hex'), { manifest, worldId: 1000 + capabilities.size, script: manifest.settings.script });
    }
  }
}

function eligible(manifest: PatchManifest, page: string): boolean {
  const match = (pattern: string, value: string) => pattern === '*' || (pattern.endsWith('*') ? value.startsWith(pattern.slice(0, -1)) : pattern === value);
  return manifest.enabled && !['skipped', 'failed'].includes(compatibility(manifest, siteVer, matrix)) && manifest.scope.channels.some((p) => match(p, channel)) && manifest.scope.pages.some((p) => match(p, page));
}

async function runIsolatedPatches(contents: Electron.WebContents): Promise<void> {
  let url: URL;
  try { url = new URL(contents.getURL()); } catch { return; }
  if (url.origin !== GAME_ORIGIN) return;
  for (const patch of capabilities.values()) {
    const { manifest, script, worldId } = patch;
    if (!eligible(manifest, url.pathname)) continue;
    const settings = JSON.stringify(publicSettings(manifest));
    const code = `(async () => { const settings = ${settings}; for (const requirement of ${JSON.stringify(manifest.requires)}) { if (requirement.startsWith('global:')) throw Error('isolated-global-requirement-unsupported'); const end = Date.now() + 10000; while (!(requirement.startsWith('file:') ? Array.from(document.querySelectorAll('script[src],link[href]')).some(el => { try { return new URL(el.src || el.href, document.baseURI).pathname === requirement.slice(5); } catch { return false; } }) : document.querySelector(requirement.startsWith('selector:') ? requirement.slice(9) : requirement))) { if (Date.now() >= end) throw Error('requirement-missing:' + requirement); await new Promise(resolve => setTimeout(resolve, 100)); } } ${script}\n})()`;
    let entry: { patchId: string; status: 'applied' | 'failed'; siteVer: string; reason?: string };
    try { await contents.executeJavaScriptInIsolatedWorld(worldId, [{ code }]); entry = { patchId: manifest.id, status: 'applied', siteVer }; }
    catch (error) { entry = { patchId: manifest.id, status: 'failed', siteVer, reason: error instanceof Error ? error.message : String(error) }; }
    const report = { siteVer, entries: [entry], safeMode, generatedAt: new Date().toISOString(), path: url.pathname };
    engine.record(report); await recordPatchReport(report);
  }
}

function isGameFrame(event: Electron.IpcMainInvokeEvent | Electron.IpcMainEvent): boolean {
  try { return event.sender === gameContents && event.senderFrame === event.sender.mainFrame && new URL(event.senderFrame.url).origin === GAME_ORIGIN; } catch { return false; }
}

type ThemeValues = Record<string, string> & { skin?: string };

async function readGameTheme(): Promise<ThemeValues> {
  if (!gameContents || gameContents.isDestroyed()) return {};
  try {
    return await gameContents.executeJavaScript(`(() => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      const names = ['--bg', '--surface', '--surface2', '--ink', '--mute', '--accent', '--accent-2', '--focus', '--line', '--gu-bg', '--gu-acc', '--gu-acc-l', '--gu-line', '--gu-fg', '--tx', '--hd', '--mono'];
      const result = { skin: root.dataset.skin || '' };
      for (const name of names) result[name] = style.getPropertyValue(name).trim();
      return result;
    })()`);
  } catch { return {}; }
}

function openSettings(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) { settingsWindow.focus(); return; }
  const parent = toolbarContents ? BrowserWindow.fromWebContents(toolbarContents) : null;
  settingsWindow = new BrowserWindow({ width: 620, height: 700, minWidth: 400, minHeight: 360, ...(parent ? { parent } : {}), title: 'Настройки патчей', autoHideMenuBar: true, webPreferences: { preload: join(app.getAppPath(), 'dist/src/preload/settings.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  settingsWindow.setMenu(null);
  settingsWindow.on('closed', () => { settingsWindow = undefined; });
  void settingsWindow.loadFile(join(app.getAppPath(), 'src/main/native/settings.html'));
}

function installIpc(): void {
  ipcMain.handle('lgx:toolbar', async (event, action: unknown) => {
    if (event.sender !== toolbarContents || event.senderFrame !== event.sender.mainFrame || !gameContents || gameContents.isDestroyed()) throw new Error('toolbar-denied');
    const history = gameContents.navigationHistory;
    if (action === 'back' && history.canGoBack()) history.goBack();
    else if (action === 'forward' && history.canGoForward()) history.goForward();
    else if (action === 'reload') gameContents.reload();
    else if (action === 'settings') openSettings();
    else if (action !== 'status') throw new Error('toolbar-action-denied');
    const latest = new Map<string, string>();
    for (const manifest of manifests) latest.set(manifest.id, 'pending');
    for (const report of engine.reports) for (const entry of report.entries) latest.set(entry.patchId, entry.status);
    const theme = await readGameTheme();
    return { back: history.canGoBack(), forward: history.canGoForward(), applied: [...latest.values()].filter((value) => value === 'applied').length, failed: [...latest.values()].filter((value) => value === 'failed').length, total: manifests.filter((patch) => patch.enabled).length, versionUnverified: !Object.hasOwn(matrix, siteVer), pending: [...latest.values()].filter((value) => value === 'pending').length, safeMode, theme };
  });
  ipcMain.on('lgx:isolated-bootstrap', (event) => {
    event.returnValue = isGameFrame(event) ? [...capabilities].filter(([, patch]) => eligible(patch.manifest, new URL(event.senderFrame!.url).pathname)).map(([token, patch]) => ({ token, worldId: patch.worldId })) : [];
  });
  ipcMain.handle(IPC.patchReport, (event) => { if (!isGameFrame(event)) throw new Error('patch-report-denied'); return publicPatchReports(engine.reports); });
  ipcMain.handle('lgx:settings-load', async (event) => {
    if (event.sender !== settingsWindow?.webContents || event.senderFrame !== event.sender.mainFrame) throw new Error('settings-denied');
    return { patches: manifests.map((manifest) => {
      const schema = Object.fromEntries(Object.entries(manifest.settingsSchema ?? {}).filter(([, spec]) => !spec.secret && spec.visibility !== 'secret'));
      return { id: manifest.id, name: manifest.name, enabled: manifest.enabled, settings: Object.fromEntries(Object.entries(schema).map(([key, spec]) => [key, manifest.settings[key] ?? spec.default])), schema };
    }), theme: await readGameTheme() };
  });
  ipcMain.handle('lgx:settings-theme', async (event) => {
    if (event.sender !== settingsWindow?.webContents || event.senderFrame !== event.sender.mainFrame) throw new Error('settings-denied');
    return readGameTheme();
  });
  ipcMain.handle('lgx:settings-save', async (event, value: unknown) => {
    if (event.sender !== settingsWindow?.webContents || event.senderFrame !== event.sender.mainFrame || !value || typeof value !== 'object' || Array.isArray(value)) throw new Error('settings-denied');
    const next: PatchOverrides = {};
    for (const manifest of manifests) {
      const raw = (value as Record<string, unknown>)[manifest.id];
      if (raw === undefined) continue;
      const submitted = raw as { enabled?: unknown; values?: unknown };
      const values = submitted?.values && typeof submitted.values === 'object' && !Array.isArray(submitted.values) ? submitted.values as Record<string, unknown> : {};
      const secrets = Object.fromEntries(Object.entries(manifest.settingsSchema ?? {}).filter(([, spec]) => spec.secret || spec.visibility === 'secret').map(([key, spec]) => [key, manifest.settings[key] ?? spec.default]));
      next[manifest.id] = validateOverride(manifest, { enabled: submitted?.enabled, values: { ...values, ...secrets } });
    }
    await mkdir(profile, { recursive: true });
    await writeFile(`${settingsFile}.tmp`, JSON.stringify(next, null, 2), { encoding: 'utf8', mode: 0o600 });
    await rename(`${settingsFile}.tmp`, settingsFile);
    patchOverrides = next;
    await loadPatchManifests();
    gameContents?.reloadIgnoringCache();
    return { ok: true };
  });
  ipcMain.handle(IPC.notify, (event, value: unknown) => {
    if (!isGameFrame(event)) throw new Error('notify-denied');
    const data = parseNotify(value);
    const gate = notificationGates.get(event.sender) ?? new NotificationGate();
    notificationGates.set(event.sender, gate);
    if (!gate.allow()) throw new Error('notify-rate-limit');
    new Notification(data).show();
  });
  ipcMain.handle(IPC.openWindow, (_event, value: unknown) => { const url = (value as { url?: unknown })?.url; if (typeof url !== 'string' || !isAllowedNavigation(url)) throw new Error('url-denied'); return shell.openExternal(url); });
  ipcMain.handle(IPC.netFetch, async (event, value: unknown) => {
    if (!isGameFrame(event) || !value || typeof value !== 'object') throw new Error('patch-network-denied');
    const data = value as { token?: unknown; url?: unknown; options?: unknown };
    const patch = typeof data.token === 'string' ? capabilities.get(data.token) : undefined;
    if (!patch || !eligible(patch.manifest, new URL(event.senderFrame!.url).pathname) || typeof data.url !== 'string') throw new Error('patch-network-denied');
    if (data.options !== undefined && (!data.options || typeof data.options !== 'object' || Array.isArray(data.options))) throw new Error('invalid-network-request');
    const options = (data.options ?? {}) as Omit<FetchRequest, 'url'>;
    try { return await fetchForPatch(patch.manifest, { ...options, url: data.url }, serverUrl); }
    catch (error) {
      const report = { siteVer, entries: [{ patchId: patch.manifest.id, status: 'failed' as const, reason: 'network-request-denied-or-failed', siteVer }], safeMode, generatedAt: new Date().toISOString() };
      engine.record(report); void recordPatchReport(report); throw error;
    }
  });
}

app.whenReady().then(async () => {
  try { const data: unknown = JSON.parse(await readFile(settingsFile, 'utf8')); if (data && typeof data === 'object' && !Array.isArray(data)) patchOverrides = data as PatchOverrides; } catch { /* Optional settings file. */ }
  try { const data: unknown = JSON.parse(await readFile(join(profile, 'config.json'), 'utf8')); if (data && typeof data === 'object' && 'serverUrl' in data && typeof data.serverUrl === 'string') serverUrl = data.serverUrl; } catch { /* Optional profile config. */ }
  try { matrix = parseMatrix(JSON.parse(await readFile(join(app.getAppPath(), 'compat/matrix.json'), 'utf8'))); } catch { console.warn('[lg-native] compatibility matrix unavailable'); }
  installIpc(); await loadPatchManifests(); tray = new Tray(nativeImage.createEmpty());
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: safeMode ? 'Выключить safe mode' : 'Включить safe mode', type: 'checkbox', checked: safeMode, click: () => { const args = process.argv.slice(1).filter((arg) => arg !== '--safe-mode'); if (!safeMode) args.push('--safe-mode'); app.relaunch({ args }); app.exit(0); } },
    { label: 'Открыть журнал патчей', click: () => { void shell.openPath(reportFile); } },
    { label: 'Открыть Legion', click: () => undefined },
  ]));
  await createWindow();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

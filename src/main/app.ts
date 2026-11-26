import { app, BrowserWindow, Menu, net, shell, Tray, nativeImage, ipcMain, Notification, WebContentsView, dialog } from 'electron';
import { join } from 'node:path';
import { readFile, readdir, writeFile, mkdir, rename, stat, realpath } from 'node:fs/promises';
import { CacheStore, isPassthroughPath, isVersionedAsset } from './net/cache.js';
import { IPC } from './ipc/channels.js';
import { PatchEngine } from './patching/engine.js';
import { compatibility, parseMatrix, type CompatibilityMatrix } from './patching/compat.js';
import { restoreGameApiOrigin } from './net/origin.js';
import { parseManifest, type PatchManifest, type ScriptSource } from '../shared/manifest.js';
import { parse as parseJavaScript } from 'acorn';
import { ReportLog } from './patching/report-log.js';
import { fetchForPatch, type FetchRequest } from './net/network-policy.js';
import { randomBytes } from 'node:crypto';
import { applyOverride, publicSettings, validateOverride, type PatchOverrides } from './patching/settings.js';
import { NotificationGate, parseNotify, publicPatchReports } from './ipc/page-bridge.js';
import { AccountHub, type AccountProfile } from './accounts/index.js';
import { createUI } from '../runtime/ui.js';
import { createNet } from '../runtime/net.js';
import { installChannel } from '../runtime/channel.js';

const GAME_ORIGIN = 'https://legiongame.gg';
const channel = process.env.LG_CHANNEL ?? process.argv.find((arg) => arg.startsWith('--channel='))?.slice('--channel='.length) ?? '5opka';
const safeMode = process.argv.includes('--safe-mode');
const userData = app.getPath('userData');
const defaultProfileDir = join(userData, 'profiles', 'default');
const settingsFile = join(defaultProfileDir, 'patch-settings.json');
const reportFile = join(defaultProfileDir, 'reports', 'patches.jsonl');
type ProfileRuntime = { id: string; name: string; directory: string; ses: Electron.Session; cache: CacheStore; reportLog: ReportLog; engine: PatchEngine; siteVer: string; serverUrl: string | undefined; runtimeHostSeen: boolean; protocolInstalled: boolean };
type TabRuntime = { id: string; profileId: string; view?: WebContentsView; url: string; active: boolean; status: 'loading' | 'ready' | 'error'; error?: string | undefined; documentGeneration: number };
const runtimes = new Map<string, ProfileRuntime>();
const tabs = new Map<string, TabRuntime>();
let activeTabId: string | undefined;
let tray: Tray | undefined;
let matrix: CompatibilityMatrix = {};
let manifests: PatchManifest[] = [];
type Capability = { manifest: PatchManifest; worldId: number; script: string; sender?: Electron.WebContents; tabId?: string; profileId?: string; generation?: number; frame?: Electron.WebFrameMain };
type ActiveRequest = { owner: Capability; requestId: string; controller: AbortController };
const capabilities = new Map<string, Capability>();
const activeRequests = new Map<string, ActiveRequest>();
const issuedCapabilities = new WeakMap<Electron.WebContents, Map<string, Capability>>();

function revokeCapabilitiesFor(contents: Electron.WebContents, tabId?: string): void {
  const issued = issuedCapabilities.get(contents);
  if (!issued) return;
  for (const [token, capability] of issued) {
    if (tabId && capability.tabId !== tabId) continue;
    issued.delete(token);
    capabilities.delete(token);
    for (const request of activeRequests.values()) if (request.owner === capability) request.controller.abort();
  }
}

function inlineSource(source: ScriptSource | undefined): string | undefined {
  return typeof source === 'string' ? source : undefined;
}
let toolbarContents: Electron.WebContents | undefined;
let toolbarView: WebContentsView | undefined;
let settingsWindow: BrowserWindow | undefined;
let mainWindow: BrowserWindow | undefined;
let menuOpen = false;
let menuHeight = 0;
const TOOLBAR_HEIGHT = 38;
const MENU_MAX_HEIGHT = 520;
let patchOverrides: PatchOverrides = {};
const notificationGates = new WeakMap<Electron.WebContents, NotificationGate>();
let fallbackRuntime: ProfileRuntime | undefined;
const hub = new AccountHub({ userDataDir: userData });
const protocolInstalled = new Set<Electron.Session>();
const protocolInstalling = new Map<Electron.Session, Promise<void>>();
const profileOperations = new Map<string, Promise<unknown>>();
const deletingProfiles = new Set<string>();

function serializeProfileOperation<T>(profileId: string, operation: () => Promise<T>): Promise<T> {
  const previous = profileOperations.get(profileId) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(operation);
  profileOperations.set(profileId, next);
  return next.finally(() => { if (profileOperations.get(profileId) === next) profileOperations.delete(profileId); });
}

function toolbarState() {
  const activeTab = activeTabId ? tabs.get(activeTabId) : undefined;
  return {
    activeTabId,
    activeProfileId: activeTab?.profileId,
    tabs: [...tabs.values()].map((tab) => ({ id: tab.id, profileId: tab.profileId, name: hub.getProfile(tab.profileId)?.name ?? tab.profileId, active: tab.active, status: tab.status, ...(tab.error ? { error: tab.error } : {}) })),
    profiles: hub.listProfiles().map((profile) => ({ id: profile.id, name: profile.name, saved: profile.saved, active: profile.id === activeTab?.profileId, tabCount: [...tabs.values()].filter((tab) => tab.profileId === profile.id).length })).filter((profile) => profile.saved || profile.tabCount > 0),
  };
}

function defaultProfileId(): string | undefined {
  return hub.listProfiles().find((profile) => profile.saved && profile.directory === defaultProfileDir)?.id
    ?? hub.listProfiles().find((profile) => profile.saved)?.id;
}

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

/** Ресурс профиля для вызова; при отсутствии зарегистрированной сессии используется откат уровня модуля (совместимость со старыми вызовами). */
function runtimeFor(ses: Electron.Session): ProfileRuntime {
  const found = [...runtimes.values()].find((candidate) => candidate.ses === ses);
  if (found) return found;
  if (!fallbackRuntime) {
    fallbackRuntime = {
      id: 'fallback', name: 'default', directory: defaultProfileDir, ses,
      cache: new CacheStore(join(defaultProfileDir, 'cache')),
      reportLog: new ReportLog(join(defaultProfileDir, 'reports', 'patches.jsonl')),
      engine: new PatchEngine(manifests, [], safeMode, matrix),
      siteVer: 'unknown', serverUrl: undefined, runtimeHostSeen: false, protocolInstalled: false,
    };
  }
  return fallbackRuntime!;
}

export async function fetchSite(request: Request, ses: Electron.Session): Promise<Response> {
  const url = new URL(request.url);
  const networkFetch = (): Promise<Response> => ses.fetch(request, { bypassCustomProtocolHandlers: true, redirect: 'follow', credentials: 'include' });
  if (url.origin !== GAME_ORIGIN || isPassthroughPath(url)) return fetchPassthrough(request, ses);
  const profileRuntime = runtimeFor(ses);
  if (url.pathname === '/site/app.js') profileRuntime.runtimeHostSeen = true;
  if (isVersionedAsset(url)) {
    const cached = await profileRuntime.cache.getRecord(url.toString());
    if (cached) {
      const contentType = cached.contentType ?? contentTypeForPath(url.pathname);
      const headers = new Headers(contentType ? { 'content-type': contentType } : {});
      if (!url.pathname.endsWith('.js') && !url.pathname.endsWith('.css')) return buildResponse(new Uint8Array(cached.body), headers);
      const result = profileRuntime.engine.applyToFile({ path: url.pathname, content: cached.body.toString('utf8'), siteVer: profileRuntime.siteVer, channel, page: `/c/${channel}/` });
      result.report.fileVer = url.searchParams.get('v') ?? 'unknown';
      await recordPatchReport(profileRuntime, result.report);
      return buildResponse(result.content, headers);
    }
  }
  const response = await networkFetch();
  if (!response.ok || response.status === 304) return response;
  if (response.status === 204 || response.status === 205) return buildResponse(null, response.headers, { status: response.status });
  const body = Buffer.from(await response.arrayBuffer());
  if (isVersionedAsset(url)) await profileRuntime.cache.put(url.toString(), body, response.headers.get('content-type') ?? undefined);
  if (!url.pathname.endsWith('.js') && !url.pathname.endsWith('.css')) return buildResponse(new Uint8Array(body), response.headers, { status: response.status });
  const result = profileRuntime.engine.applyToFile({ path: url.pathname, content: body.toString('utf8'), siteVer: profileRuntime.siteVer, channel, page: `/c/${channel}/` });
  result.report.fileVer = url.searchParams.get('v') ?? 'unknown';
  await recordPatchReport(profileRuntime, result.report);
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

async function recordPatchReport(profileRuntime: ProfileRuntime, report: ReturnType<PatchEngine['applyToFile']>['report']): Promise<void> {
  if (!report.entries.length) return;
  try {
    await profileRuntime.reportLog.write(report);
  } catch { /* Reports remain available via IPC if the file cannot be written. */ }
}

async function createMainWindow(): Promise<BrowserWindow> {
  const win = new BrowserWindow({ width: 1440, height: 900, autoHideMenuBar: true });
  const toolbar = new WebContentsView({ webPreferences: { preload: join(app.getAppPath(), 'dist/src/preload/toolbar.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  toolbar.setBackgroundColor('#00000000');
  toolbarView = toolbar;
  toolbarContents = toolbar.webContents;
  win.contentView.addChildView(toolbar);
  win.setMenu(null);
  await toolbar.webContents.loadFile(join(app.getAppPath(), 'src/main/native/toolbar.html'));
  mainWindow = win;
  win.on('resize', () => layout());
  win.on('closed', () => { if (mainWindow === win) { mainWindow = undefined; toolbarContents = undefined; toolbarView = undefined; menuOpen = false; menuHeight = 0; } });
  return win;
}

function createView(profileId: string, url: string, tabId?: string): WebContentsView {
  const runtime = runtimes.get(profileId);
  if (!runtime) throw new Error('profile-runtime-missing');
  const view = new WebContentsView({ webPreferences: { session: runtime.ses, preload: join(app.getAppPath(), 'dist/src/preload/index.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, webgl: true, backgroundThrottling: false } });
  bindView(view, profileId, url, tabId);
  return view;
}

function bindView(view: WebContentsView, profileId: string, url: string, requestedTabId?: string): void {
  const tabId = requestedTabId ?? randomBytes(8).toString('hex');
  const existing = tabs.get(tabId);
  const tab: TabRuntime = existing ?? { id: tabId, profileId, view, url, active: false, status: 'loading', documentGeneration: 0 };
  tab.view = view;
  tabs.set(tabId, tab);
  if (!existing) hub.createTab(profileId, url, tabId);
  view.webContents.setWindowOpenHandler(({ url: openUrl }) => { if (isAllowedNavigation(openUrl)) return { action: 'allow' }; void shell.openExternal(openUrl); return { action: 'deny' }; });
  view.webContents.on('did-start-navigation', (_event, _url, inPlace, isMainFrame) => {
    if (!isMainFrame || inPlace) return;
    revokeCapabilitiesFor(view.webContents, tabId);
    const current = tabs.get(tabId);
    if (current) current.documentGeneration++;
  });
  view.webContents.on('did-navigate-in-page', (_event, navigateUrl, isMainFrame) => {
    if (!isMainFrame) return;
    const current = tabs.get(tabId);
    if (!current) return;
    current.url = navigateUrl;
    void hub.persistTabs();
  });
  view.webContents.on('destroyed', () => revokeCapabilitiesFor(view.webContents, tabId));
  view.webContents.on('will-navigate', (event, navigateUrl) => { if (!isAllowedNavigation(navigateUrl)) event.preventDefault(); });
  view.webContents.on('did-finish-load', async () => {
    const current = tabs.get(tabId);
    if (current) { current.status = 'ready'; current.error = undefined; }
    let loadedUrl: URL;
    try { loadedUrl = new URL(view.webContents.getURL()); } catch { return; }
    if (loadedUrl.origin !== GAME_ORIGIN) return;
    const runtime = runtimes.get(profileId);
    if (!runtime) return;
    if (!runtime.runtimeHostSeen) {
      const report = runtime.engine.runtimeHostMissing({ siteVer: runtime.siteVer, channel, page: loadedUrl.pathname });
      await recordPatchReport(runtime, report);
    }
    void runIsolatedPatches(view, runtime);
  });
  void view.webContents.loadURL(url).catch((error: unknown) => {
    const current = tabs.get(tabId);
    if (current) { current.status = 'error'; current.error = error instanceof Error ? error.message : 'load-failed'; }
  });
}

function registerPendingTab(profileId: string, url: string, makeActive: boolean, requestedTabId?: string): TabRuntime {
  const id = requestedTabId ?? randomBytes(8).toString('hex');
  const shouldActivate = makeActive || activeTabId === undefined;
  const tab: TabRuntime = { id, profileId, url, active: false, status: 'loading', documentGeneration: 0 };
  tabs.set(id, tab);
  hub.createTab(profileId, url, id);
  if (shouldActivate) activateTab(id);
  void hub.persistTabs();
  return tab;
}

function createTab(profileId: string, url: string, makeActive = true, tabId?: string): TabRuntime {
  const tab = tabs.get(tabId ?? '') ?? registerPendingTab(profileId, url, makeActive, tabId);
  const view = createView(profileId, url, tab.id);
  if (tabs.get(tab.id) !== tab) { if (!view.webContents.isDestroyed()) view.webContents.close(); return tab; }
  tab.view = view;
  tab.status = 'loading';
  const shouldActivate = activeTabId === tab.id;
  if (shouldActivate) { mainWindow?.contentView.addChildView(view); layout(); }
  else { view.setBounds({ x: 0, y: 0, width: 0, height: 0 }); mainWindow?.contentView.addChildView(view); }
  layout();
  void hub.persistTabs();
  return tab;
}

function activateTab(tabId: string): void {
  const tab = tabs.get(tabId);
  if (!tab || tab.active) return;
  const previous = activeTabId ? tabs.get(activeTabId) : undefined;
  if (previous) { previous.active = false; if (previous.view) previous.view.setBounds({ x: 0, y: 0, width: 0, height: 0 }); }
  tab.active = true;
  activeTabId = tabId;
  hub.activateTab(tabId);
  if (!tab.view) { layout(); void hub.persistTabs(); return; }
  mainWindow?.contentView.addChildView(tab.view);
  layout();
  void tab.view.webContents.focus();
  const hubEntry = hub.activateTab(tabId);
  if (hubEntry) void hub.persistTabs();
}

function closeTab(tabId: string, cleanupTemporary = true): void {
  const tab = tabs.get(tabId);
  if (!tab) return;
  if (tab.view) {
    try { mainWindow?.contentView.removeChildView(tab.view); } catch { /* Already detached. */ }
    if (!tab.view.webContents.isDestroyed()) tab.view.webContents.close();
  }
  tabs.delete(tabId);
  hub.closeTab(tabId);
  const wasActive = activeTabId === tabId;
  if (wasActive) activeTabId = undefined;
  const neighbor = [...tabs.values()][0];
  if (wasActive && neighbor) activateTab(neighbor.id);
  layout();
  const remaining = [...tabs.values()].some((candidate) => candidate.profileId === tab.profileId);
  if (!remaining) {
    const profile = hub.getProfile(tab.profileId);
    if (cleanupTemporary && profile && !hub.isSaved(tab.profileId) && !deletingProfiles.has(tab.profileId)) {
      void serializeProfileOperation(tab.profileId, async () => {
        if (hub.getProfile(tab.profileId) && !hub.isSaved(tab.profileId) && ![...tabs.values()].some((candidate) => candidate.profileId === tab.profileId)) {
          try { await hub.deleteProfile(tab.profileId); } finally { runtimes.delete(tab.profileId); }
        }
      }).catch((error: unknown) => console.error('[lg-native] temporary profile cleanup failed', error));
    }
  }
  void hub.persistTabs();
}

async function closeTabWithConfirmation(tabId: string): Promise<void> {
  const tab = tabs.get(tabId);
  if (!tab) return;
  const remaining = [...tabs.values()].filter((candidate) => candidate.profileId === tab.profileId && candidate.id !== tabId);
  if (!remaining.length && !hub.isSaved(tab.profileId)) {
    const options = { type: 'question' as const, buttons: ['Закрыть', 'Отмена'], defaultId: 1, cancelId: 1, message: 'Закрыть временный профиль?', detail: 'Данные этой сессии будут удалены.' };
    const result = mainWindow ? await dialog.showMessageBox(mainWindow, options) : await dialog.showMessageBox(options);
    if (result.response !== 0) return;
  }
  closeTab(tabId);
}

function layout(): void {
  const win = mainWindow;
  if (!win || win.isDestroyed()) return;
  const [rawWidth = 0, rawHeight = 0] = win.getContentSize();
  const width = Math.max(0, Math.floor(rawWidth));
  const height = Math.max(0, Math.floor(rawHeight));
  const top = Math.min(height, TOOLBAR_HEIGHT);
  const active = activeTabId ? tabs.get(activeTabId) : undefined;
  for (const tab of tabs.values()) {
    try {
      if (!tab.view) continue;
      if (tab === active && !tab.view.webContents.isDestroyed()) tab.view.setBounds({ x: 0, y: top, width, height: Math.max(0, height - top) });
      else tab.view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    } catch { /* A view may be destroyed while the window is closing. */ }
  }
  if (toolbarView && !toolbarView.webContents.isDestroyed()) {
    win.contentView.addChildView(toolbarView);
    toolbarView.setBounds({ x: 0, y: 0, width, height: Math.min(height, TOOLBAR_HEIGHT + (menuOpen ? menuHeight : 0)) });
  }
}

function setMenuLayout(open: boolean, requestedHeight = 0): void {
  menuOpen = open;
  menuHeight = open ? Math.min(MENU_MAX_HEIGHT, Math.max(0, Math.floor(requestedHeight))) : 0;
  layout();
}

async function runIsolatedPatches(view: WebContentsView, profileRuntime: ProfileRuntime): Promise<void> {
  let url: URL;
  try { url = new URL(view.webContents.getURL()); } catch { return; }
  if (url.origin !== GAME_ORIGIN) return;
  const tab = [...tabs.values()].find((candidate) => candidate.view === view);
  if (!tab) return;
  for (const patch of issuedCapabilities.get(view.webContents)?.values() ?? []) {
    const { manifest, script, worldId } = patch;
    if (!eligible(manifest, profileRuntime.siteVer, url.pathname)) continue;
    const settings = JSON.stringify(publicSettings(manifest));
    const code = `(async () => { const settings = ${settings}; const cleanups = new Set(); const onCleanup = fn => { cleanups.add(fn); return () => cleanups.delete(fn); }; const dispose = () => { for (const fn of [...cleanups]) { try { fn(); } catch {} } cleanups.clear(); }; addEventListener('pagehide', dispose, { once: true }); const ui = (${createUI.toString()})(${JSON.stringify(manifest.id)}, settings, onCleanup); const channel = (${installChannel.toString()})(${JSON.stringify(manifest.id)}, '', 'isolated'); onCleanup(channel.close); const LGX = { ...globalThis.LGX, ...ui, channel, ui: { text: ui.text, jsonView: ui.jsonView }, onCleanup, dispose, net: (${createNet.toString()})(globalThis.LGX.net, onCleanup) }; for (const requirement of ${JSON.stringify(manifest.requires)}) { if (requirement.startsWith('global:')) throw Error('isolated-global-requirement-unsupported'); const end = Date.now() + 10000; while (!(requirement.startsWith('file:') ? Array.from(document.querySelectorAll('script[src],link[href]')).some(el => { try { return new URL(el.src || el.href, document.baseURI).pathname === requirement.slice(5); } catch { return false; } }) : document.querySelector(requirement.startsWith('selector:') ? requirement.slice(9) : requirement))) { if (Date.now() >= end) throw Error('requirement-missing:' + requirement); await new Promise(resolve => setTimeout(resolve, 100)); } } ${script}\n})()`;
    let entry: { patchId: string; status: 'applied' | 'failed'; siteVer: string; reason?: string };
    try {
      if (patch.tabId !== tab.id || patch.generation !== tab.documentGeneration || patch.frame !== view.webContents.mainFrame) continue;
      await view.webContents.executeJavaScriptInIsolatedWorld(worldId, [{ code }]);
      entry = { patchId: manifest.id, status: 'applied', siteVer: profileRuntime.siteVer };
    }
    catch (error) { entry = { patchId: manifest.id, status: 'failed', siteVer: profileRuntime.siteVer, reason: error instanceof Error ? error.message : String(error) }; }
    const report = profileRuntime.engine.settleRuntime(manifest.id, profileRuntime.siteVer, '/site/app.js', entry.status, entry.reason);
    if (report) await recordPatchReport(profileRuntime, report);
    else {
      const standalone = { siteVer: profileRuntime.siteVer, entries: [entry], safeMode, generatedAt: new Date().toISOString(), path: url.pathname };
      profileRuntime.engine.record(standalone); await recordPatchReport(profileRuntime, standalone);
    }
  }
}

function eligible(manifest: PatchManifest, siteVer: string, page: string): boolean {
  const match = (pattern: string, value: string) => pattern === '*' || (pattern.endsWith('*') ? value.startsWith(pattern.slice(0, -1)) : pattern === value);
  return manifest.enabled && !['skipped', 'failed'].includes(compatibility(manifest, siteVer, matrix)) && manifest.scope.channels.some((p) => match(p, channel)) && manifest.scope.pages.some((p) => match(p, page));
}

type GameFrame = { tab: TabRuntime; runtime: ProfileRuntime };

function gameFrameOf(event: Electron.IpcMainInvokeEvent | Electron.IpcMainEvent): GameFrame | undefined {
  try {
    const sender = event.sender;
    const tab = [...tabs.values()].find((candidate) => candidate.view?.webContents === sender && event.senderFrame === sender.mainFrame && new URL(sender.mainFrame.url).origin === GAME_ORIGIN);
    if (!tab) return undefined;
    const runtime = runtimes.get(tab.profileId);
    if (!runtime) return undefined;
    return { tab, runtime };
  } catch { return undefined; }
}

type ThemeValues = Record<string, string> & { skin?: string };

async function readGameTheme(): Promise<ThemeValues> {
  const tab = activeTabId ? tabs.get(activeTabId) : undefined;
  const contents = tab?.view?.webContents;
  if (!contents || contents.isDestroyed()) return {};
  try {
    return await contents.executeJavaScript(`(() => {
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
  const parent = mainWindow ?? (toolbarContents ? BrowserWindow.fromWebContents(toolbarContents) : null);
  settingsWindow = new BrowserWindow({ width: 620, height: 700, minWidth: 400, minHeight: 360, ...(parent ? { parent } : {}), title: 'Настройки патчей', autoHideMenuBar: true, webPreferences: { preload: join(app.getAppPath(), 'dist/src/preload/settings.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  settingsWindow.setMenu(null);
  settingsWindow.on('closed', () => { settingsWindow = undefined; });
  void settingsWindow.loadFile(join(app.getAppPath(), 'src/main/native/settings.html'));
}

async function ensureProfile(profile: AccountProfile): Promise<ProfileRuntime> {
  const existing = runtimes.get(profile.id);
  if (existing) return existing;
  return serializeProfileOperation(profile.id, async () => {
  let runtime = runtimes.get(profile.id);
  if (runtime) return runtime;
  const ses = await hub.getOrCreateSession(profile.id);
  const cache = new CacheStore(join(profile.directory, 'cache'));
  const reportLog = new ReportLog(join(profile.directory, 'reports', 'patches.jsonl'));
  const engine = new PatchEngine(manifests, [], safeMode, matrix);
  let siteVer = 'unknown';
  let profileServerUrl: string | undefined;
  try {
    const response = await ses.fetch(`${GAME_ORIGIN}/site/ver`, { bypassCustomProtocolHandlers: true, cache: 'no-store' });
    const data: unknown = await response.json();
    if (response.ok && data && typeof data === 'object' && 'v' in data && typeof data.v === 'string') siteVer = data.v;
  } catch { /* Unknown version disables strict patches. */ }
  try {
    const data: unknown = JSON.parse(await readFile(join(profile.directory, 'config.json'), 'utf8'));
    if (data && typeof data === 'object' && 'serverUrl' in data && typeof data.serverUrl === 'string') profileServerUrl = data.serverUrl;
  } catch { /* Optional profile config. */ }
  runtime = { id: profile.id, name: profile.name, directory: profile.directory, ses, cache, reportLog, engine, siteVer, serverUrl: profileServerUrl, runtimeHostSeen: false, protocolInstalled: false };
  if (runtimes.has(profile.id)) return runtimes.get(profile.id)!;
  runtimes.set(profile.id, runtime);
  if (!protocolInstalled.has(ses)) {
    let installing = protocolInstalling.get(ses);
    if (!installing) {
      ses.protocol.handle('https', (request) => fetchSite(request, ses));
      installing = Promise.resolve();
      protocolInstalling.set(ses, installing);
    }
    await installing;
    protocolInstalled.add(ses);
  }
  return runtime;
  });
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
         const patchDir = join(root, item.name);
         const loadSource = async (source: ScriptSource | undefined, fallback?: string): Promise<string | undefined> => {
           const selected = source ?? fallback;
           if (typeof selected === 'string') return selected;
           if (!selected) return undefined;
           if (selected.file.includes('..') || selected.file.startsWith('/') || selected.file.includes('\\')) throw new Error('runtime-source-path-denied');
           const path = join(patchDir, selected.file);
           const [base, resolvedPath, resolved] = await Promise.all([realpath(patchDir), realpath(path), stat(path)]);
           if (!resolved.isFile() || (resolvedPath !== base && !resolvedPath.startsWith(`${base}/`))) throw new Error('runtime-source-path-denied');
           return readFile(path, 'utf8');
         };
         const pageFallback = typeof manifest.settings.script === 'string' ? manifest.settings.script : await readFile(join(patchDir, 'index.js'), 'utf8').catch(() => undefined);
         const pageScript = await loadSource(manifest.runtime?.pageScript, pageFallback);
         const networkScript = await loadSource(manifest.runtime?.networkScript, typeof manifest.settings.networkScript === 'string' ? manifest.settings.networkScript : undefined);
         if (!pageScript && !networkScript) throw new Error('runtime script is missing');
         if (pageScript) parseJavaScript(`(async function(){${pageScript}\n})`, { ecmaVersion: 'latest' });
         if (networkScript) parseJavaScript(`(async function(){${networkScript}\n})`, { ecmaVersion: 'latest' });
         manifest.runtime = { ...manifest.runtime, ...(pageScript ? { pageScript } : {}), ...(networkScript ? { networkScript } : {}) };
      }
      const override = patchOverrides[manifest.id];
      if (loaded.some((existing) => existing.id === manifest.id)) throw new Error('duplicate-patch-id');
      loaded.push(applyOverride(manifest, override));
    } catch (error) { console.error(`[lg-native] patch ${item.name} unavailable`, error); }
  }
  manifests = loaded;
  if (fallbackRuntime) fallbackRuntime.engine = new PatchEngine(manifests, [], safeMode, matrix);
  for (const contents of [...tabs.values()].map((tab) => tab.view?.webContents).filter((item): item is Electron.WebContents => !!item)) revokeCapabilitiesFor(contents);
  for (const [token, capability] of capabilities) if (!capability.sender) capabilities.delete(token);
  for (const [manifestIndex, manifest] of manifests.entries()) {
    const networkScript = inlineSource(manifest.runtime?.networkScript) ?? (typeof manifest.settings.networkScript === 'string' ? manifest.settings.networkScript : undefined);
    if (!safeMode && manifest.enabled && manifest.type === 'runtime' && manifest.network?.hosts.length && networkScript) {
       capabilities.set(randomBytes(32).toString('hex'), { manifest, worldId: 1000 + manifestIndex, script: networkScript });
    }
  }
  for (const runtime of runtimes.values()) {
    runtime.engine = new PatchEngine(manifests, [], safeMode, matrix);
  }
}

function reloadAllGameTabs(): void {
  for (const tab of tabs.values()) {
    if (!tab.view) continue;
    try { tab.view.webContents.reloadIgnoringCache(); } catch { /* Best effort. */ }
  }
}

function installIpc(): void {
  ipcMain.handle('lgx:toolbar', async (event, action: unknown) => {
    if (event.sender !== toolbarContents || event.senderFrame !== event.sender.mainFrame) throw new Error('toolbar-denied');
    const tab = activeTabId ? tabs.get(activeTabId) : undefined;
    const runtime = tab ? runtimes.get(tab.profileId) : undefined;
    const history = tab?.view?.webContents.navigationHistory;
    if (action === 'back' && history?.canGoBack()) history.goBack();
    else if (action === 'forward' && history?.canGoForward()) history.goForward();
    else if (action === 'reload') tab?.view?.webContents.reload();
    else if (action === 'settings') openSettings();
    else if (action !== 'status') throw new Error('toolbar-action-denied');
    const latest = new Map<string, string>();
    for (const manifest of manifests) latest.set(manifest.id, 'pending');
    const engine = runtime?.engine;
    if (engine) for (const report of engine.reports) for (const entry of report.entries) latest.set(entry.patchId, entry.status);
    const theme = await readGameTheme();
    return {
      back: history?.canGoBack() ?? false,
      forward: history?.canGoForward() ?? false,
      ...toolbarState(),
      applied: [...latest.values()].filter((value) => value === 'applied').length,
      failed: [...latest.values()].filter((value) => value === 'failed').length,
      total: manifests.filter((patch) => patch.enabled).length,
      versionUnverified: !Object.hasOwn(matrix, runtime?.siteVer ?? 'unknown'),
      pending: [...latest.values()].filter((value) => value === 'pending').length,
      safeMode, theme,
    };
  });
  ipcMain.handle(IPC.tabs, async (_event, value: unknown) => {
    if (_event.sender !== toolbarContents || _event.senderFrame !== _event.sender.mainFrame) throw new Error('tabs-denied');
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid-tabs-action');
    const data = value as { action?: unknown; value?: unknown };
    const action = data.action;
    if (action === 'menu-open' || action === 'menu-close') {
      if (action === 'menu-close') setMenuLayout(false);
      else {
        const requestedHeight = typeof (data as { height?: unknown }).height === 'number' ? (data as { height: number }).height : 0;
        setMenuLayout(true, requestedHeight);
      }
      return { ok: true, state: toolbarState(), menu: { open: menuOpen, height: menuHeight, toolbarHeight: TOOLBAR_HEIGHT } };
    }
    if (action === 'new' || action === 'new-temp') {
      const profileId = action === 'new' ? (typeof data.value === 'string' ? data.value : defaultProfileId()) : undefined;
      const tempId = action === 'new-temp' ? randomBytes(16).toString('hex') : '';
      const profile = profileId ? hub.getProfile(profileId) : await hub.registerProfile({ id: tempId, name: 'Новый профиль', directory: join(userData, 'profiles', tempId), defaultChannel: channel, saved: false });
      if (!profile) throw new Error('profile-not-found');
      const url = `${GAME_ORIGIN}/c/${encodeURIComponent(profile.defaultChannel ?? channel)}/`;
      const tab = registerPendingTab(profile.id, url, true);
      void ensureProfile(profile).then(() => {
        if (!tabs.has(tab.id)) return;
        createTab(profile.id, url, true, tab.id);
      }).catch((error: unknown) => {
        const current = tabs.get(tab.id);
        if (current) { current.status = 'error'; current.error = error instanceof Error ? error.message : 'profile-init-failed'; }
      });
      return { ok: true, state: toolbarState() };
    }
    if (action === 'save-current-profile' || action === 'save-profile') {
      const profileId = typeof data.value === 'string' ? data.value : activeTabId ? tabs.get(activeTabId)?.profileId : undefined;
      const name = typeof (data as { name?: unknown }).name === 'string' ? (data as { name: string }).name.trim() : undefined;
      if (!profileId || !name) throw new Error('invalid-profile-save');
      await serializeProfileOperation(profileId, async () => {
        const profile = hub.getProfile(profileId);
        if (!profile) throw new Error('profile-not-found');
        if (profile.saved) throw new Error('profile-already-saved');
        await hub.saveTemporaryProfile(profileId, name);
      });
      return { ok: true, state: toolbarState() };
    }
    if (action === 'rename-profile') {
      if (typeof data.value !== 'string' || typeof (data as { name?: unknown }).name !== 'string') throw new Error('invalid-profile-rename');
      await hub.renameProfile(data.value, (data as { name: string }).name.trim());
      return { ok: true, state: toolbarState() };
    }
    if (action === 'delete-profile') {
      if (typeof data.value !== 'string') throw new Error('invalid-profile-delete');
      const profileId = data.value;
      await serializeProfileOperation(profileId, async () => {
        if (deletingProfiles.has(profileId)) throw new Error('profile-delete-in-progress');
        deletingProfiles.add(profileId);
        try {
          for (const tab of [...tabs.values()].filter((candidate) => candidate.profileId === profileId)) closeTab(tab.id, false);
          const session = hub.sessions.get(profileId);
          await hub.deleteProfile(profileId);
          runtimes.delete(profileId);
          if (session) protocolInstalling.delete(session);
        } finally {
          deletingProfiles.delete(profileId);
        }
      });
      return { ok: true, state: toolbarState() };
    }
    if (action === 'activate') {
      if (typeof data.value !== 'string') throw new Error('invalid-tabs-action');
      const tab = tabs.get(data.value);
      if (!tab) throw new Error('tab-not-found');
      activateTab(data.value);
      return { ok: true, state: toolbarState() };
    }
    if (action === 'close') {
      if (typeof data.value !== 'string') throw new Error('invalid-tabs-action');
      await closeTabWithConfirmation(data.value);
      return { ok: true, state: toolbarState() };
    }
    throw new Error('tabs-action-denied');
  });
  ipcMain.on('lgx:isolated-bootstrap', (event) => {
    const frame = gameFrameOf(event);
    if (!frame) { event.returnValue = []; return; }
    const { runtime } = frame;
    const tab = frame.tab;
    const result: Array<{ token: string; worldId: number }> = [];
    for (const patch of [...capabilities.values()].filter((candidate) => !candidate.sender)) {
      if (!eligible(patch.manifest, runtime.siteVer, new URL(event.senderFrame!.url).pathname)) continue;
      const token = randomBytes(32).toString('hex');
      const owner: Capability = { ...patch, sender: event.sender, tabId: tab.id, profileId: tab.profileId, generation: tab.documentGeneration, frame: event.senderFrame! };
      capabilities.set(token, owner);
      const issued = issuedCapabilities.get(event.sender) ?? new Map<string, Capability>();
      issued.set(token, owner); issuedCapabilities.set(event.sender, issued);
      result.push({ token, worldId: patch.worldId });
    }
    event.returnValue = result;
  });
  ipcMain.handle(IPC.patchReport, (event) => {
    const frame = gameFrameOf(event);
    if (!frame) throw new Error('patch-report-denied');
    return publicPatchReports(frame.runtime.engine.reports);
  });
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
    await mkdir(defaultProfileDir, { recursive: true });
    await writeFile(`${settingsFile}.tmp`, JSON.stringify(next, null, 2), { encoding: 'utf8', mode: 0o600 });
    await rename(`${settingsFile}.tmp`, settingsFile);
    patchOverrides = next;
    await loadPatchManifests();
    reloadAllGameTabs();
    return { ok: true };
  });
  ipcMain.handle(IPC.notify, (event, value: unknown) => {
    const frame = gameFrameOf(event);
    if (!frame) throw new Error('notify-denied');
    const data = parseNotify(value);
    const gate = notificationGates.get(event.sender) ?? new NotificationGate();
    notificationGates.set(event.sender, gate);
    if (!gate.allow()) throw new Error('notify-rate-limit');
    new Notification(data).show();
  });
  ipcMain.handle(IPC.openWindow, (event, value: unknown) => {
    const frame = gameFrameOf(event);
    if (!frame) throw new Error('url-denied');
    const url = (value as { url?: unknown })?.url;
    if (typeof url !== 'string' || !isAllowedNavigation(url)) throw new Error('url-denied');
    return shell.openExternal(url);
  });
  ipcMain.handle(IPC.netFetch, async (event, value: unknown) => {
    const frame = gameFrameOf(event);
    if (!frame || !value || typeof value !== 'object') throw new Error('patch-network-denied');
    const { runtime, tab } = frame;
    const data = value as { token?: unknown; url?: unknown; options?: unknown };
    const patch = typeof data.token === 'string' ? capabilities.get(data.token) : undefined;
    const manifest = patch?.manifest;
    if (!manifest || patch.sender !== event.sender || patch.frame !== event.senderFrame || patch.tabId !== tab.id || patch.profileId !== tab.profileId || patch.generation !== tab.documentGeneration || patch.worldId === undefined || !eligible(manifest, runtime.siteVer, new URL(event.senderFrame!.url).pathname) || typeof data.url !== 'string') throw new Error('patch-network-denied');
    if (data.options !== undefined && (!data.options || typeof data.options !== 'object' || Array.isArray(data.options))) throw new Error('invalid-network-request');
      const options = (data.options ?? {}) as Omit<FetchRequest, 'url'> & { requestId?: unknown };
      const requestId = typeof options.requestId === 'string' && options.requestId.length > 0 && options.requestId.length <= 128 ? options.requestId : randomBytes(16).toString('hex');
      const key = `${data.token}:${requestId}`;
      if (activeRequests.has(key)) throw new Error('duplicate-network-request');
      const controller = new AbortController();
      const active: ActiveRequest = { owner: patch, requestId, controller };
      activeRequests.set(key, active);
       try {
         try { return await fetchForPatch(manifest, { ...options, url: data.url, signal: controller.signal }, runtime.serverUrl); }
         catch (error) { return { status: 0, headers: {}, body: '', errorCode: error instanceof Error ? error.message : 'network-error' }; }
       } finally { if (activeRequests.get(key) === active) activeRequests.delete(key); }
  });
  ipcMain.handle(IPC.netAbort, (event, value: unknown) => {
     if (!value || typeof value !== 'object') throw new Error('network-abort-denied');
     const data = value as { requestId?: unknown; token?: unknown };
     if (typeof data.requestId !== 'string' || typeof data.token !== 'string') throw new Error('network-abort-denied');
     const request = activeRequests.get(`${data.token}:${data.requestId}`);
     if (!request || request.owner.sender !== event.sender || request.owner.frame !== event.senderFrame || request.controller.signal.aborted) throw new Error('network-abort-denied');
     request.controller.abort();
     return { ok: true };
  });
}

app.whenReady().then(async () => {
  try { const data: unknown = JSON.parse(await readFile(settingsFile, 'utf8')); if (data && typeof data === 'object' && !Array.isArray(data)) patchOverrides = data as PatchOverrides; } catch { /* Optional settings file. */ }
  try { const data: unknown = JSON.parse(await readFile(join(defaultProfileDir, 'config.json'), 'utf8')); if (data && typeof data === 'object' && 'serverUrl' in data && typeof data.serverUrl === 'string') { /* kept per-profile; default profile runtime reads it on init. */ } } catch { /* Optional profile config. */ }
  try { matrix = parseMatrix(JSON.parse(await readFile(join(app.getAppPath(), 'compat/matrix.json'), 'utf8'))); } catch { console.warn('[lg-native] compatibility matrix unavailable'); }
  installIpc(); await loadPatchManifests(); await hub.load(); await hub.cleanPending();
  tray = new Tray(nativeImage.createEmpty());
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: safeMode ? 'Выключить safe mode' : 'Включить safe mode', type: 'checkbox', checked: safeMode, click: () => { const args = process.argv.slice(1).filter((arg) => arg !== '--safe-mode'); if (!safeMode) args.push('--safe-mode'); app.relaunch({ args }); app.exit(0); } },
    { label: 'Открыть журнал патчей', click: () => { void shell.openPath(reportFile); } },
    { label: 'Открыть Legion', click: () => undefined },
  ]));
  await createMainWindow();
  let defaultProfile: AccountProfile | undefined;
  try {
    await stat(defaultProfileDir);
    defaultProfile = hub.getProfile('default') ?? await hub.registerProfile({ id: 'default', name: 'default', directory: defaultProfileDir, defaultChannel: channel, saved: true });
  } catch { /* Нет старого профиля по умолчанию — не считаем его сохранённой сессией. */ }
  const savedProfiles = hub.listProfiles().filter((profile) => profile.saved);
  for (const profile of savedProfiles) await ensureProfile(profile);
  const savedTabs = hub.listTabs().filter((tab) => hub.isSaved(tab.profileId));
  const restored = new Map<string, string>();
  for (const savedTab of savedTabs) {
    const created = createTab(savedTab.profileId, savedTab.url, false, savedTab.id);
    restored.set(savedTab.id, created.id);
  }
  const savedActive = savedTabs.find((tab) => tab.active);
  if (savedActive) activateTab(restored.get(savedActive.id)!);
  else if (!savedTabs.length && defaultProfile) createTab(defaultProfile.id, `${GAME_ORIGIN}/c/${encodeURIComponent(channel)}/`);
});
app.on('window-all-closed', async () => {
  await hub.save();
  if (process.platform !== 'darwin') app.quit();
});
app.on('before-quit', async () => {
  for (const profile of hub.listProfiles()) {
    if (!profile.saved) hub.markForCleanup(profile.directory);
  }
  await hub.save();
});

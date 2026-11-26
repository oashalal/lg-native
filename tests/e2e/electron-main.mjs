import { app, BrowserWindow, ipcMain } from 'electron';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { PatchEngine } from '../../dist/src/main/patching/engine.js';
import { AccountHub } from '../../dist/src/main/accounts/index.js';
import { installChannel } from '../../dist/src/runtime/channel.js';

app.whenReady().then(async () => {
const fixtureServer = createServer((request, response) => {
  if (request.url === '/json') { response.writeHead(200, { 'content-type': 'application/json' }); response.end(JSON.stringify({ fixture: true, count: 7 })); return; }
  response.writeHead(404); response.end('not found');
});
await new Promise((resolveListen) => fixtureServer.listen(0, '127.0.0.1', resolveListen));
const fixtureUrl = `http://127.0.0.1:${fixtureServer.address().port}/json`;
// The fixture intentionally stubs only the bootstrap/report endpoints used by preload.
ipcMain.on('lgx:isolated-bootstrap', (event) => { event.returnValue = []; });
ipcMain.handle('lgx:patch-report', () => []);
const manifest = JSON.parse(await readFile(resolve('patches/source-expose/patch.json'), 'utf8'));
const runtime = { id: 'e2e-hook', name: 'Hook', version: '1', type: 'runtime', settingsSchema: { marker: { type: 'string', label: 'Marker', default: 'enabled', public: true } }, settings: { marker: 'enabled', script: "LGX.hook(window.siteObject, 'value', (original) => original() + 10);" } };
const engine = new PatchEngine([manifest, runtime], [], false, { '86794a1329': { 'source-expose': 'ok' } });
const source = `window.siteObject = { count: 2, value() { return this.count; } };
(function() {
  let ME = null;
  const api = () => 'api';
  function nameItems() {}
  window.setSiteME = function(next) {
    ME = next; nameItems(ME && ME.hero);
  };
})();`;
const output = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: '86794a1329', channel: '5opka', page: '/c/5opka/' });
if (output.report.entries.some((entry) => entry.status !== 'applied')) throw new Error(JSON.stringify(output.report));
const dir = await mkdtemp(join(tmpdir(), 'lgx-e2e-'));
const accountDir = await mkdtemp(join(tmpdir(), 'accounts-e2e-'));
const hub = new AccountHub({ userDataDir: accountDir });
const temp = await hub.registerProfile({ name: 'Temporary', directory: join(accountDir, 'profiles', 'temp'), defaultChannel: '5opka' });
const firstTab = hub.createTab(temp.id, 'https://legiongame.gg/c/5opka/');
hub.activateTab(firstTab.id);
await hub.saveTemporaryProfile(temp.id, 'Saved account');
await hub.renameProfile(temp.id, 'Renamed account');
const second = await hub.registerProfile({ name: 'Second', directory: join(accountDir, 'profiles', 'second'), defaultChannel: '5opka', saved: true });
hub.createTab(second.id, 'https://legiongame.gg/c/5opka/');
await hub.deleteProfile(second.id);
if (hub.getProfile(second.id) || hub.listTabs().some((tab) => tab.profileId === second.id)) throw new Error('profile lifecycle cleanup failed');
await mkdir(join(accountDir, 'profiles'), { recursive: true });
await hub.save();
await writeFile(join(dir, 'lifecycle.json'), JSON.stringify({ saved: hub.getProfile(temp.id)?.saved, name: hub.getProfile(temp.id)?.name, tabs: hub.listTabs().length }));
await writeFile(join(dir, 'app.js'), output.content);
await writeFile(join(dir, 'index.html'), `<!doctype html><script>window.__fixtureUrl=${JSON.stringify(fixtureUrl)};</script><script src="app.js"></script>`);
const win = new BrowserWindow({ show: false, webPreferences: { preload: resolve('dist/src/preload/index.cjs'), contextIsolation: true, sandbox: true, nodeIntegration: false } });
await win.loadFile(join(dir, 'index.html'));
await win.webContents.executeJavaScriptInIsolatedWorld(1010, [{ code: `globalThis.testChannel = (${installChannel.toString()})('fixture', '', 'isolated'); globalThis.testChannel.on(value => { document.body.dataset.channelFromIsolated = JSON.stringify(value); globalThis.testChannel.send({ reply: value }); }); true;` }]);
app.on('before-quit', () => fixtureServer.close());

}).catch((error) => { console.error(error); app.exit(1); });

import { app, BrowserWindow, ipcMain } from 'electron';
import { readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { PatchEngine } from '../../dist/src/main/patching/engine.js';

app.whenReady().then(async () => {
ipcMain.on('lgx:isolated-bootstrap', (event) => { event.returnValue = []; });
ipcMain.handle('lgx:patch-report', () => []);
const manifest = JSON.parse(await readFile(resolve('patches/source-expose/patch.json'), 'utf8'));
const runtime = { id: 'e2e-hook', name: 'Hook', version: '1', type: 'runtime', settings: { marker: 'enabled', script: "LGX.hook(window.siteObject, 'value', (original) => original() + 10);" } };
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
await writeFile(join(dir, 'app.js'), output.content);
await writeFile(join(dir, 'index.html'), '<!doctype html><script src="app.js"></script>');
const win = new BrowserWindow({ show: false, webPreferences: { preload: resolve('dist/src/preload/index.cjs'), contextIsolation: true, sandbox: true, nodeIntegration: false } });
await win.loadFile(join(dir, 'index.html'));

}).catch((error) => { console.error(error); app.exit(1); });

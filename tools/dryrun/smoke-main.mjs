import { app, BrowserWindow } from 'electron';
import { writeFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

const fixture = process.argv.find((arg) => arg.startsWith('--fixture='))?.slice('--fixture='.length);
const resultFile = process.argv.find((arg) => arg.startsWith('--result='))?.slice('--result='.length);

app.whenReady().then(async () => {
  if (!fixture || !resultFile) throw new Error('smoke-arguments-missing');
  const window = new BrowserWindow({ show: false, webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true } });
  await window.loadFile(`${fixture}/index.html`);
  await setTimeout(100);
  const result = await window.webContents.executeJavaScript(`(() => {
    const rule = [...document.styleSheets].flatMap((sheet) => { try { return [...sheet.cssRules]; } catch { return []; } }).find((item) => item.selectorText === '.site-head' && item.cssText.includes('outline'));
    const calls = window.__lgRuntimeCalls || [];
    return { css: Boolean(rule), runtime: calls.some((call) => call.includes('runtime-live')), requires: !calls.some((call) => call.includes('requirement-missing')) };
  })()`);
  await writeFile(resultFile, `${JSON.stringify(result)}\n`);
  window.destroy();
  app.quit();
}).catch(async (error) => {
  if (resultFile) await writeFile(resultFile, `${JSON.stringify({ error: error instanceof Error ? error.message : String(error) })}\n`);
  app.exit(1);
});

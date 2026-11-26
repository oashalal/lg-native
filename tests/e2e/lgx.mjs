import { _electron as electron } from '@playwright/test';
import { strict as assert } from 'node:assert';
import electronPath from 'electron';
import { resolve } from 'node:path';
import { installChannel } from '../../dist/src/runtime/channel.js';

const electronEnv = { ...process.env };
delete electronEnv.ELECTRON_RUN_AS_NODE;
const app = await electron.launch({ env: electronEnv, executablePath: electronPath, args: [resolve('tests/e2e/electron-main.mjs')] });
try {
  const page = await app.firstWindow();
  await page.waitForFunction(() => globalThis.LGX && globalThis.siteObject.value() === 12);
  const result = await page.evaluate(() => {
    globalThis.setSiteME({ hero: { name: 'first' } });
    const first = globalThis.LGX.expose('ME');
    globalThis.setSiteME({ hero: { name: 'second' } });
    const second = globalThis.LGX.expose('ME');
    globalThis.siteObject.count = 5;
    return { first: first.hero.name, second: second.hero.name, value: globalThis.siteObject.value(), version: globalThis.LGX.version().siteVer, settings: globalThis.LGX.settings('e2e-hook') };
  });
  assert.deepEqual(result, { first: 'first', second: 'second', value: 15, version: '86794a1329', settings: { marker: 'enabled' } });

  await page.evaluate((source) => { const channel = (0, eval)(`(${source})`)('fixture', '', 'page'); channel.on((value) => { document.body.dataset.channelReply = JSON.stringify(value); }); channel.send({ hello: 'world' }); }, installChannel.toString());
  await page.waitForFunction(() => document.body.dataset.channelReply);
  assert.deepEqual(JSON.parse(await page.locator('body').getAttribute('data-channel-reply')), { reply: { hello: 'world' } });

  const ui = await page.evaluate(() => {
    const text = globalThis.LGX.ui.text('<img src=x onerror=alert(1)>');
    const mounted = globalThis.LGX.mount('e2e-ui', text);
    const first = globalThis.LGX.hud.button('e2e-button', 'Fixture button', () => {});
    const duplicate = globalThis.LGX.hud.button('e2e-button', 'Duplicate', () => {});
    const modal = globalThis.LGX.modal('e2e-modal', 'fixture modal');
    const channel = [];
    const off = globalThis.LGX.channel.on((value) => channel.push(value));
    globalThis.LGX.channel.send({ from: 'page', count: 1 });
    off();
    const output = {
      renderedAsText: mounted.textContent === '<img src=x onerror=alert(1)>',
      noInjectedImage: mounted.querySelector('img') === null,
      buttonDeduped: first === duplicate,
      modalRole: modal.element.querySelector('[role="dialog"]')?.getAttribute('aria-modal'),
      channel,
    };
    modal.close(); globalThis.LGX.dispose();
    return output;
  });
  assert.deepEqual(ui, { renderedAsText: true, noInjectedImage: true, buttonDeduped: true, modalRole: 'true', channel: [{ from: 'page', count: 1 }] });
  const nested = await page.evaluate(() => { document.body.style.overflow = 'auto'; const first = globalThis.LGX.modal('first', 'first'); const second = globalThis.LGX.modal('second', 'second'); first.close(); const locked = document.body.style.overflow; second.close(); second.close(); return [locked, document.body.style.overflow]; });
  assert.deepEqual(nested, ['hidden', 'auto']);
  const lifecycle = await page.evaluate(async () => JSON.parse(await (await globalThis.fetch(new URL('lifecycle.json', globalThis.location.href))).text()));
  assert.deepEqual(lifecycle, { saved: true, name: 'Renamed account', tabs: 1 });

  console.log('Electron LGX e2e passed');
} finally { await app.close(); }

import { _electron as electron } from '@playwright/test';
import { strict as assert } from 'node:assert';
import electronPath from 'electron';
import { resolve } from 'node:path';

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
  const lifecycle = await page.evaluate(async () => JSON.parse(await (await globalThis.fetch(new URL('lifecycle.json', globalThis.location.href))).text()));
  assert.deepEqual(lifecycle, { saved: true, name: 'Renamed account', tabs: 1 });

  console.log('Electron LGX e2e passed');
} finally { await app.close(); }

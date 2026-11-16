import { chromium } from '@playwright/test';

const channel = process.argv[2] ?? '5opka';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const sockets = [];
page.on('websocket', (socket) => sockets.push(socket.url()));
const started = performance.now();
await page.goto(`https://legiongame.gg/c/${encodeURIComponent(channel)}/`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
const metrics = await page.evaluate(() => ({
  domContentLoaded: performance.getEntriesByType('navigation')[0]?.toJSON().domContentLoadedEventEnd ?? null,
  loadEvent: performance.getEntriesByType('navigation')[0]?.toJSON().loadEventEnd ?? null,
  webgl: Boolean(document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl')),
  interactive: document.readyState,
}));
console.log(JSON.stringify({ channel, elapsedMs: Math.round(performance.now() - started), sockets, ...metrics }));
await browser.close();

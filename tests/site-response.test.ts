import { createServer, type Server } from 'node:http';
import { gzipSync } from 'node:zlib';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CacheStore } from '../src/main/net/cache.js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const profile = await mkdtemp(join(tmpdir(), 'lg-site-'));
vi.mock('electron', () => ({ app: { getPath: () => profile, whenReady: () => new Promise(() => {}), on: () => {} } }));
const { fetchSite } = await import('../src/main/app.js');
const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
let server: Server;
let port: number;
let requests = 0;
beforeAll(async () => {
  server = createServer((req, res) => {
    requests++;
    if (req.url === '/missing') { res.writeHead(404, { 'content-type': 'text/plain', 'x-original': 'yes' }); res.end('missing'); return; }
    if (req.url === '/unchanged') { res.writeHead(304, { 'x-original': 'yes' }); res.end(); return; }
    const body = gzipSync(svg);
    res.writeHead(200, { 'content-type': 'image/svg+xml', 'content-encoding': 'gzip', 'content-length': body.length, connection: 'close' });
    res.end(body);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  port = (server.address() as { port: number }).port;
});
afterAll(async () => { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); await rm(profile, { recursive: true, force: true }); });
const session = { fetch: (request: Request) => fetch(`http://127.0.0.1:${port}${new URL(request.url).pathname}${new URL(request.url).search}`) } as unknown as Electron.Session;
const handle = (path: string) => fetchSite(new Request(`https://legiongame.gg${path}`), session);

describe('site protocol responses', () => {
  it('returns decoded SVG with safe headers', async () => {
    const response = await handle('/site/ui-icons/a.svg');
    expect(await response.text()).toBe(svg);
    expect(response.headers.get('content-type')).toBe('image/svg+xml');
    for (const header of ['content-encoding', 'content-length', 'transfer-encoding', 'connection']) expect(response.headers.has(header)).toBe(false);
  });
  it('preserves SVG type on a versioned cache hit', async () => {
    await handle('/site/ui-icons/a.svg?v=1');
    const count = requests;
    const response = await handle('/site/ui-icons/a.svg?v=1');
    expect(requests).toBe(count);
    expect(await response.text()).toBe(svg);
    expect(response.headers.get('content-type')).toBe('image/svg+xml');
  });
  it('passes a 404 response through unchanged', async () => {
    const response = await handle('/missing');
    expect(response.status).toBe(404);
    expect(response.headers.get('x-original')).toBe('yes');
    expect(await response.text()).toBe('missing');
  });
  it('passes a 304 response through unchanged', async () => {
    const response = await handle('/unchanged');
    expect(response.status).toBe(304);
    expect(response.headers.get('x-original')).toBe('yes');
  });
  it('infers the type of an old cache entry', async () => {
    const cache = new CacheStore(join(profile, 'profiles', 'default', 'cache'));
    await cache.put('https://legiongame.gg/site/old.webp?v=1', Buffer.from('old'));
    const response = await handle('/site/old.webp?v=1');
    expect(response.headers.get('content-type')).toBe('image/webp');
    expect(await response.text()).toBe('old');
  });
});

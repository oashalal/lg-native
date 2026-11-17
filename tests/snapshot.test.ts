import { createServer, type Server } from 'node:http';
import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

// @ts-expect-error The snapshot tool is an executable JavaScript module.
const { createSnapshot, readSessionValue } = await import('../tools/snapshot/index.mjs');

const servers: Server[] = [];
afterEach(async () => { for (const server of servers.splice(0)) await new Promise((resolve) => server.close(resolve)); });

function listen(server: Server): Promise<number> {
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', () => resolve((server.address() as { port: number }).port)); });
}

describe('snapshot tool', () => {
  it('keeps the session cookie on the origin and omits it after a cross-host redirect', async () => {
    const externalRequests: string[] = [];
    const external = createServer((request, response) => { externalRequests.push(request.headers.cookie ?? ''); response.writeHead(404); response.end(); });
    const externalPort = await listen(external); servers.push(external);
    const originRequests: string[] = [];
    const origin = createServer((request, response) => {
      originRequests.push(request.headers.cookie ?? '');
      if (request.url === '/site/ver') { response.setHeader('content-type', 'application/json'); response.end('{"v":"test-version"}'); return; }
      if (request.url?.startsWith('/c/test/')) { response.setHeader('content-type', 'text/html'); response.end('<script src="/site/app.js?v=one"></script><script src="/site/redirect.js?v=two"></script>'); return; }
      if (request.url?.startsWith('/site/app.js')) { response.setHeader('content-type', 'application/javascript'); response.end('fetch("/site/child.js?v=three")'); return; }
      if (request.url?.startsWith('/site/child.js')) { response.setHeader('content-type', 'application/javascript'); response.end('console.log("ok")'); return; }
      if (request.url?.startsWith('/site/redirect.js')) { response.writeHead(302, { location: `http://127.0.0.1:${externalPort}/secret.js?v=four` }); response.end(); return; }
      response.writeHead(404); response.end();
    });
    const port = await listen(origin); servers.push(origin);
    const root = await mkdtemp(join(tmpdir(), 'lg-snapshot-'));
    try {
      const manifest = await createSnapshot({ origin: `http://127.0.0.1:${port}`, channel: 'test', snapshotRoot: root, session: 'session-secret' });
      expect(manifest.counts).toEqual({ versioned_total: 3, downloaded: 2, versioned_missing: 1 });
      expect(originRequests.filter((cookie) => cookie).length).toBeGreaterThan(0);
      expect(externalRequests).toEqual(['']);
      expect(await readFile(join(root, 'test-version', 'site', 'app.js'), 'utf8')).toContain('child.js');
      expect(JSON.stringify(manifest)).not.toContain('session-secret');
    } finally { await rm(root, { recursive: true, force: true }); }
  });

  it('rejects a response that contains the session value before writing it', async () => {
    const server = createServer((request, response) => { if (request.url === '/site/ver') response.end('{"v":"leak"}'); else if (request.url?.startsWith('/c/')) { response.setHeader('content-type', 'text/html'); response.end('<script src="/site/leak.js?v=1"></script>'); } else response.end('session-secret'); });
    const port = await listen(server); servers.push(server);
    const root = await mkdtemp(join(tmpdir(), 'lg-snapshot-leak-'));
    try { await expect(createSnapshot({ origin: `http://127.0.0.1:${port}`, channel: 'test', snapshotRoot: root, session: 'session-secret' })).rejects.toThrow('lsid value found'); }
    finally { await rm(root, { recursive: true, force: true }); }
  });

  it('rejects an lsid file wider than 600', async () => {
    const home = await mkdtemp(join(tmpdir(), 'lg-lsid-'));
    try {
      const path = join(home, '.config', 'lg-native');
      await (await import('node:fs/promises')).mkdir(path, { recursive: true });
      const file = join(path, 'lsid');
      await writeFile(file, 'session-secret\n', { mode: 0o644 });
      await chmod(file, 0o644);
      await expect(readSessionValue({}, home)).rejects.toThrow('permissions must be 600');
    } finally { await rm(home, { recursive: true, force: true }); }
  });
});

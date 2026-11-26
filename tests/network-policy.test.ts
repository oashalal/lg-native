import { createServer, type Server } from 'node:http';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { allowedHost, assertSuccessfulJson, fetchForPatch } from '../src/main/net/network-policy.js';
import { parseManifest } from '../src/shared/manifest.js';

const manifest = { id: 'x', name: 'x', version: '1', type: 'runtime' as const, enabled: true, siteVersions: [], strict: false, scope: { channels: ['*'], pages: ['*'] }, targets: [], requires: [], onFail: 'disable' as const, settings: {}, network: { hosts: ['api.example.com'], endpoints: ['/a'] } };
const servers: Server[] = [];
async function serve(handler: (request: import('node:http').IncomingMessage, response: import('node:http').ServerResponse) => void): Promise<string> {
  const server = createServer(handler); servers.push(server);
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const address = server.address(); if (!address || typeof address === 'string') throw new Error('no-address');
  return `http://127.0.0.1:${address.port}`;
}
afterEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});
const local = (base: string, network: Record<string, unknown> = {}) => ({ ...manifest, network: { hosts: [new URL(base).host], endpoints: ['/'], ...network } }) as typeof manifest;

describe('network policy', () => {
  it('allows configured HTTPS host only, rejects credentials, fragments, schemes in hosts and unsafe ports', () => {
    expect(allowedHost(manifest, 'https://api.example.com/a')).toBe(true);
    for (const url of ['https://evil.example/a', 'http://api.example.com/a', 'https://u:p@api.example.com/a', 'https://api.example.com:444/a', 'https://api.example.com/a#x', 'https://api.example.com/%2fadmin']) expect(allowedHost(manifest, url)).toBe(false);
    expect(allowedHost({ ...manifest, network: { hosts: ['https://api.example.com'] } }, 'https://api.example.com/a')).toBe(false);
    expect(allowedHost({ ...manifest, network: { hosts: ['localhost'] } }, 'http://localhost/a')).toBe(true);
  });
  it('validates host syntax, permits named endpoints without duplicating their paths, and supports per-path query schemas', async () => {
    const base = await serve((_req, res) => res.end('ok'));
    const host = new URL(base).host;
    expect(() => parseManifest({ id: 'bad-host', name: 'Bad', version: '1', type: 'runtime', network: { hosts: ['https://example.com'] } })).toThrow();
    expect(() => parseManifest({ id: 'bad-host', name: 'Bad', version: '1', type: 'runtime', network: { hosts: ['example.com/path'] } })).toThrow();
    expect(() => parseManifest({ id: 'bad-host', name: 'Bad', version: '1', type: 'runtime', network: { hosts: ['Example.com'] } })).toThrow();
    expect(parseManifest({ id: 'valid', name: 'Valid', version: '1', type: 'runtime', network: { hosts: [host], query: { '/status': { verbose: { type: 'boolean' } } } } }).network?.query).toHaveProperty('/status');
    const m = { ...manifest, network: { hosts: ['$serverUrl', host], endpoints: [], namedEndpoints: { status: `${base}/status` }, query: { '/status': { verbose: { type: 'boolean' as const, required: true, maxLength: 8 } } } } };
    expect((await fetchForPatch(m, { url: `${base}/status?verbose=true` }, base)).body).toBe('ok');
    await expect(fetchForPatch(m, { url: 'status' }, base)).rejects.toThrow('invalid-query');
    await expect(fetchForPatch(m, { url: `${base}/other?verbose=true` }, base)).rejects.toThrow('endpoint-not-allowed');
    const other = await serve((_req, res) => res.end('wrong host'));
    const restricted = { ...m, network: { ...m.network, hosts: [host, new URL(other).host] } };
    await expect(fetchForPatch(restricted, { url: `${other}/status?verbose=true` }, base)).rejects.toThrow('endpoint-not-allowed');
    const serverNamed = { ...restricted, network: { ...restricted.network, namedEndpoints: { status: '$serverUrl/status' } } };
    await expect(fetchForPatch(serverNamed, { url: `${other}/status?verbose=true` }, base)).rejects.toThrow('endpoint-not-allowed');
  });
  it('requires exact allowlisted paths and disallows an empty path allowlist', async () => {
    await expect(fetchForPatch({ ...manifest, network: { hosts: ['api.example.com'] } }, { url: 'https://api.example.com/a' })).rejects.toThrow('endpoint-not-allowed');
    await expect(fetchForPatch(manifest, { url: 'https://api.example.com/a/..' })).rejects.toThrow('endpoint-not-allowed');
    await expect(fetchForPatch(manifest, { url: 'https://api.example.com/a?x=1' })).rejects.toThrow('invalid-query');
  });
  it('validates query key, cardinality, type, required and maximum length', async () => {
    const m = { ...manifest, network: { ...manifest.network, query: { q: { type: 'string' as const, required: true, maxLength: 4 }, n: { type: 'number' as const, required: false, maxLength: 8 }, b: { type: 'boolean' as const, required: false, maxLength: 5 } } } };
    for (const query of ['', '?q=x&unknown=1', '?q=x&q=y', '?q=12345', '?q=x&n=NaN', '?q=x&b=1']) await expect(fetchForPatch(m, { url: `https://api.example.com/a${query}` })).rejects.toThrow('invalid-query');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(fetchForPatch(m, { url: 'https://api.example.com/a?q=ok&n=-1.2e3&b=true' })).rejects.toThrow('network-error');
  });
  it('resolves named fixed and profile server endpoints under the same policy', async () => {
    const base = await serve((_req, res) => res.end('ok'));
    const m = { ...manifest, network: { hosts: ['$serverUrl', new URL(base).host], endpoints: ['/'], namedEndpoints: { health: '$serverUrl/', fixed: `${base}/` } } };
    expect((await fetchForPatch(m, { url: 'health' }, base)).body).toBe('ok');
    expect((await fetchForPatch(m, { url: 'fixed' })).body).toBe('ok');
    await expect(fetchForPatch(m, { url: 'health' })).rejects.toThrow('endpoint-not-allowed');
    await expect(fetchForPatch(m, { url: '$serverUrl' }, base)).rejects.toThrow('host-not-allowed');
  });
  it('checks host, path and query policy on every redirect', async () => {
    const evil = await serve((_req, res) => res.end('leak'));
    const origin = await serve((_req, res) => { res.writeHead(302, { location: `${evil}/` }); res.end(); });
    await expect(fetchForPatch(local(origin), { url: `${origin}/` })).rejects.toThrow('host-not-allowed');
    const pathOrigin = await serve((_req, res) => { res.writeHead(302, { location: '/other' }); res.end(); });
    await expect(fetchForPatch(local(pathOrigin), { url: `${pathOrigin}/` })).rejects.toThrow('endpoint-not-allowed');
  });
  it('omits cookies and forbids unsafe headers, methods and bodies', async () => {
    const origin = await serve((req, res) => { expect(req.headers.cookie).toBeUndefined(); res.end('ok'); });
    expect((await fetchForPatch(local(origin), { url: `${origin}/` })).body).toBe('ok');
    await expect(fetchForPatch(local(origin), { url: `${origin}/`, headers: { Cookie: 'secret' } })).rejects.toThrow('network-header-denied');
    await expect(fetchForPatch(local(origin), { url: `${origin}/`, method: 'POST' })).rejects.toThrow('network-method-denied');
    await expect(fetchForPatch(local(origin), { url: `${origin}/`, body: 'x' })).rejects.toThrow('network-body-denied');
  });
  it('enforces streamed byte limits and maps abort/timeout to stable errors', async () => {
    const large = await serve((_req, res) => res.end('too long'));
    await expect(fetchForPatch(local(large, { maxBytes: 2 }), { url: `${large}/` })).rejects.toThrow('too-large');
    const slow = await serve(() => { /* hold response until client closes */ });
    await expect(fetchForPatch(local(slow, { timeoutMs: 10 }), { url: `${slow}/` })).rejects.toThrow('timeout');
    const controller = new AbortController(); controller.abort();
    await expect(fetchForPatch(local(slow), { url: `${slow}/`, signal: controller.signal })).rejects.toThrow('aborted');
  });
  it('returns status and validates JSON contract with stable errors', () => {
    expect(assertSuccessfulJson({ status: 200, headers: {}, body: '{"ok":true}' })).toEqual({ ok: true });
    expect(() => assertSuccessfulJson({ status: 503, headers: {}, body: '{}' })).toThrow('bad-status:503');
    expect(() => assertSuccessfulJson({ status: 200, headers: {}, body: 'nope' })).toThrow('invalid-json');
  });
});

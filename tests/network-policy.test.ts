import { createServer } from 'node:http';
import { describe, expect, it } from 'vitest';
import { allowedHost, fetchForPatch } from '../src/main/net/network-policy.js';

const manifest = { id: 'x', name: 'x', version: '1', type: 'runtime' as const, enabled: true, siteVersions: [], strict: false, scope: { channels: ['*'], pages: ['*'] }, targets: [], requires: [], onFail: 'disable' as const, settings: {}, network: { hosts: ['api.example.com'] } };
describe('network policy', () => {
  it('allows configured https host and rejects other hosts', () => { expect(allowedHost(manifest, 'https://api.example.com/a')).toBe(true); expect(allowedHost(manifest, 'https://evil.example/a')).toBe(false); expect(allowedHost(manifest, 'http://api.example.com/a')).toBe(false); });
  it('fetches a localhost allowlisted response without game cookies', async () => {
    const server = createServer((request, response) => { expect(request.headers.cookie).toBeUndefined(); response.end('patch-data'); });
    try { await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); }); } catch (error) { if ((error as NodeJS.ErrnoException).code === 'EPERM') return; throw error; }
    const address = server.address(); if (!address || typeof address === 'string') throw new Error('no-address');
    const localManifest = { ...manifest, network: { hosts: ['localhost'] } };
    const result = await fetchForPatch(localManifest, { url: `http://localhost:${address.port}/data` });
    expect(result.body).toBe('patch-data'); await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });
});

import { strict as assert } from 'node:assert';
/* global AbortController */
import { createServer } from 'node:http';
import { fetchForPatch, assertSuccessfulJson } from '../../dist/src/main/net/network-policy.js';

const servers = [];
async function serve(handler) {
  const server = createServer(handler);
  servers.push(server);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  assert(address && typeof address !== 'string');
  return `http://127.0.0.1:${address.port}`;
}

const manifestFor = (base, extra = {}) => ({
  id: 'e2e-network',
  name: 'Network e2e',
  version: '1',
  type: 'runtime',
  enabled: true,
  siteVersions: [],
  strict: false,
  scope: { channels: ['*'], pages: ['*'] },
  targets: [],
  requires: [],
  onFail: 'disable',
  settings: {},
  network: { hosts: [new URL(base).host], endpoints: ['/json'], ...extra },
});

const closeAll = async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise((resolve) => server.close(resolve))));
};

try {
  const api = await serve((request, response) => {
    if (request.url === '/json') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end('{"ok":true,"source":"production-policy"}');
      return;
    }
    if (request.url === '/redirect-host') {
      response.writeHead(302, { location: 'https://evil.example/json' });
      response.end();
      return;
    }
    if (request.url === '/redirect-path') {
      response.writeHead(302, { location: '/private' });
      response.end();
      return;
    }
    if (request.url === '/large') {
      response.end('0123456789');
      return;
    }
    if (request.url === '/slow') return;
    response.writeHead(404);
    response.end('{}');
  });

  const success = await fetchForPatch(manifestFor(api), { url: `${api}/json` });
  assert.deepEqual(assertSuccessfulJson(success), { ok: true, source: 'production-policy' });

  await assert.rejects(fetchForPatch(manifestFor(api), { url: `${api}/private` }), /endpoint-not-allowed/);
  await assert.rejects(fetchForPatch(manifestFor(api, { query: { allowed: { type: 'string', required: true, maxLength: 8 } } }), { url: `${api}/json?unexpected=1` }), /invalid-query/);

  const redirectManifest = manifestFor(api, { endpoints: ['/redirect-host', '/redirect-path'] });
  await assert.rejects(fetchForPatch(redirectManifest, { url: `${api}/redirect-host` }), /host-not-allowed/);
  await assert.rejects(fetchForPatch(redirectManifest, { url: `${api}/redirect-path` }), /endpoint-not-allowed/);

  await assert.rejects(fetchForPatch(manifestFor(api, { endpoints: ['/large'], maxBytes: 2 }), { url: `${api}/large` }), /too-large/);
  await assert.rejects(fetchForPatch(manifestFor(api, { endpoints: ['/slow'], timeoutMs: 20 }), { url: `${api}/slow` }), /timeout/);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(fetchForPatch(manifestFor(api, { endpoints: ['/slow'] }), { url: `${api}/slow`, signal: controller.signal }), /aborted/);

  console.log('Production network policy e2e passed');
} finally {
  await closeAll();
}

import { mkdir, writeFile, open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { homedir } from 'node:os';
import { join, posix } from 'node:path';

const GAME_ORIGIN = 'https://legiongame.gg';
const DEFAULT_CHANNEL = process.env.LG_CHANNEL ?? '5opka';
const DEFAULT_ROOT = join(process.cwd(), 'fixtures', 'snapshots');

export class SnapshotSessionExpired extends Error {
  constructor() { super('обновите lsid'); this.name = 'SnapshotSessionExpired'; }
}

export function readSessionValue(env = process.env, home = homedir()) {
  const fromEnvironment = env.LG_LSID?.trim();
  if (fromEnvironment) return fromEnvironment;
  const path = join(home, '.config', 'lg-native', 'lsid');
  return open(path, 'r').then(async (file) => {
    try {
    const mode = (await file.stat()).mode & 0o777;
    if (mode !== 0o600) throw new Error('lsid file permissions must be 600');
    const result = (await file.readFile('utf8')).trim();
    if (!result) throw new Error('lsid is empty');
    return result;
    } finally { await file.close(); }
  });
}

function isVersionedUrl(raw, origin) {
  try {
    const url = new URL(raw, origin);
    return url.origin === origin && Boolean(url.searchParams.get('v')) && url.pathname.startsWith('/') && !url.pathname.includes('..');
  } catch { return false; }
}

export function findVersionedUrls(text, baseUrl, origin = new URL(baseUrl).origin) {
  const urls = new Set();
  const add = (raw) => { if (isVersionedUrl(raw, origin)) urls.add(new URL(raw, baseUrl).toString()); };
  for (const match of text.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) add(match[1]);
  for (const match of text.matchAll(/(?:["'`])((?:https?:\/\/|\/)[^"'`\s<>]+\?[^"'`\s<>]*\bv=[^"'`\s<>]+)(?:["'`])/gi)) add(match[1]);
  for (const match of text.matchAll(/window\.LG_SITEF\s*=\s*(\{[^;]*?\})\s*;/g)) {
    try {
      for (const [name, version] of Object.entries(JSON.parse(match[1]))) {
        if (typeof version !== 'string') continue;
        const path = name.startsWith('@') ? `/c/${new URL(baseUrl).pathname.split('/')[2]}/${name.slice(1)}` : name.startsWith('/') ? name : `/site/${name}`;
        add(`${path}?v=${encodeURIComponent(version)}`);
      }
    } catch { /* Ignore an invalid map. */ }
  }
  return [...urls];
}

async function requestWithRedirects(rawUrl, cookie, origin, fetchImpl, maxRedirects = 5) {
  let current = rawUrl;
  for (let attempt = 0; attempt <= maxRedirects; attempt += 1) {
    const currentUrl = new URL(current);
    const headers = currentUrl.origin === origin ? { cookie: `lsid=${cookie}` } : {};
    const response = await fetchImpl(current, { redirect: 'manual', headers });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) return { response, finalUrl: current };
      current = new URL(location, current).toString();
      if (/(?:^|\/)(?:login|auth)(?:\/|$)/i.test(new URL(current).pathname)) throw new SnapshotSessionExpired();
      continue;
    }
    return { response, finalUrl: current };
  }
  throw new Error('too-many-redirects');
}

function ensureSession(response, finalUrl) {
  if ([401, 403].includes(response.status)) throw new SnapshotSessionExpired();
  const path = new URL(finalUrl).pathname.toLowerCase();
  if (/(?:^|\/)login(?:\/|$)/.test(path) || /(?:^|\/)auth(?:\/|$)/.test(path)) throw new SnapshotSessionExpired();
}

function assertNoCookie(body, cookie) {
  if (cookie && body.includes(Buffer.from(cookie))) throw new Error('lsid value found in downloaded data');
}

function relativeFilePath(rawUrl) {
  const url = new URL(rawUrl);
  const normalized = posix.normalize(url.pathname);
  if (!normalized.startsWith('/') || normalized.includes('/../')) throw new Error('invalid-snapshot-path');
  return normalized.slice(1);
}

export async function createSnapshot({ origin = GAME_ORIGIN, channel = DEFAULT_CHANNEL, snapshotRoot = DEFAULT_ROOT, session, fetchImpl = globalThis.fetch }) {
  if (!session) throw new Error('lsid is required');
  const versionRequest = await requestWithRedirects(`${origin}/site/ver`, session, origin, fetchImpl);
  ensureSession(versionRequest.response, versionRequest.finalUrl);
  const versionBody = Buffer.from(await versionRequest.response.arrayBuffer());
  assertNoCookie(versionBody, session);
  if (!versionRequest.response.ok) throw new Error('site-version-unavailable');
  let versionData;
  try { versionData = JSON.parse(versionBody.toString('utf8')); } catch { throw new Error('invalid-site-version'); }
  const version = typeof versionData?.v === 'string' && /^[a-zA-Z0-9_-]+$/.test(versionData.v) ? versionData.v : undefined;
  if (!version) throw new Error('invalid-site-version');

  const root = join(snapshotRoot, version);
  await mkdir(root, { recursive: true });
  const queue = [`${origin}/c/${encodeURIComponent(channel)}/`];
  const seen = new Set();
  const missing = [];
  const downloaded = [];
  while (queue.length) {
    const rawUrl = queue.shift();
    if (!rawUrl || seen.has(rawUrl)) continue;
    seen.add(rawUrl);
    const request = await requestWithRedirects(rawUrl, session, origin, fetchImpl);
    ensureSession(request.response, request.finalUrl);
    const versioned = isVersionedUrl(rawUrl, origin);
    if (request.response.status === 404) { if (versioned) missing.push(rawUrl); continue; }
    if (!request.response.ok) { if (versioned) missing.push(rawUrl); continue; }
    const body = Buffer.from(await request.response.arrayBuffer());
    assertNoCookie(body, session);
    if (new URL(request.finalUrl).origin !== origin) { if (versioned) missing.push(rawUrl); continue; }
    if (versioned) {
      const filePath = join(root, relativeFilePath(rawUrl));
      await mkdir(join(filePath, '..'), { recursive: true });
      await writeFile(filePath, body, { mode: 0o600 });
      downloaded.push(rawUrl);
    }
    const type = request.response.headers.get('content-type') ?? '';
    if (/javascript|css|html|text\//i.test(type) || /\.(?:js|css|html)(?:$|\?)/i.test(new URL(rawUrl).pathname)) {
      for (const discovered of findVersionedUrls(body.toString('utf8'), rawUrl, origin)) if (!seen.has(discovered)) queue.push(discovered);
    }
  }
  const manifest = {
    schema_version: 1,
    kind: 'version',
    site_ver: version,
    complete: missing.length === 0,
    publication_status: missing.length === 0 ? 'complete' : 'partial',
    origin,
    channel,
    counts: { versioned_total: downloaded.length + missing.length, downloaded: downloaded.length, versioned_missing: missing.length },
    missing,
  };
  assertNoCookie(Buffer.from(JSON.stringify(manifest)), session);
  await writeFile(join(root, 'snapshot_manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
  return manifest;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const session = await readSessionValue();
    const manifest = await createSnapshot({ session });
    console.log(JSON.stringify({ downloaded: manifest.counts.downloaded, missing: manifest.counts.versioned_missing, versioned_missing: manifest.counts.versioned_missing }));
    if (!manifest.complete) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof SnapshotSessionExpired ? error.message : error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

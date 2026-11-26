import type { PatchManifest } from '../../shared/manifest.js';

export interface FetchRequest { url: string; method?: string; headers?: Record<string, string>; body?: string; signal?: AbortSignal; }
export interface FetchResponse { status: number; headers: Record<string, string>; body: string; }

const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]']);
function fail(code: string): never { throw new Error(code); }

function parseUrl(rawUrl: string): URL | undefined {
  try {
    // Reject ambiguous encoded separators and malformed percent escapes before URL normalization.
    if (/%(?![\da-f]{2})/i.test(rawUrl) || /%2f|%5c/i.test(rawUrl)) return;
    const url = new URL(rawUrl);
    if (url.username || url.password || url.hash) return;
    return url;
  } catch { return; }
}

export function allowedHost(manifest: PatchManifest, rawUrl: string, serverUrl?: string): boolean {
  const url = parseUrl(rawUrl);
  if (!url) return false;
  const localhost = LOOPBACK.has(url.hostname.toLowerCase());
  if (url.protocol !== 'https:' && !(localhost && url.protocol === 'http:')) return false;
  return (manifest.network?.hosts ?? []).some((host) => {
    if (host === '$serverUrl') {
      let server: URL | undefined;
      try { if (serverUrl) server = new URL(serverUrl); } catch { return false; }
      return !!server && server.origin === url.origin;
    }
    return host === host.toLowerCase() && !host.includes('://') && !host.includes('/') && host === url.host.toLowerCase();
  });
}

function allowedPath(manifest: PatchManifest, url: URL, serverUrl?: string): boolean {
  const paths = manifest.network?.endpoints ?? [];
  const namedTargets = Object.values(manifest.network?.namedEndpoints ?? {}).flatMap((target) => {
    try {
      if (target.startsWith('$serverUrl')) {
        if (!/^\$serverUrl(?:\/|$)/.test(target)) return [];
        const path = target.slice('$serverUrl'.length) || '/';
        const base = serverUrl && parseUrl(serverUrl);
        return base && base.origin === url.origin && new URL(path, base).pathname === url.pathname ? [url.origin] : [];
      }
      const parsed = parseUrl(target);
      return parsed?.pathname === url.pathname && parsed.origin === url.origin ? [parsed.origin] : [];
    } catch { return []; }
  });
  return paths.includes(url.pathname) || namedTargets.includes(url.origin);
}

function validateQuery(manifest: PatchManifest, url: URL): void {
  const configured = manifest.network?.query ?? {};
  const perPath = Object.keys(configured).some((key) => key.startsWith('/'));
  const schema = (perPath ? configured[url.pathname] ?? {} : configured) as Record<string, { type: 'string' | 'number' | 'boolean'; required: boolean; maxLength: number }>;
  for (const key of url.searchParams.keys()) if (!Object.hasOwn(schema, key)) fail('invalid-query');
  for (const [key, spec] of Object.entries(schema)) {
    const values = url.searchParams.getAll(key);
    if (values.length > 1) fail('invalid-query');
    if (!values.length) { if (spec.required) fail('invalid-query'); continue; }
    const value = values[0]!;
    if (value.length > spec.maxLength) fail('invalid-query');
    if (spec.type === 'number' && (!/^-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value) || !Number.isFinite(Number(value)))) fail('invalid-query');
    if (spec.type === 'boolean' && value !== 'true' && value !== 'false') fail('invalid-query');
  }
}

function resolveTarget(manifest: PatchManifest, target: string, serverUrl?: string): string {
  const named = manifest.network?.namedEndpoints?.[target];
  if (named === undefined) return target;
  if (named.startsWith('$serverUrl')) {
    if (!/^\$serverUrl(?:\/|$)/.test(named) || !serverUrl) fail('endpoint-not-allowed');
    const base = parseUrl(serverUrl);
    if (!base || base.username || base.password) fail('endpoint-not-allowed');
    return new URL(named.slice('$serverUrl'.length) || '/', base).toString();
  }
  return named;
}

export async function fetchForPatch(manifest: PatchManifest, request: FetchRequest, serverUrl?: string): Promise<FetchResponse> {
  if (!request || typeof request.url !== 'string' || (request.body !== undefined && typeof request.body !== 'string') || (request.method !== undefined && typeof request.method !== 'string')) fail('invalid-network-request');
  const method = (request.method ?? 'GET').toUpperCase();
  if (method !== 'GET') fail('network-method-denied');
  if (request.body !== undefined) fail('network-body-denied');
  const headers = new Headers(request.headers);
  for (const name of ['cookie', 'cookie2', 'authorization', 'proxy-authorization', 'host', 'origin', 'referer', 'user-agent', 'set-cookie']) if (headers.has(name)) fail('network-header-denied');
  let url = resolveTarget(manifest, request.url, serverUrl);
  const timeout = AbortSignal.timeout(manifest.network?.timeoutMs ?? 10_000);
  const signal = request.signal ? AbortSignal.any([timeout, request.signal]) : timeout;
  const maxBytes = manifest.network?.maxBytes ?? 2 * 1024 * 1024;
  const maxRedirects = manifest.network?.maxRedirects ?? 5;
  try {
    for (let redirects = 0; redirects <= maxRedirects; redirects++) {
      const parsed = parseUrl(url);
      if (!parsed) fail('host-not-allowed');
      if (!allowedHost(manifest, url, serverUrl)) fail('host-not-allowed');
      if (!allowedPath(manifest, parsed, serverUrl)) fail('endpoint-not-allowed');
      validateQuery(manifest, parsed);
      const response = await fetch(parsed, { method, headers, signal, credentials: 'omit', redirect: 'manual' });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        await response.body?.cancel();
        if (!location || redirects === maxRedirects) return fail('endpoint-not-allowed');
        try { url = new URL(location, parsed).toString(); } catch { return fail('endpoint-not-allowed'); }
        continue;
      }
      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = []; let total = 0;
      if (reader) {
        try { while (true) { const part = await reader.read(); if (part.done) break; total += part.value.byteLength; if (total > maxBytes) { await reader.cancel(); fail('too-large'); } chunks.push(part.value); } }
        catch (error) { await reader.cancel().catch(() => undefined); throw error; }
      }
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => { if (key !== 'set-cookie') responseHeaders[key] = value; });
      return { status: response.status, headers: responseHeaders, body: new TextDecoder().decode(Buffer.concat(chunks)) };
    }
    return fail('endpoint-not-allowed');
  } catch (error) {
    if (error instanceof Error && /^(host-not-allowed|endpoint-not-allowed|invalid-query|too-large|invalid-network-request|network-method-denied|network-body-denied|network-header-denied)$/.test(error.message)) throw error;
    if (request.signal?.aborted) fail('aborted');
    if (timeout.aborted) fail('timeout');
    fail('network-error');
  }
}

export function assertSuccessfulJson(response: FetchResponse): unknown {
  if (response.status < 200 || response.status >= 300) fail(`bad-status:${response.status}`);
  try { return JSON.parse(response.body) as unknown; } catch { return fail('invalid-json'); }
}

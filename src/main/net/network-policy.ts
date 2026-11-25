import type { PatchManifest } from '../../shared/manifest.js';

export interface FetchRequest { url: string; method?: string; headers?: Record<string, string>; body?: string; signal?: AbortSignal; }
export interface FetchResponse { status: number; headers: Record<string, string>; body: string; }

export function allowedHost(manifest: PatchManifest, rawUrl: string, serverUrl?: string): boolean {
  try {
    const url = new URL(rawUrl);
    if (url.username || url.password) return false;
    const localhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '[::1]';
    if (url.protocol !== 'https:' && !(localhost && url.protocol === 'http:')) return false;
    return (manifest.network?.hosts ?? []).some((host) => {
      if (host !== '$serverUrl') return host.toLowerCase() === url.hostname.toLowerCase();
      if (!serverUrl) return false;
      try { const server = new URL(serverUrl); return server.origin === url.origin; } catch { return false; }
    });
  } catch { return false; }
}

export async function fetchForPatch(manifest: PatchManifest, request: FetchRequest, serverUrl?: string): Promise<FetchResponse> {
  if (!request || typeof request.url !== 'string' || (request.body !== undefined && typeof request.body !== 'string') || (request.method !== undefined && typeof request.method !== 'string')) throw new Error('invalid-network-request');
  const method = (request.method ?? 'GET').toUpperCase();
  if (method !== 'GET') throw new Error('network-method-denied');
  if (request.body !== undefined) throw new Error('network-body-denied');
  const headers = new Headers(request.headers);
  for (const name of ['cookie', 'cookie2', 'authorization', 'proxy-authorization', 'host', 'origin', 'referer', 'user-agent', 'set-cookie']) if (headers.has(name)) throw new Error('network-header-denied');
  let url = request.url;
  const configuredEndpoints = manifest.network?.endpoints ?? [];
  if (configuredEndpoints.length > 0 && !configuredEndpoints.includes(new URL(url).pathname)) throw new Error('network-endpoint-not-allowed');
  const timeout = AbortSignal.timeout(manifest.network?.timeoutMs ?? 10_000);
  const signal = request.signal ? AbortSignal.any([timeout, request.signal]) : timeout;
  const maxBytes = manifest.network?.maxBytes ?? 2 * 1024 * 1024;
  const maxRedirects = manifest.network?.maxRedirects ?? 5;
  for (let redirects = 0; redirects <= maxRedirects; redirects++) {
    if (!allowedHost(manifest, url, serverUrl)) throw new Error('network-host-not-allowed');
    const init: RequestInit = { method, headers, signal, credentials: 'omit', redirect: 'manual' };
    if (request.body !== undefined) init.body = request.body;
    const response = await fetch(url, init);
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location || redirects === maxRedirects) throw new Error('network-redirect-invalid');
      url = new URL(location, url).toString();
      continue;
    }
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = []; let total = 0;
    if (reader) { try { while (true) { const part = await reader.read(); if (part.done) break; total += part.value.byteLength; if (total > maxBytes) throw new Error('network-response-too-large'); chunks.push(part.value); } } catch (error) { await reader.cancel(); throw error; } }
    const responseHeaders: Record<string, string> = {}; response.headers.forEach((value, key) => { if (key !== 'set-cookie') responseHeaders[key] = value; });
    const contentType = response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
    if (contentType && contentType !== 'application/json' && contentType !== 'text/json') throw new Error('network-content-type-denied');
    return { status: response.status, headers: responseHeaders, body: new TextDecoder().decode(Buffer.concat(chunks)) };
  }
  throw new Error('network-redirect-invalid');
}

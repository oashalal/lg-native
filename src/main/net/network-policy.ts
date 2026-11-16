import type { PatchManifest } from '../../shared/manifest.js';

export interface FetchRequest { url: string; method?: string; headers?: Record<string, string>; body?: string; }
export interface FetchResponse { status: number; headers: Record<string, string>; body: string; }

export function allowedHost(manifest: PatchManifest, rawUrl: string, serverUrl?: string): boolean {
  let url: URL;
  try { url = new URL(rawUrl); } catch { return false; }
  const localhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (url.protocol !== 'https:' && !(localhost && url.protocol === 'http:')) return false;
  const hosts = (manifest.network?.hosts ?? []).map((host) => host === '$serverUrl' ? (serverUrl ? new URL(serverUrl).hostname : '') : host.toLowerCase());
  return hosts.includes(url.hostname.toLowerCase());
}

export async function fetchForPatch(manifest: PatchManifest, request: FetchRequest, serverUrl?: string): Promise<FetchResponse> {
  if (!allowedHost(manifest, request.url, serverUrl)) throw new Error('network-host-not-allowed');
  const timeout = manifest.network?.timeoutMs ?? 10_000;
  const maxBytes = manifest.network?.maxBytes ?? 2 * 1024 * 1024;
  const init: RequestInit = { method: request.method ?? 'GET', signal: AbortSignal.timeout(timeout), credentials: 'omit' };
  if (request.headers) init.headers = request.headers;
  if (request.body !== undefined) init.body = request.body;
  const response = await fetch(request.url, init);
  const reader = response.body?.getReader();
  const chunks: Uint8Array[] = []; let total = 0;
  if (reader) { while (true) { const part = await reader.read(); if (part.done) break; total += part.value.byteLength; if (total > maxBytes) throw new Error('network-response-too-large'); chunks.push(part.value); } }
  const body = new TextDecoder().decode(Buffer.concat(chunks));
  const headers: Record<string, string> = {}; response.headers.forEach((value, key) => { headers[key] = value; });
  return { status: response.status, headers, body };
}

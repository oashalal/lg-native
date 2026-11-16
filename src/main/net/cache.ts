import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export class CacheStore {
  constructor(private readonly root: string) {}
  private key(url: string): string { return createHash('sha256').update(url).digest('hex'); }
  async get(url: string): Promise<Buffer | undefined> {
    try { return await readFile(join(this.root, this.key(url))); } catch { return undefined; }
  }
  async put(url: string, body: Buffer): Promise<void> {
    await mkdir(this.root, { recursive: true });
    await writeFile(join(this.root, this.key(url)), body, { mode: 0o600 });
  }
}

export function isPassthroughPath(url: URL): boolean {
  return url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/') || url.pathname === '/ws' || url.pathname.startsWith('/events') || url.pathname.startsWith('/sse');
}

export function isVersionedAsset(url: URL): boolean {
  return Boolean(url.searchParams.get('v')) && !isPassthroughPath(url);
}

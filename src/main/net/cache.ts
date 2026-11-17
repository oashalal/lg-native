import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, unlink, utimes, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface CacheRecord { body: Buffer; contentType?: string }

export class CacheStore {
  private queue: Promise<void> = Promise.resolve();
  constructor(private readonly root: string, private readonly maxBytes = 256 * 1024 * 1024) {
    if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) throw new Error('invalid-cache-limit');
  }
  private key(url: string): string { return createHash('sha256').update(url).digest('hex'); }
  private serialize<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.queue.then(operation);
    this.queue = result.then(() => undefined, () => undefined);
    return result;
  }
  get(url: string): Promise<Buffer | undefined> {
    return this.serialize(async () => {
      const path = join(this.root, this.key(url));
      try {
        const body = await readFile(path);
        const now = new Date();
        await utimes(path, now, now);
        return body;
      } catch { return undefined; }
    });
  }
  getRecord(url: string): Promise<CacheRecord | undefined> {
    return this.serialize(async () => {
      const path = join(this.root, this.key(url));
      try {
        const body = await readFile(path);
        let contentType: string | undefined;
        try {
          const metadata = JSON.parse(await readFile(`${path}.meta`, 'utf8')) as { contentType?: unknown };
          if (typeof metadata.contentType === 'string') contentType = metadata.contentType;
        } catch { /* Old cache entries have no metadata. */ }
        const now = new Date();
        await utimes(path, now, now);
        return contentType ? { body, contentType } : { body };
      } catch { return undefined; }
    });
  }
  put(url: string, body: Buffer, contentType?: string): Promise<void> {
    return this.serialize(async () => {
      await mkdir(this.root, { recursive: true });
      const path = join(this.root, this.key(url));
      if (body.length > this.maxBytes) { await unlink(path).catch(() => undefined); await unlink(`${path}.meta`).catch(() => undefined); return; }
      await writeFile(path, body, { mode: 0o600 });
      if (contentType) await writeFile(`${path}.meta`, JSON.stringify({ contentType }), { mode: 0o600 });
      else await unlink(`${path}.meta`).catch(() => undefined);
      const files = await Promise.all((await readdir(this.root)).filter((name) => /^[a-f0-9]{64}$/.test(name)).map(async (name) => {
        const info = await stat(join(this.root, name));
        return { name, size: info.size, age: info.mtimeMs };
      }));
      let size = files.reduce((sum, file) => sum + file.size, 0);
      files.sort((a, b) => a.age - b.age || a.name.localeCompare(b.name));
      for (const file of files) {
        if (size <= this.maxBytes) break;
        await unlink(join(this.root, file.name));
        await unlink(`${join(this.root, file.name)}.meta`).catch(() => undefined);
        size -= file.size;
      }
    });
  }
}

export function isPassthroughPath(url: URL): boolean {
  return /^\/api\//.test(url.pathname)
    || /^\/auth\//.test(url.pathname)
    || /^\/c\/[^/]+\/(?:api|auth)\//.test(url.pathname)
    || url.pathname === '/ws'
    || /^\/c\/[^/]+\/ws(?:\/|$)/.test(url.pathname)
    || url.pathname.startsWith('/events')
    || url.pathname.startsWith('/sse');
}

export function isVersionedAsset(url: URL): boolean {
  return Boolean(url.searchParams.get('v')) && !isPassthroughPath(url);
}

import { describe, expect, it } from 'vitest';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CacheStore, isPassthroughPath, isVersionedAsset } from '../src/main/net/cache.js';
describe('request classification and cache', () => {
  it('keeps API, auth, WS and SSE out of cache', () => {
    expect(isPassthroughPath(new URL('https://legiongame.gg/api/me'))).toBe(true);
    expect(isPassthroughPath(new URL('https://legiongame.gg/c/zakvielchannel/api/mylist'))).toBe(true);
    expect(isPassthroughPath(new URL('https://legiongame.gg/c/zakvielchannel/api/chat/watch'))).toBe(true);
    expect(isPassthroughPath(new URL('https://legiongame.gg/ws'))).toBe(true);
    expect(isVersionedAsset(new URL('https://legiongame.gg/site/app.js?v=abc'))).toBe(true);
  });
  it('returns the same versioned asset without another network read', async () => { const root = await mkdtemp(join(tmpdir(), 'lg-native-cache-')); const store = new CacheStore(root); await store.put('https://legiongame.gg/site/app.js?v=abc', Buffer.from('ok')); expect((await store.get('https://legiongame.gg/site/app.js?v=abc'))?.toString()).toBe('ok'); expect((await readFile(join(root, (await import('node:crypto')).createHash('sha256').update('https://legiongame.gg/site/app.js?v=abc').digest('hex')))).toString()).toBe('ok'); });
});

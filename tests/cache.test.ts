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

it('evicts the least recently used files to stay within its size limit', async () => {
  const root = await mkdtemp(join(tmpdir(), 'lg-native-cache-limit-'));
  const store = new CacheStore(root, 6);
  await store.put('old', Buffer.from('aaa'));
  await store.put('recent', Buffer.from('bbb'));
  // Set a deterministic ordering even on filesystems with coarse timestamps.
  const { utimes, readdir, stat } = await import('node:fs/promises');
  const { createHash } = await import('node:crypto');
  const file = (key: string) => join(root, createHash('sha256').update(key).digest('hex'));
  await utimes(file('old'), new Date(1), new Date(1));
  await store.put('new', Buffer.from('ccc'));
  expect(await store.get('old')).toBeUndefined();
  expect((await store.get('recent'))?.toString()).toBe('bbb');
  expect((await store.get('new'))?.toString()).toBe('ccc');
  await store.put('oversized', Buffer.alloc(7));
  expect(await store.get('oversized')).toBeUndefined();
  const sizes = await Promise.all((await readdir(root)).map(async (name) => (await stat(join(root, name))).size));
  expect(sizes.reduce((sum, size) => sum + size, 0)).toBeLessThanOrEqual(6);
});

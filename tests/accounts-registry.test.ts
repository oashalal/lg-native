import { describe, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

vi.mock('electron', () => ({ session: { fromPath: vi.fn(() => ({ clearStorageData: vi.fn().mockResolvedValue(undefined), clearCache: vi.fn().mockResolvedValue(undefined) })) } }));

import { AccountHub } from '../src/main/accounts/index.js';

async function setup() {
  const root = await mkdtemp(join(tmpdir(), 'lg-native-accounts-'));
  return { root, hub: new AccountHub({ userDataDir: root }) };
}

describe('account registry', () => {
  it('rejects traversal and unsafe saved URLs', async () => {
    const { root, hub } = await setup();
    await expect(hub.registerProfile({ name: 'x', directory: join(root, 'profiles', '..', 'outside'), defaultChannel: '5opka' })).rejects.toThrow('invalid-profile-directory');
    await expect(hub.registerProfile({ name: 'x', directory: join(root, 'profiles', 'abc'), defaultChannel: '5opka', saved: true })).resolves.toBeTruthy();
    expect(() => hub.createTab('bad', 'https://legiongame.gg/c/x/')).toThrow('profile-not-found');
  });

  it('preserves corrupt registry content and fails closed', async () => {
    const { root } = await setup();
    const registry = join(root, 'registry.json');
    await writeFile(registry, '{broken');
    const hub = new AccountHub({ userDataDir: root });
    await expect(hub.load()).rejects.toThrow('profile-registry-corrupt');
    expect(await readFile(registry, 'utf8')).toBe('{broken');
  });

  it('rejects unsafe names, duplicate directories, and renaming temporary profiles', async () => {
    const { root, hub } = await setup();
    const directory = join(root, 'profiles', 'same');
    const temp = await hub.registerProfile({ name: 'temp', directory, defaultChannel: '5opka' });
    await expect(hub.renameProfile(temp.id, 'renamed')).rejects.toThrow('profile-not-saved');
    await expect(hub.registerProfile({ name: ' x ', directory: join(root, 'profiles', 'other'), defaultChannel: '5opka' })).resolves.toMatchObject({ name: 'x' });
    await expect(hub.registerProfile({ name: 'bad  name', directory: join(root, 'profiles', 'third'), defaultChannel: '5opka' })).rejects.toThrow('invalid-profile-name');
    await expect(hub.registerProfile({ name: 'other', directory, defaultChannel: '5opka' })).rejects.toThrow('profile-directory-exists');
    await expect(hub.registerProfile({ id: 'a'.repeat(32), name: 'wrong', directory: join(root, 'profiles', 'default'), defaultChannel: '5opka' })).rejects.toThrow('invalid-profile-directory');
  });

  it('supports temporary save and rename with validation', async () => {
    const { root, hub } = await setup();
    const profile = await hub.registerProfile({ name: 'temp', directory: join(root, 'profiles', 'temp'), defaultChannel: '5opka' });
    await expect(hub.saveTemporaryProfile(profile.id, 'saved name')).resolves.toMatchObject({ id: profile.id, saved: true, name: 'saved name' });
    await expect(hub.saveTemporaryProfile(profile.id, 'again')).rejects.toThrow('profile-already-saved');
    await expect(hub.renameProfile(profile.id, '')).rejects.toThrow('invalid-profile-name');
    await expect(hub.renameProfile(profile.id, 'renamed')).resolves.toMatchObject({ name: 'renamed' });
  });

  it('deletes saved profiles and persists deletion safely', async () => {
    const { root, hub } = await setup();
    const directory = join(root, 'profiles', 'saved');
    await mkdir(directory, { recursive: true });
    const profile = await hub.registerProfile({ name: 'saved', directory, defaultChannel: '5opka', saved: true });
    hub.createTab(profile.id, 'https://legiongame.gg/c/5opka/');
    await hub.deleteProfile(profile.id);
    expect(hub.getProfile(profile.id)).toBeUndefined();
    expect(hub.listTabs()).toHaveLength(0);
    await expect(access(directory)).rejects.toBeTruthy();
    await expect(hub.deleteProfile(profile.id)).rejects.toThrow('profile-not-found');
    const stored = JSON.parse(await readFile(join(root, 'registry.json'), 'utf8')) as { profiles: unknown[] };
    expect(stored.profiles).toHaveLength(0);
  });

  it('clears every origin and creates a session for default deletion', async () => {
    const { root, hub } = await setup();
    const directory = join(root, 'profiles', 'default');
    await mkdir(directory, { recursive: true });
    const profile = await hub.registerProfile({ id: 'default', name: 'default', directory, defaultChannel: '5opka', saved: true });
    const electron = await import('electron');
    const fromPath = electron.session.fromPath as unknown as ReturnType<typeof vi.fn>;
    fromPath.mockClear();
    await hub.deleteProfile(profile.id);
    expect(fromPath).toHaveBeenCalledWith(directory, { cache: true });
    const created = fromPath.mock.results[0]?.value as { clearStorageData: ReturnType<typeof vi.fn> };
    expect(created.clearStorageData).toHaveBeenCalledWith();
  });

  it('propagates storage cleanup failure without deleting shared default data', async () => {
    const { root, hub } = await setup();
    const directory = join(root, 'profiles', 'default');
    await mkdir(directory, { recursive: true });
    const shared = join(directory, 'reports');
    await writeFile(shared, 'keep');
    const failing = { clearStorageData: vi.fn().mockRejectedValue(new Error('storage-failed')), clearCache: vi.fn().mockResolvedValue(undefined) };
    const electron = await import('electron');
    const fromPath = electron.session.fromPath as unknown as ReturnType<typeof vi.fn>;
    fromPath.mockReturnValueOnce(failing);
    const profile = await hub.registerProfile({ id: 'default', name: 'default', directory, defaultChannel: '5opka', saved: true });
    await expect(hub.deleteProfile(profile.id)).rejects.toThrow('storage-failed');
    expect(await readFile(shared, 'utf8')).toBe('keep');
  });

  it('preserves shared files when deleting default', async () => {
    const { root, hub } = await setup();
    const directory = join(root, 'profiles', 'default');
    await mkdir(directory, { recursive: true });
    const shared = join(directory, 'patch-settings.json');
    await writeFile(shared, 'shared');
    const profile = await hub.registerProfile({ id: 'default', name: 'default', directory, defaultChannel: '5opka', saved: true });
    await hub.deleteProfile(profile.id);
    expect(await readFile(shared, 'utf8')).toBe('shared');
  });

  it('serializes concurrent save and delete', async () => {
    const { root, hub } = await setup();
    const profile = await hub.registerProfile({ name: 'race', directory: join(root, 'profiles', 'race'), defaultChannel: '5opka' });
    const results = await Promise.allSettled([hub.saveTemporaryProfile(profile.id, 'saved'), hub.deleteProfile(profile.id)]);
    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(2);
    expect(hub.getProfile(profile.id)).toBeUndefined();
    const stored = JSON.parse(await readFile(join(root, 'registry.json'), 'utf8')) as { profiles: unknown[] };
    expect(stored.profiles).toHaveLength(0);
  });

  it('marks default deletion so it cannot be implicitly recreated', async () => {
    const { root, hub } = await setup();
    const directory = join(root, 'profiles', 'default');
    await mkdir(directory, { recursive: true });
    const profile = await hub.registerProfile({ id: 'default', name: 'default', directory, defaultChannel: '5opka', saved: true });
    await hub.deleteProfile(profile.id);
    const stored = JSON.parse(await readFile(join(root, 'registry.json'), 'utf8')) as { defaultMigration: string };
    expect(stored.defaultMigration).toBe('deleted');
    await expect(hub.registerProfile({ id: 'default', name: 'default', directory, defaultChannel: '5opka', saved: true })).rejects.toThrow('default-profile-deleted');
  });

  it('persists only saved profile tabs and sanitizes URLs', async () => {
    const { root, hub } = await setup();
    const profile = await hub.registerProfile({ name: 'saved', directory: join(root, 'profiles', 'abc'), defaultChannel: '5opka', saved: true });
    hub.createTab(profile.id, 'https://legiongame.gg/c/5opka/');
    expect(() => hub.createTab(profile.id, 'https://legiongame.gg/c/5opka/?token=secret')).toThrow('invalid-tab-url');
    await hub.save();
    const stored = JSON.parse(await readFile(join(root, 'registry.json'), 'utf8')) as { tabs: unknown[] };
    expect(stored.tabs).toHaveLength(1);
  });
});

import { session } from 'electron';
import { join, dirname, resolve, relative } from 'node:path';
import { randomBytes } from 'node:crypto';
import { readFile, writeFile, mkdir, rename, rm, copyFile } from 'node:fs/promises';

export interface AccountProfile { id: string; name: string; directory: string; partition: `persist:acc-${string}`; defaultChannel: string; saved: boolean; }

export interface TabEntry { id: string; profileId: string; url: string; active: boolean; }

type DefaultMigration = 'legacy' | 'complete' | 'deleted';

interface RegistryData {
  version: number;
  profiles: AccountProfile[];
  tabs: TabEntry[];
  pendingCleanup: string[];
  /** Distinguishes registries predating default migration from an intentional deletion. */
  defaultMigration?: DefaultMigration;
}

const REGISTRY_VERSION = 1;
const PROFILE_NAME = /^\S(?:.{0,61}\S)?$/u;
const PROFILE_ID = /^[a-f0-9]{32}$/;

function normalizeProfileName(raw: string): string {
  if (typeof raw !== 'string') throw new Error('invalid-profile-name');
  const name = raw.trim();
  if (!PROFILE_NAME.test(name) || /\s{2,}/u.test(name)) throw new Error('invalid-profile-name');
  return name;
}

function normalizeProfileNameSafe(raw: string): string | undefined {
  try { return normalizeProfileName(raw); } catch { return undefined; }
}

function isSafeProfileDirectory(directory: string, profilesRoot: string): boolean {
  if (!directory || resolve(directory) !== directory) return false;
  const resolvedRoot = resolve(profilesRoot);
  const resolved = resolve(directory);
  const parent = relative(resolvedRoot, resolved);
  return parent === 'default' || (parent.length > 0 && !parent.startsWith('..') && !parent.includes('/') && !parent.includes('\\'));
}

function sanitizeGameUrl(raw: string): string | undefined {
  try {
    const url = new URL(raw);
    if (url.origin !== 'https://legiongame.gg' || url.search || url.hash || !/^\/c\/[A-Za-z0-9_-]+\/$/.test(url.pathname)) return undefined;
    return url.toString();
  } catch { return undefined; }
}

/**
 * Запись профилей, вкладок и сессий Chromium.
 * Имена профилей не используются в путях к каталогам.
 */
export class AccountHub {
  readonly profiles = new Map<string, AccountProfile>();
  readonly tabs = new Map<string, TabEntry>();
  readonly sessions = new Map<string, Electron.Session>();
  readonly pendingCleanup = new Set<string>();
  private activeTabId: string | undefined;
  private readonly registryPath: string;
  private readonly profilesRoot: string;
  private loaded = false;
  private saveQueue: Promise<void> = Promise.resolve();
  private lifecycleQueue: Promise<void> = Promise.resolve();
  private defaultMigration: DefaultMigration = 'legacy';

  constructor(options: { userDataDir: string; registryPath?: string }) {
    this.profilesRoot = join(options.userDataDir, 'profiles');
    this.registryPath = options.registryPath ?? join(options.userDataDir, 'registry.json');
  }

  get activeTabIdValue(): string | undefined { return this.activeTabId; }

  async load(): Promise<void> {
    if (this.loaded) return;
    this.loaded = true;
    let data: RegistryData | undefined;
    try {
      const raw = await readFile(this.registryPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.version === REGISTRY_VERSION && Array.isArray(parsed.profiles) && Array.isArray(parsed.tabs)) {
        data = parsed as RegistryData;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        await copyFile(this.registryPath, `${this.registryPath}.corrupt-${Date.now()}`).catch(() => undefined);
        throw new Error('profile-registry-corrupt', { cause: error });
      }
    }
    if (!data) {
      try { await readFile(this.registryPath); } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
      }
      throw new Error('profile-registry-corrupt');
    }
    this.defaultMigration = data?.defaultMigration === 'deleted' || data?.defaultMigration === 'complete' ? data.defaultMigration : 'legacy';
    for (const profile of (data?.profiles ?? [])) {
      if (this.isValidProfile(profile) && ![...this.profiles.values()].some((existing) => existing.directory === profile.directory)) this.profiles.set(profile.id, profile);
    }
    if (this.defaultMigration === 'legacy' && this.profiles.has('default')) this.defaultMigration = 'complete';
    for (const tab of (data?.tabs ?? [])) {
      const url = tab && typeof tab.url === 'string' ? sanitizeGameUrl(tab.url) : undefined;
      if (tab && typeof tab.id === 'string' && typeof tab.profileId === 'string' && this.profiles.has(tab.profileId) && url) {
        this.tabs.set(tab.id, { id: tab.id, profileId: tab.profileId, url, active: Boolean(tab.active) });
      }
    }
    for (const directory of (data?.pendingCleanup ?? [])) {
      if (typeof directory === 'string' && isSafeProfileDirectory(directory, this.profilesRoot) && ![...this.profiles.values()].some((profile) => profile.saved && profile.directory === directory) && directory !== join(this.profilesRoot, 'default')) this.pendingCleanup.add(directory);
    }
    let active = [...this.tabs.values()].find((tab) => tab.active);
    if (!active) active = [...this.tabs.values()][0];
    if (active) this.activeTabId = active.id;
  }

  isValidProfile(value: unknown): value is AccountProfile {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const profile = value as AccountProfile;
    if (typeof profile.id !== 'string' || (profile.id !== 'default' && !PROFILE_ID.test(profile.id))) return false;
    if (profile.id !== 'default' && profile.directory === join(this.profilesRoot, 'default')) return false;
    return typeof profile.name === 'string' && normalizeProfileNameSafe(profile.name) === profile.name
      && typeof profile.directory === 'string' && isSafeProfileDirectory(profile.directory, this.profilesRoot)
      && profile.partition === `persist:acc-${profile.id}`
      && typeof profile.defaultChannel === 'string' && /^[A-Za-z0-9_-]{1,32}$/.test(profile.defaultChannel)
      && typeof profile.saved === 'boolean';
  }

  async save(): Promise<void> {
    const write = this.saveQueue.catch(() => undefined).then(async () => {
      const data: RegistryData = {
        version: REGISTRY_VERSION,
        profiles: [...this.profiles.values()],
        tabs: [...this.tabs.values()].filter((tab) => this.profiles.get(tab.profileId)?.saved),
        pendingCleanup: [...this.pendingCleanup],
        defaultMigration: this.defaultMigration,
      };
      await mkdir(dirname(this.registryPath), { recursive: true });
      const tmp = `${this.registryPath}.tmp`;
      await writeFile(tmp, JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 });
      await rename(tmp, this.registryPath);
    });
    this.saveQueue = write;
    await write;
  }

  async registerProfile(options: { id?: string; name: string; directory: string; defaultChannel: string; saved?: boolean }): Promise<AccountProfile> {
    const name = normalizeProfileName(options.name);
    if (!isSafeProfileDirectory(options.directory, this.profilesRoot)) throw new Error('invalid-profile-directory');
    if (!/^[A-Za-z0-9_-]{1,32}$/.test(options.defaultChannel)) throw new Error('invalid-channel');
    const id = options.id ?? randomBytes(16).toString('hex');
    if (id !== 'default' && !PROFILE_ID.test(id)) throw new Error('invalid-profile-id');
    if (id === 'default' && this.defaultMigration === 'deleted') throw new Error('default-profile-deleted');
    if (id !== 'default' && options.directory === join(this.profilesRoot, 'default')) throw new Error('invalid-profile-directory');
    if ([...this.profiles.values()].some((profile) => profile.directory === options.directory)) throw new Error('profile-directory-exists');
    if (this.profiles.has(id)) throw new Error('profile-exists');
    const profile: AccountProfile = {
      id,
      name,
      directory: options.directory,
      partition: `persist:acc-${id}` as `persist:acc-${string}`,
      defaultChannel: options.defaultChannel,
      saved: Boolean(options.saved),
    };
    this.profiles.set(id, profile);
    if (id === 'default') this.defaultMigration = 'complete';
    await this.save();
    return profile;
  }

  private async serialized<T>(operation: () => Promise<T>): Promise<T> {
    const previous = this.lifecycleQueue;
    let release!: () => void;
    this.lifecycleQueue = new Promise<void>((resolve) => { release = resolve; });
    await previous.catch(() => undefined);
    try { return await operation(); } finally { release(); }
  }

  async renameProfile(id: string, name: string): Promise<AccountProfile> {
    return this.serialized(async () => {
      const profile = this.profiles.get(id);
      if (!profile) throw new Error('profile-not-found');
      if (!profile.saved) throw new Error('profile-not-saved');
      profile.name = normalizeProfileName(name);
      await this.save();
      return profile;
    });
  }

  async saveTemporaryProfile(id: string, name: string): Promise<AccountProfile> {
    return this.serialized(async () => {
      const profile = this.profiles.get(id);
      if (!profile) throw new Error('profile-not-found');
      if (profile.saved) throw new Error('profile-already-saved');
      profile.name = normalizeProfileName(name);
      profile.saved = true;
      await this.save();
      return profile;
    });
  }

  async deleteProfile(id: string): Promise<void> {
    return this.serialized(async () => {
      const profile = this.profiles.get(id);
      if (!profile) throw new Error('profile-not-found');
      // Remove references before any asynchronous cleanup, preventing save/delete races.
      this.profiles.delete(id);
      for (const [tabId, tab] of this.tabs) if (tab.profileId === id) this.tabs.delete(tabId);
      if (this.activeTabId && !this.tabs.has(this.activeTabId)) {
        const next = [...this.tabs.values()][0];
        this.activeTabId = next?.id;
        if (next) next.active = true;
      }
      if (id === 'default') this.defaultMigration = 'deleted';
      let ses = this.sessions.get(id);
      this.sessions.delete(id);
      await this.save();
      // Explicit default deletion must clear Chromium storage even when no tab opened it.
      if (!ses && id === 'default') {
        ses = session.fromPath(profile.directory, { cache: true });
      }
      let cleanupError: unknown;
      if (ses) {
        try { await this.clearProfileStorage(ses, profile.directory); } catch (error) { cleanupError = error; }
      }
      // The default directory contains shared settings/reports and is never removed.
      if (profile.directory !== join(this.profilesRoot, 'default') && isSafeProfileDirectory(profile.directory, this.profilesRoot)) {
        try { await rm(profile.directory, { recursive: true, force: true }); } catch { await this.markForCleanup(profile.directory); }
      }
      if (cleanupError) throw cleanupError;
    });
  }

  saveProfile(id: string, updates: { name?: string; defaultChannel?: string }): Promise<void> {
    const profile = this.profiles.get(id);
    if (!profile) throw new Error('profile-not-found');
    if (updates.name !== undefined) {
      if (!PROFILE_NAME.test(updates.name)) throw new Error('invalid-profile-name');
      profile.name = updates.name;
    }
    if (updates.defaultChannel !== undefined) {
      if (!/^[A-Za-z0-9_-]{1,32}$/.test(updates.defaultChannel)) throw new Error('invalid-channel');
      profile.defaultChannel = updates.defaultChannel;
    }
    return this.save();
  }

  markSaved(id: string): void { const profile = this.profiles.get(id); if (profile) profile.saved = true; }
  markTemp(id: string): void { const profile = this.profiles.get(id); if (profile) profile.saved = false; }
  isSaved(id: string): boolean { return Boolean(this.profiles.get(id)?.saved); }

  getProfile(id: string): AccountProfile | undefined { return this.profiles.get(id); }
  listProfiles(): AccountProfile[] { return [...this.profiles.values()]; }

  createTab(profileId: string, url: string, id = randomBytes(8).toString('hex')): TabEntry {
    if (!this.profiles.has(profileId)) throw new Error('profile-not-found');
    if (!/^[a-f0-9]{16}$/.test(id)) throw new Error('invalid-tab-id');
    const safeUrl = sanitizeGameUrl(url);
    if (!safeUrl) throw new Error('invalid-tab-url');
    const entry: TabEntry = { id, profileId, url: safeUrl, active: false };
    this.tabs.set(id, entry);
    if (!this.activeTabId) { entry.active = true; this.activeTabId = id; }
    return entry;
  }

  activateTab(tabId: string): TabEntry | undefined {
    const entry = this.tabs.get(tabId);
    if (!entry) return undefined;
    for (const other of this.tabs.values()) other.active = false;
    entry.active = true;
    this.activeTabId = tabId;
    return entry;
  }

  closeTab(tabId: string): TabEntry | undefined {
    const entry = this.tabs.get(tabId);
    if (!entry) return undefined;
    this.tabs.delete(tabId);
    if (this.activeTabId === tabId) this.activeTabId = undefined;
    const neighbor = [...this.tabs.values()][0];
    if (neighbor) { neighbor.active = true; this.activeTabId = neighbor.id; }
    return neighbor;
  }

  getTab(tabId: string): TabEntry | undefined { return this.tabs.get(tabId); }
  listTabs(): TabEntry[] { return [...this.tabs.values()]; }

  async getOrCreateSession(profileId: string): Promise<Electron.Session> {
    let ses = this.sessions.get(profileId);
    if (!ses) {
      const profile = this.profiles.get(profileId);
      if (!profile) throw new Error('profile-not-found');
      ses = session.fromPath(profile.directory, { cache: true });
      this.sessions.set(profileId, ses);
    }
    return ses;
  }

  async clearProfileStorage(ses: Electron.Session, directory: string): Promise<void> {
    await ses.clearStorageData();
    try { await ses.clearCache(); } catch { /* Best effort. */ }
    if (!isSafeProfileDirectory(directory, this.profilesRoot) || directory === join(this.profilesRoot, 'default') || [...this.profiles.values()].some((profile) => profile.directory === directory)) return;
    try { await rm(directory, { recursive: true, force: true }); } catch { await this.markForCleanup(directory); }
  }

  async markForCleanup(directory: string): Promise<void> {
    if (isSafeProfileDirectory(directory, this.profilesRoot) && directory !== join(this.profilesRoot, 'default')) {
      this.pendingCleanup.add(directory);
      await this.save();
    }
  }

  async cleanPending(): Promise<void> {
    for (const directory of [...this.pendingCleanup]) {
      if (!isSafeProfileDirectory(directory, this.profilesRoot) || [...this.profiles.values()].some((profile) => profile.saved && profile.directory === directory)) continue;
      try {
        await rm(directory, { recursive: true, force: true });
        this.pendingCleanup.delete(directory);
        await this.save();
      } catch { await this.save(); /* Оставляем помеченным до следующего запуска. */ }
    }
  }

  async persistTabs(): Promise<void> { await this.save(); }
}

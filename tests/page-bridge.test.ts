import { describe, expect, it } from 'vitest';
import { NotificationGate, NOTIFY_BODY_MAX_LENGTH, NOTIFY_TITLE_MAX_LENGTH, parseNotify, publicPatchReports } from '../src/main/ipc/page-bridge.js';

describe('page bridge', () => {
  it('validates notification size and shape', () => {
    expect(parseNotify({ title: 'Title', body: 'Body' })).toEqual({ title: 'Title', body: 'Body' });
    expect(() => parseNotify({ title: 'x'.repeat(NOTIFY_TITLE_MAX_LENGTH + 1), body: '' })).toThrow('notify-too-long');
    expect(() => parseNotify({ title: '', body: 'x'.repeat(NOTIFY_BODY_MAX_LENGTH + 1) })).toThrow('notify-too-long');
    expect(() => parseNotify({ title: 1, body: '' })).toThrow('invalid-notify');
  });

  it('limits notification frequency and resets the window', () => {
    const gate = new NotificationGate();
    for (let i = 0; i < 5; i += 1) expect(gate.allow(1_000)).toBe(true);
    expect(gate.allow(1_000)).toBe(false);
    expect(gate.allow(61_001)).toBe(true);
  });

  it('removes internal report paths before crossing the bridge', () => {
    const reports = publicPatchReports([{ siteVer: 'v', entries: [], safeMode: false, generatedAt: 'now', path: '/home/user/profile/reports/patches.jsonl', fileVer: 'hash' }]);
    expect(reports).toEqual([{ siteVer: 'v', entries: [], safeMode: false, generatedAt: 'now', fileVer: 'hash' }]);
    expect(JSON.stringify(reports)).not.toContain('/home/user');
  });
});

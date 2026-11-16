import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { ReportLog } from '../src/main/patching/report-log.js';

it('serializes concurrent writes and rotates complete records', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lgx-report-'));
  try {
    const file = join(dir, 'reports', 'patches.jsonl');
    const report = { siteVer: 'v', entries: [], safeMode: false, generatedAt: 'today' };
    const log = new ReportLog(file, Buffer.byteLength(JSON.stringify(report)) + 2);
    await Promise.all([log.write(report), log.write({ ...report, siteVer: 'v2' })]);
    expect(JSON.parse((await readFile(`${file}.1`, 'utf8')).trim()).siteVer).toBe('v');
    expect(JSON.parse((await readFile(file, 'utf8')).trim()).siteVer).toBe('v2');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

import { readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { PatchEngine } from '../../dist/src/main/patching/engine.js';

const snapshotRoot = resolve('fixtures/snapshots');
const patchRoot = resolve('patches');
const versions = process.argv.slice(2);
if (!versions.length) versions.push(...(await readdir(snapshotRoot, { withFileTypes: true })).filter((item) => item.isDirectory()).map((item) => item.name).sort());
const folders = (await readdir(patchRoot, { withFileTypes: true })).filter((item) => item.isDirectory() && !item.name.startsWith('_')).sort((a, b) => a.name.localeCompare(b.name));
let failed = false;
for (const version of versions) {
  if (!/^[a-zA-Z0-9_-]+$/.test(version)) throw new Error(`invalid snapshot version: ${version}`);
  for (const folder of folders) {
    let manifest;
    try { manifest = JSON.parse(await readFile(join(patchRoot, folder.name, 'patch.json'), 'utf8')); }
    catch (error) { console.log(JSON.stringify({ siteVer: version, patchId: folder.name, status: 'failed', reason: String(error) })); failed = true; continue; }
    if (!['source', 'ast'].includes(manifest.type) || !manifest.enabled) continue;
    for (const target of manifest.targets ?? []) {
      let result;
      try {
        if (typeof target.file !== 'string' || !target.file.startsWith('/') || target.file.split('/').includes('..')) throw new Error('invalid-target-path');
        const source = await readFile(join(snapshotRoot, version, target.file), 'utf8');
        // Check the transformation even for an unapproved version, but report the
        // version gate separately; dry-run never approves a version automatically.
        const engine = new PatchEngine([{ ...manifest, enabled: true, strict: false, targets: [target] }]);
        const output = engine.applyToFile({ path: target.file, content: source, siteVer: version, channel: '5opka', page: '/c/5opka/' });
        const entry = output.report.entries[0];
        if (!entry || entry.status !== 'applied') throw new Error(entry?.reason ?? 'not-applied');
        result = { siteVer: version, patchId: manifest.id, file: target.file, status: 'ok', approved: manifest.strict === false || (manifest.siteVersions ?? []).includes(version) };
      } catch (error) { result = { siteVer: version, patchId: manifest.id, file: target.file, status: 'failed', reason: error instanceof Error ? error.message : String(error) }; failed = true; }
      console.log(JSON.stringify(result));
    }
  }
}
if (failed) process.exitCode = 1;

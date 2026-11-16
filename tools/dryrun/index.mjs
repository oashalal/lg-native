import { readFile, readdir, writeFile, rename, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PatchEngine } from '../../dist/src/main/patching/engine.js';
import { parseManifest } from '../../dist/src/shared/manifest.js';
import { parseMatrix } from '../../dist/src/main/patching/compat.js';

const snapshotRoot = resolve('fixtures/snapshots');
const patchRoot = resolve('patches');
const matrixPath = resolve('compat/matrix.json');
const args = process.argv.slice(2);
const approve = args.includes('--approve');
const versions = args.filter((arg) => arg !== '--approve');
if (!versions.length) versions.push(...(await readdir(snapshotRoot, { withFileTypes: true })).filter((item) => item.isDirectory()).map((item) => item.name).sort());
const folders = (await readdir(patchRoot, { withFileTypes: true })).filter((item) => item.isDirectory() && !item.name.startsWith('_')).sort((a, b) => a.name.localeCompare(b.name));
let matrix = {};
try { matrix = parseMatrix(JSON.parse(await readFile(matrixPath, 'utf8'))); } catch (error) { if (error.code !== 'ENOENT') throw error; }
let failed = false;
for (const version of versions) {
  if (!/^[a-zA-Z0-9_-]+$/.test(version)) throw new Error(`invalid snapshot version: ${version}`);
  const snapshot = JSON.parse(await readFile(join(snapshotRoot, version, 'snapshot_manifest.json'), 'utf8'));
  if (snapshot.site_ver !== version) throw new Error(`snapshot-version-mismatch:${version}`);
  const results = {};
  let versionFailed = false;
  for (const folder of folders) {
    let manifest;
    try { manifest = parseManifest(JSON.parse(await readFile(join(patchRoot, folder.name, 'patch.json'), 'utf8'))); }
    catch (error) { console.log(JSON.stringify({ siteVer: version, patchId: folder.name, status: 'failed', reason: String(error) })); versionFailed = true; continue; }
    let status = 'skipped';
    let reason = !manifest.enabled ? 'disabled' : 'not-tested';
    if (manifest.enabled && ['source', 'ast'].includes(manifest.type)) {
      status = 'ok'; reason = undefined;
      const outputs = new Map();
      if (!manifest.targets.length) { status = 'failed'; reason = 'target-missing'; }
      for (const target of manifest.targets) {
        try {
          if (!target.file.startsWith('/') || target.file.split('/').includes('..')) throw new Error('invalid-target-path');
          const source = await readFile(join(snapshotRoot, version, target.file), 'utf8');
          const engine = new PatchEngine([{ ...manifest, strict: false, siteVersions: [], targets: [target] }]);
          const result = engine.applyToFile({ path: target.file, content: source, siteVer: version, channel: '5opka', page: '/c/5opka/' });
          const entry = result.report.entries[0];
          if (entry?.status !== 'applied') throw new Error(entry?.reason ?? 'not-applied');
          outputs.set(target.file, result.content);
        } catch (error) { status = 'failed'; reason = error instanceof Error ? error.message : String(error); break; }
      }
      if (status === 'ok') {
        try {
          const patchTest = await import(pathToFileURL(join(patchRoot, folder.name, 'test.mjs')).href);
          if (typeof patchTest.test !== 'function') throw new Error('patch-test-missing');
          await patchTest.test({ version, outputs });
        } catch (error) { status = 'failed'; reason = `patch-test:${error instanceof Error ? error.message : String(error)}`; }
      }
    }
    if (status === 'failed') versionFailed = true;
    results[manifest.id] = status;
    console.log(JSON.stringify({ siteVer: version, patchId: manifest.id, status, ...(reason ? { reason } : {}), partial: (snapshot.counts?.versioned_missing ?? 0) > 0 }));
  }
  if (versionFailed) { failed = true; continue; }
  if (approve) matrix[version] = results;
}
if (approve && !failed) {
  await mkdir(resolve('compat'), { recursive: true });
  await writeFile(`${matrixPath}.tmp`, `${JSON.stringify(matrix, null, 2)}\n`);
  await rename(`${matrixPath}.tmp`, matrixPath);
}
if (failed) process.exitCode = 1;

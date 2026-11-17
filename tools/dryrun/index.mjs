import { readFile, readdir, writeFile, rename, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { PatchEngine } from '../../dist/src/main/patching/engine.js';
import { parseManifest } from '../../dist/src/shared/manifest.js';
import { parseMatrix } from '../../dist/src/main/patching/compat.js';

const snapshotRoot = resolve('fixtures/snapshots');
const patchRoot = resolve('patches');
const matrixPath = resolve('compat/matrix.json');
const args = process.argv.slice(2);
const approve = args.includes('--approve');
const smoke = args.includes('--smoke');
const versions = args.filter((arg) => !['--approve', '--smoke'].includes(arg));
if (!versions.length && !smoke) versions.push(...(await readdir(snapshotRoot, { withFileTypes: true })).filter((item) => item.isDirectory()).map((item) => item.name).sort());
const folders = (await readdir(patchRoot, { withFileTypes: true })).filter((item) => item.isDirectory() && !item.name.startsWith('_')).sort((a, b) => a.name.localeCompare(b.name));
let matrix = {};
try { matrix = parseMatrix(JSON.parse(await readFile(matrixPath, 'utf8'))); } catch (error) { if (error.code !== 'ENOENT') throw error; }
let failed = false;

async function loadManifest(folder) {
  const manifest = parseManifest(JSON.parse(await readFile(join(patchRoot, folder.name, 'patch.json'), 'utf8')));
  if (manifest.type === 'runtime') {
    const script = await readFile(join(patchRoot, folder.name, 'index.js'), 'utf8');
    return { ...manifest, settings: { ...manifest.settings, script } };
  }
  return manifest;
}

async function runSmoke() {
  const smokeRoot = await mkdtemp(join(tmpdir(), 'lg-native-smoke-'));
  try {
    const smokeManifests = [];
    for (const folder of folders) {
      const manifest = await loadManifest(folder);
      if (manifest.enabled && ['css', 'runtime'].includes(manifest.type)) smokeManifests.push(manifest);
    }
    const engine = new PatchEngine(smokeManifests, [], false, {});
    const style = engine.applyToFile({ path: '/site/style.css', content: '.site-head { color: black; }', siteVer: 'smoke', channel: '5opka', page: '/c/5opka/' });
    const app = engine.applyToFile({ path: '/site/app.js', content: "window.LGLive = {}; window.__lgRuntimeCalls = []; const debug = console.debug.bind(console); console.debug = (...args) => { window.__lgRuntimeCalls.push(args.join(' ')); debug(...args); };", siteVer: 'smoke', channel: '5opka', page: '/c/5opka/' });
    await mkdir(join(smokeRoot, 'site'), { recursive: true });
    await writeFile(join(smokeRoot, 'site', 'style.css'), style.content);
    await writeFile(join(smokeRoot, 'site', 'app.js'), app.content);
    await writeFile(join(smokeRoot, 'index.html'), '<!doctype html><html><head><link rel="stylesheet" href="site/style.css"></head><body><div class="site-head">smoke</div><script src="site/app.js"></script></body></html>');
    const resultFile = join(smokeRoot, 'result.json');
    const electronMain = resolve('tools/dryrun/smoke-main.mjs');
    const environment = { ...process.env };
    delete environment.ELECTRON_RUN_AS_NODE;
    const status = await new Promise((resolveStatus, reject) => {
      const child = spawn(process.env.ELECTRON_BIN ?? resolve('node_modules/electron/cli.js'), [electronMain, `--fixture=${smokeRoot}`, `--result=${resultFile}`], { env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
      let stderr = '';
      child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
      child.on('error', reject);
      child.on('close', (code) => code === 0 ? resolveStatus('ok') : reject(new Error(stderr.trim() || `smoke-exit:${code}`)));
    });
    const result = JSON.parse(await readFile(resultFile, 'utf8'));
    const smokeResults = { 'css-style': result.css ? 'ok' : 'failed', 'runtime-live': result.runtime && result.requires ? 'ok' : 'failed' };
    if (status !== 'ok' || Object.values(smokeResults).some((value) => value === 'failed')) throw new Error(`smoke-failed:${JSON.stringify(result)}`);
    matrix.smoke = { ...(matrix.smoke ?? {}), ...smokeResults };
    console.log(JSON.stringify({ siteVer: 'smoke', ...smokeResults }));
  } catch (error) {
    matrix.smoke = { ...(matrix.smoke ?? {}), 'css-style': 'failed', 'runtime-live': 'failed' };
    console.log(JSON.stringify({ siteVer: 'smoke', 'css-style': 'failed', 'runtime-live': 'failed', reason: error instanceof Error ? error.message : String(error) }));
    failed = true;
  } finally {
    await rm(smokeRoot, { recursive: true, force: true });
  }
}

if (smoke) await runSmoke();
for (const version of versions) {
  if (!/^[a-zA-Z0-9_-]+$/.test(version)) throw new Error(`invalid snapshot version: ${version}`);
  const snapshot = JSON.parse(await readFile(join(snapshotRoot, version, 'snapshot_manifest.json'), 'utf8'));
  if (snapshot.site_ver !== version) throw new Error(`snapshot-version-mismatch:${version}`);
  const results = {};
  let versionFailed = false;
  for (const folder of folders) {
    let manifest;
    try { manifest = await loadManifest(folder); }
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
if (approve || smoke) {
  await mkdir(resolve('compat'), { recursive: true });
  await writeFile(`${matrixPath}.tmp`, `${JSON.stringify(matrix, null, 2)}\n`);
  await rename(`${matrixPath}.tmp`, matrixPath);
}
if (failed) process.exitCode = 1;

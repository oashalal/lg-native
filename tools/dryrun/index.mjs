import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const root = new URL('../../patches/', import.meta.url);
const snapshot = new URL('../../fixtures/snapshots/13ebcdcfc1/', import.meta.url);
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
  const manifest = JSON.parse(await readFile(new URL(`../../patches/${entry.name}/patch.json`, import.meta.url), 'utf8'));
  for (const target of manifest.targets ?? []) {
    const path = new URL(`.${target.file}`, snapshot);
    try { const source = await readFile(path, 'utf8'); const found = target.anchor ? source.split(target.anchor).length - 1 : 0; console.log(JSON.stringify({ patchId: manifest.id, file: target.file, found, expect: target.expect ?? 0, ok: found === (target.expect ?? 0) })); } catch { console.log(JSON.stringify({ patchId: manifest.id, file: target.file, ok: false, reason: 'fixture-missing' })); }
  }
}

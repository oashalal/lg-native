import { parseManifest, type PatchManifest, type PatchReport, type PatchReportEntry } from '../../shared/manifest.js';
import { parse as parseJavaScript } from 'acorn';

export interface PatchFileInput { path: string; content: string; siteVer: string; channel?: string; page?: string; }
export interface PatchFileOutput { content: string; report: PatchReport; }
export interface RuntimePatch { manifest: PatchManifest; run: (api: unknown) => void; }

function count(text: string, needle: string): number {
  if (!needle) return 0;
  let at = 0; let total = 0;
  while ((at = text.indexOf(needle, at)) !== -1) { total += 1; at += needle.length; }
  return total;
}

function matchesScope(manifest: PatchManifest, input: PatchFileInput): boolean {
  const glob = (pattern: string, value: string | undefined) => !value || pattern === '*' || (pattern.endsWith('*') ? value.startsWith(pattern.slice(0, -1)) : pattern === value);
  return manifest.scope.channels.some((pattern) => glob(pattern, input.channel)) && manifest.scope.pages.some((pattern) => glob(pattern, input.page));
}

export class PatchEngine {
  private readonly manifests: PatchManifest[];
  private readonly runtime: RuntimePatch[];
  private readonly safeMode: boolean;
  readonly reports: PatchReport[] = [];

  constructor(manifests: unknown[], runtime: RuntimePatch[] = [], safeMode = false) {
    this.manifests = manifests.map(parseManifest);
    this.runtime = runtime;
    this.safeMode = safeMode;
  }

  applyToFile(input: PatchFileInput): PatchFileOutput {
    let content = input.content;
    const entries: PatchReportEntry[] = [];
    if (this.safeMode) {
      for (const manifest of this.manifests) entries.push({ patchId: manifest.id, status: 'skipped', reason: 'safe-mode', siteVer: input.siteVer });
    } else {
      for (const manifest of this.manifests.filter((item) => item.enabled && (item.type === 'css' || item.type === 'source' || item.type === 'ast'))) {
        const target = manifest.targets.find((item) => item.file === input.path);
        if (manifest.type === 'css' && !target) continue;
        if (manifest.type === 'ast') { entries.push({ patchId: manifest.id, status: 'skipped', reason: 'ast-not-implemented', siteVer: input.siteVer }); continue; }
        if (manifest.strict && !manifest.siteVersions.includes(input.siteVer)) { entries.push({ patchId: manifest.id, status: 'skipped', reason: 'site-version', siteVer: input.siteVer }); continue; }
        if (!matchesScope(manifest, input)) { entries.push({ patchId: manifest.id, status: 'skipped', reason: 'scope', siteVer: input.siteVer }); continue; }
        if (manifest.type === 'source' && !target) { entries.push({ patchId: manifest.id, status: 'skipped', reason: 'target-file', siteVer: input.siteVer }); continue; }
        try {
          if (manifest.type === 'css') {
            const replacement = target?.replacement ?? manifest.settings.css;
            if (typeof replacement !== 'string') throw new Error('css patch requires settings.css or target.replacement');
            content += `\n/* lg-native:${manifest.id} */\n${replacement}\n`;
          } else {
            const anchor = target?.anchor ?? '';
            const expected = target?.expect ?? 1;
            const found = count(content, anchor);
            if (found !== expected) throw new Error(`anchor-count:${found}/${expected}`);
            const replacement = target?.replacement;
            if (!replacement) throw new Error('source target replacement is missing');
            content = content.split(anchor).join(replacement);
            parseJavaScript(content, { ecmaVersion: 'latest', sourceType: 'script' });
          }
          entries.push({ patchId: manifest.id, status: 'applied', siteVer: input.siteVer });
        } catch (error) {
          content = input.content;
          entries.push({ patchId: manifest.id, status: 'failed', reason: error instanceof Error ? error.message : String(error), siteVer: input.siteVer });
          if (manifest.onFail === 'original') content = input.content;
        }
      }
    }
    const report: PatchReport = { siteVer: input.siteVer, entries, safeMode: this.safeMode, generatedAt: new Date().toISOString() };
    this.reports.push(report);
    return { content, report };
  }

  runRuntime(api: unknown, siteVer: string): PatchReport {
    const entries: PatchReportEntry[] = [];
    if (this.safeMode) {
      for (const patch of this.runtime) entries.push({ patchId: patch.manifest.id, status: 'skipped', reason: 'safe-mode', siteVer });
    } else {
      for (const patch of this.runtime) {
        const manifest = patch.manifest;
        if (!manifest.enabled || (manifest.strict && !manifest.siteVersions.includes(siteVer))) { entries.push({ patchId: manifest.id, status: 'skipped', reason: manifest.enabled ? 'site-version' : 'disabled', siteVer }); continue; }
        try {
          for (const requirement of manifest.requires) {
            if (!requirement.startsWith('global:')) continue;
            const name = requirement.slice('global:'.length);
            const available = (api && typeof api === 'object' && name in (api as Record<string, unknown>)) || name in globalThis;
            if (!available) throw new Error(`requirement-missing:${requirement}`);
          }
          patch.run(api); entries.push({ patchId: manifest.id, status: 'applied', siteVer });
        }
        catch (error) { entries.push({ patchId: manifest.id, status: 'failed', reason: error instanceof Error ? error.message : String(error), siteVer }); }
      }
    }
    const report: PatchReport = { siteVer, entries, safeMode: this.safeMode, generatedAt: new Date().toISOString() };
    this.reports.push(report);
    return report;
  }
}

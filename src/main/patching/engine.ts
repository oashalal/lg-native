import { parseManifest, type PatchManifest, type PatchReport, type PatchReportEntry } from '../../shared/manifest.js';
import { parse as parseJavaScript } from 'acorn';
import { compatibility, type CompatibilityMatrix } from './compat.js';
import { installPageLGX } from '../../runtime/lgx.js';
import { createUI } from '../../runtime/ui.js';
import { installChannel } from '../../runtime/channel.js';
import { publicSettings } from './settings.js';

export interface PatchFileInput { path: string; content: string; siteVer: string; channel?: string; page?: string; }
export interface PatchFileOutput { content: string; report: PatchReport; networkScripts: Array<{ patchId: string; script: string }>; }
export interface RuntimePatch { manifest: PatchManifest; run: (api: unknown) => void; }

function count(text: string, needle: string): number {
  if (!needle) return 0;
  let at = 0; let total = 0;
  while ((at = text.indexOf(needle, at)) !== -1) { total += 1; at += needle.length; }
  return total;
}

// Replace complete function bodies using parser offsets, without regenerating the
// rest of the site's source. Only named function declarations are selected.
function replaceFunctionBody(source: string, name: string, replacement: string, expected: number): string {
  const tree = parseJavaScript(source, { ecmaVersion: 'latest', sourceType: 'script' });
  const matches: Array<{ start: number; end: number }> = [];
  const visit = (value: unknown): void => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { for (const item of value) visit(item); return; }
    const node = value as Record<string, unknown>;
    if (node.type === 'FunctionDeclaration' && node.id && typeof node.id === 'object' && (node.id as { name?: unknown }).name === name && node.body && typeof node.body === 'object') {
      const body = node.body as { start: number; end: number };
      matches.push({ start: body.start, end: body.end });
    }
    for (const child of Object.values(node)) visit(child);
  };
  visit(tree);
  if (matches.length !== expected) throw new Error(`function-count:${matches.length}/${expected}`);
  matches.sort((a, b) => a.start - b.start);
  for (let i = 1; i < matches.length; i++) if (matches[i]!.start < matches[i - 1]!.end) throw new Error('overlapping-functions');
  let result = source;
  for (const match of matches.reverse()) result = result.slice(0, match.start) + `{\n${replacement}\n}` + result.slice(match.end);
  parseJavaScript(result, { ecmaVersion: 'latest', sourceType: 'script' });
  return result;
}

function matchesScope(manifest: PatchManifest, input: PatchFileInput): boolean {
  const glob = (pattern: string, value: string | undefined) => !value || pattern === '*' || (pattern.endsWith('*') ? value.startsWith(pattern.slice(0, -1)) : pattern === value);
  return manifest.scope.channels.some((pattern) => glob(pattern, input.channel)) && manifest.scope.pages.some((pattern) => glob(pattern, input.page));
}

export class PatchEngine {
  private readonly manifests: PatchManifest[];
  private readonly runtime: RuntimePatch[];
  private readonly safeMode: boolean;
  private readonly disabled = new Set<string>();
  readonly reports: PatchReport[] = [];

  constructor(manifests: unknown[], runtime: RuntimePatch[] = [], safeMode = false, private readonly matrix: CompatibilityMatrix = {}) {
    const parsed = manifests.map(parseManifest);
    const ids = new Set<string>();
    for (const manifest of parsed) { if (ids.has(manifest.id)) throw new Error('duplicate-patch-id'); ids.add(manifest.id); }
    this.manifests = parsed;
    this.runtime = runtime;
    this.safeMode = safeMode;
  }

  record(report: PatchReport): void {
    this.reports.push(report);
    if (this.reports.length > 500) this.reports.shift();
  }

  applyToFile(input: PatchFileInput): PatchFileOutput {
    let content = input.content;
    const entries: PatchReportEntry[] = [];
    const networkScripts: Array<{ patchId: string; script: string }> = [];
    let pageRuntimeApplied = false;
    if (this.safeMode) {
      for (const manifest of this.manifests) entries.push({ patchId: manifest.id, status: 'skipped', reason: 'safe-mode', siteVer: input.siteVer });
    } else {
      for (const manifest of this.manifests) {
        if (manifest.type === 'runtime' && input.path !== '/site/app.js') continue;
        if ((manifest.type === 'css' || manifest.type === 'source' || manifest.type === 'ast') && !manifest.targets.some((target) => target.file === input.path)) continue;
        if (!manifest.enabled) {
          entries.push({ patchId: manifest.id, status: 'skipped', reason: 'disabled', siteVer: input.siteVer });
          continue;
        }
        if (this.disabled.has(manifest.id)) { entries.push({ patchId: manifest.id, status: 'skipped', reason: 'failed-earlier', siteVer: input.siteVer }); continue; }
        if (manifest.type === 'runtime') {
          if (input.path !== '/site/app.js') continue;
          const networkEnabled = Boolean(manifest.network?.hosts.length);
          const pageSource = manifest.runtime?.pageScript ?? manifest.settings.script;
          const pageScript = typeof pageSource === 'string' ? pageSource : undefined;
          const networkSource = manifest.runtime?.networkScript ?? manifest.settings.networkScript;
          const networkScript = typeof networkSource === 'string' ? networkSource : undefined;
          if (!pageScript?.trim() && !networkScript?.trim()) {
            entries.push({ patchId: manifest.id, status: 'skipped', reason: networkEnabled ? 'network-script-missing' : 'runtime-script-missing', siteVer: input.siteVer });
            continue;
          }
          if (compatibility(manifest, input.siteVer, this.matrix) === 'skipped' || compatibility(manifest, input.siteVer, this.matrix) === 'failed') {
            entries.push({ patchId: manifest.id, status: 'skipped', reason: compatibility(manifest, input.siteVer, this.matrix) === 'failed' ? 'compat-failed' : 'site-version', siteVer: input.siteVer });
            continue;
          }
          if (!matchesScope(manifest, input)) {
            entries.push({ patchId: manifest.id, status: 'skipped', reason: 'scope', siteVer: input.siteVer });
            continue;
          }
          const requirements = JSON.stringify(manifest.requires);
          const settings = JSON.stringify(publicSettings(manifest)).replace(/</g, '\\u003c');
          if (pageScript?.trim()) {
            content += `\n;/* lg-native runtime:${manifest.id} */\n(async function(){try { const channel = (${installChannel.toString()})(${JSON.stringify(manifest.id)}, '', 'page'); const LGX = { ...globalThis.LGX, channel }; LGX.onCleanup(channel.close); const requirements = ${requirements}; for (const requirement of requirements) { const end = Date.now() + 10000; const exists = () => requirement.startsWith('global:') ? window[requirement.slice(7)] : requirement.startsWith('file:') ? Array.from(document.querySelectorAll('script[src],link[href]')).some(el => { try { return new URL(el.src || el.href, document.baseURI).pathname === requirement.slice(5); } catch { return false; } }) : document.querySelector(requirement.startsWith('selector:') ? requirement.slice(9) : requirement); while (!exists()) { if (Date.now() >= end) throw new Error('requirement-missing:' + requirement); await new Promise(resolve => setTimeout(resolve, 100)); } } const settings = ${settings}; ${pageScript}\n} catch (error) { console.error('[lg-native:${manifest.id}]', error); }})();\n`;
            pageRuntimeApplied = true;
          }
          if (networkEnabled) {
            if (networkScript?.trim()) networkScripts.push({ patchId: manifest.id, script: networkScript });
            else entries.push({ patchId: manifest.id, status: 'skipped', reason: 'network-script-missing', siteVer: input.siteVer });
          }
          if (pageScript?.trim() || (networkEnabled && networkScript?.trim())) entries.push({ patchId: manifest.id, status: 'applied', siteVer: input.siteVer });
          continue;
        }
        if (manifest.type === 'native') {
          entries.push({ patchId: manifest.id, status: 'skipped', reason: 'native-not-implemented', siteVer: input.siteVer });
          continue;
        }
        const target = manifest.targets.find((item) => item.file === input.path);
        if (manifest.type === 'css' && !target) continue;
        if ((manifest.type === 'source' || manifest.type === 'ast') && !target) continue;
        const compat = compatibility(manifest, input.siteVer, this.matrix);
        if (compat === 'skipped' || compat === 'failed') { entries.push({ patchId: manifest.id, status: 'skipped', reason: compat === 'failed' ? 'compat-failed' : 'site-version', siteVer: input.siteVer }); continue; }
        if (!matchesScope(manifest, input)) { entries.push({ patchId: manifest.id, status: 'skipped', reason: 'scope', siteVer: input.siteVer }); continue; }
        if (manifest.type === 'source' && !target) { entries.push({ patchId: manifest.id, status: 'skipped', reason: 'target-file', siteVer: input.siteVer }); continue; }
        const before = content;
        try {
          if (manifest.type === 'css') {
            const replacement = target?.replacement ?? manifest.settings.css;
            if (typeof replacement !== 'string') throw new Error('css patch requires settings.css or target.replacement');
            content += `\n/* lg-native:${manifest.id} */\n${replacement}\n`;
          } else if (manifest.type === 'ast') {
            if (!target?.functionName || target.replacement === undefined) throw new Error('ast-target-missing');
            content = replaceFunctionBody(content, target.functionName, target.replacement, target.expect ?? 1);
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
          entries.push({ patchId: manifest.id, status: 'applied', ...(compat === 'unverified' ? { reason: 'unverified' } : {}), siteVer: input.siteVer });
        } catch (error) {
          content = before;
          this.disabled.add(manifest.id);
          entries.push({ patchId: manifest.id, status: 'failed', reason: error instanceof Error ? error.message : String(error), siteVer: input.siteVer });
          if (manifest.onFail === 'original') {
            content = input.content;
            for (const entry of entries) if (entry.status === 'applied') { entry.status = 'skipped'; entry.reason = 'rolled-back'; }
            break;
          }
        }
      }
    }
    if (input.path === '/site/app.js' && (pageRuntimeApplied || entries.some((entry) => entry.status === 'applied' && this.manifests.some((manifest) => manifest.id === entry.patchId && manifest.type !== 'runtime')))) {
      const settings = Object.fromEntries(this.manifests.map((manifest) => [manifest.id, publicSettings(manifest)]));
      const args = JSON.stringify([input.siteVer, settings]).replace(/</g, '\\u003c');
      content = `;(${installPageLGX.toString()})(...${args},(${createUI.toString()}));\n${content}`;
    }
    const report: PatchReport = { siteVer: input.siteVer, entries, safeMode: this.safeMode, generatedAt: new Date().toISOString(), path: input.path };
    if (entries.length) { this.reports.push(report); if (this.reports.length > 500) this.reports.shift(); }
    return { content, report, networkScripts };
  }

  runtimeHostMissing(input: { siteVer: string; channel: string; page: string }): PatchReport {
    const entries: PatchReportEntry[] = this.safeMode ? [] : this.manifests
      .filter((manifest) => manifest.enabled && manifest.type === 'runtime' && matchesScope(manifest, { ...input, path: '/site/app.js', content: '' }))
      .flatMap((manifest) => {
        const result: PatchReportEntry[] = [];
        const pageSource = manifest.runtime?.pageScript ?? manifest.settings.script;
        const networkSource = manifest.runtime?.networkScript ?? manifest.settings.networkScript;
        if (pageSource || !manifest.network?.hosts.length) result.push({ patchId: manifest.id, status: 'skipped', reason: 'runtime-host-missing', siteVer: input.siteVer });
        if (manifest.network?.hosts.length && typeof networkSource !== 'string' && !(networkSource && typeof networkSource === 'object')) result.push({ patchId: manifest.id, status: 'skipped', reason: 'network-script-missing', siteVer: input.siteVer });
        return result;
      });
    const report: PatchReport = { siteVer: input.siteVer, entries, safeMode: this.safeMode, generatedAt: new Date().toISOString(), path: input.page };
    if (entries.length) this.record(report);
    return report;
  }

  runRuntime(api: unknown, siteVer: string): PatchReport {
    const entries: PatchReportEntry[] = [];
    if (this.safeMode) {
      for (const patch of this.runtime) entries.push({ patchId: patch.manifest.id, status: 'skipped', reason: 'safe-mode', siteVer });
    } else {
      for (const patch of this.runtime) {
        const manifest = patch.manifest;
        if (!manifest.enabled || ['skipped', 'failed'].includes(compatibility(manifest, siteVer, this.matrix))) { entries.push({ patchId: manifest.id, status: 'skipped', reason: !manifest.enabled ? 'disabled' : compatibility(manifest, siteVer, this.matrix) === 'failed' ? 'compat-failed' : 'site-version', siteVer }); continue; }
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

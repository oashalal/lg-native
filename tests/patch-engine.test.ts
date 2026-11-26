import { describe, expect, it } from 'vitest';
import { PatchEngine } from '../src/main/patching/engine.js';

const source = 'const api = (p) => fetch(p);\nwindow.LGLive = () => true;';
const base = { name: 'test', version: '1', enabled: true, siteVersions: [], strict: false, scope: { channels: ['*'], pages: ['/c/*'] }, requires: [], onFail: 'disable', settings: {} };

describe('PatchEngine', () => {
  it('applies an exact source anchor and validates syntax', () => {
    const engine = new PatchEngine([{ ...base, id: 'source', type: 'source', targets: [{ file: '/site/app.js', anchor: 'window.LGLive = () => true;', expect: 1, replacement: 'window.LGX = true;' }] }]);
    const result = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: '13ebcdcfc1', channel: '5opka', page: '/c/5opka/' });
    expect(result.content).toContain('window.LGX = true;'); expect(result.report.entries[0]?.status).toBe('applied');
    expect(result.content).toContain('installPageLGX');
    expect(result.content).toContain('function createUI');
    expect(result.content).toContain('timeout:${selector}');
  });
  it('gates source patches by per-patch compatibility and marks unverified changes', () => {
    const manifest = { ...base, id: 'source', type: 'source', strict: true, targets: [{ file: '/site/app.js', anchor: 'true;', replacement: 'false;' }] };
    const input = { path: '/site/app.js', content: source, siteVer: 'v2' };
    expect(new PatchEngine([manifest]).applyToFile(input).report.entries[0]?.reason).toBe('site-version');
    expect(new PatchEngine([manifest], [], false, { v2: { source: 'ok' } }).applyToFile(input).report.entries[0]?.status).toBe('applied');
    expect(new PatchEngine([manifest], [], false, { v2: { source: 'failed' } }).applyToFile(input).report.entries[0]?.reason).toBe('compat-failed');
    expect(new PatchEngine([{ ...manifest, strict: false }]).applyToFile(input).report.entries[0]?.reason).toBe('unverified');
    expect(new PatchEngine([{ ...manifest, siteVersions: ['v1'] }], [], false, { v2: { source: 'ok' } }).applyToFile(input).report.entries[0]?.reason).toBe('site-version');
  });
  it('returns original content when anchor count is wrong', () => {
    const engine = new PatchEngine([{ ...base, id: 'broken', type: 'source', targets: [{ file: '/site/app.js', anchor: 'missing', expect: 1, replacement: 'x' }] }]);
    const result = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: '13ebcdcfc1' });
    expect(result.content).toBe(source); expect(result.report.entries[0]?.status).toBe('failed');
  });
  it('safe mode skips every patch', () => {
    const engine = new PatchEngine([{ ...base, id: 'css', type: 'css', targets: [{ file: '/site/style.css' }], settings: { css: 'body{}' } }], [], true);
    expect(engine.applyToFile({ path: '/site/style.css', content: '', siteVer: '13ebcdcfc1' }).report.entries[0]?.reason).toBe('safe-mode');
  });
  it('isolates runtime exceptions', () => {
    const engine = new PatchEngine([], [{ manifest: { ...base, id: 'runtime', type: 'runtime', targets: [], onFail: 'disable' as const }, run: () => { throw new Error('boom'); } }]);
    expect(engine.runRuntime({}, '13ebcdcfc1').entries[0]?.status).toBe('failed');
  });
  it('skips runtime patches when a declared global is missing', () => {
    const engine = new PatchEngine([], [{ manifest: { ...base, id: 'requires', type: 'runtime', targets: [], onFail: 'disable' as const, requires: ['global:LGLive'] }, run: () => undefined }]);
    expect(engine.runRuntime({}, '13ebcdcfc1').entries[0]?.status).toBe('failed');
  });
  it('keeps earlier changes when a later patch fails with disable', () => {
    const engine = new PatchEngine([
      { ...base, id: 'first', type: 'source', targets: [{ file: '/site/app.js', anchor: 'true;', replacement: 'false;' }] },
      { ...base, id: 'broken', type: 'source', targets: [{ file: '/site/app.js', anchor: 'missing', replacement: 'x' }] },
    ]);
    const result = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: '13ebcdcfc1' });
    expect(result.content).toContain('false;');
    expect(result.report.entries.map((entry) => entry.status)).toEqual(['applied', 'failed']);
  });
  it('reports rollback when original is requested', () => {
    const engine = new PatchEngine([
      { ...base, id: 'first', type: 'source', targets: [{ file: '/site/app.js', anchor: 'true;', replacement: 'false;' }] },
      { ...base, id: 'broken', type: 'source', onFail: 'original', targets: [{ file: '/site/app.js', anchor: 'missing', replacement: 'x' }] },
    ]);
    const result = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: '13ebcdcfc1' });
    expect(result.content).toBe(source);
    expect(result.report.entries[0]?.reason).toBe('rolled-back');
  });
  it('injects runtime code only into the application bundle', () => {
    const engine = new PatchEngine([{ ...base, id: 'runtime', type: 'runtime', strict: false, settings: { script: 'window.testPatch = true;' } }]);
    expect(engine.applyToFile({ path: '/site/other.js', content: source, siteVer: 'unknown' }).report.entries).toEqual([]);
    expect(engine.applyToFile({ path: '/site/app.js', content: source, siteVer: 'unknown' }).content).toContain('window.testPatch = true;');
  });
  it('reports a missing runtime host for applicable page-world patches', () => {
    const engine = new PatchEngine([
      { ...base, id: 'runtime', type: 'runtime', strict: false, settings: { script: 'window.test = true;' } },
      { ...base, id: 'network', type: 'runtime', network: { hosts: ['example.com'] } },
    ]);
    const report = engine.runtimeHostMissing({ siteVer: 'unknown', channel: '5opka', page: '/c/5opka/' });
    expect(report.entries).toEqual([{ patchId: 'runtime', status: 'skipped', reason: 'runtime-host-missing', siteVer: 'unknown' }, { patchId: 'network', status: 'skipped', reason: 'network-script-missing', siteVer: 'unknown' }]);
    expect(engine.reports).toContain(report);
  });
  it('keeps page and network runtime parts independent', () => {
    const engine = new PatchEngine([{ ...base, id: 'network', type: 'runtime', strict: false, network: { hosts: ['example.com'] }, runtime: { pageScript: 'window.pagePart = true;', networkScript: 'globalThis.networkPart = true;' } }]);
    const result = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: 'unknown', channel: '5opka', page: '/c/5opka/' });
    expect(result.content).toContain('window.pagePart = true;');
    expect(result.content).not.toContain('globalThis.networkPart = true;');
    expect(result.networkScripts).toHaveLength(1);
    expect(result.report.entries).toEqual([{ patchId: 'network', status: 'pending', reason: 'awaiting-execution', siteVer: 'unknown' }]);
  });
  it('applies network-only runtimes without adding code to the page bundle', () => {
    const engine = new PatchEngine([{ ...base, id: 'network-only', type: 'runtime', strict: false, network: { hosts: ['example.com'] }, runtime: { networkScript: 'globalThis.networkPart = true;' } }]);
    const result = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: 'unknown', channel: '5opka', page: '/c/5opka/' });
    expect(result.content).toBe(source);
    expect(result.networkScripts).toHaveLength(1);
    expect(result.report.entries[0]?.status).toBe('pending');
  });
  it('does not inject network-only scripts when safe mode is enabled', () => {
    const engine = new PatchEngine([{ ...base, id: 'network-only', type: 'runtime', network: { hosts: ['example.com'] }, runtime: { networkScript: 'globalThis.networkPart = true;' } }], [], true);
    const result = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: 'unknown' });
    expect(result.networkScripts).toHaveLength(0);
    expect(result.report.entries[0]?.reason).toBe('safe-mode');
  });
  it('settles pending runtime reports and avoids duplicate asset reports', () => {
    const engine = new PatchEngine([{ ...base, id: 'network-only', type: 'runtime', strict: false, network: { hosts: ['example.com'] }, runtime: { networkScript: 'globalThis.networkPart = true;' } }]);
    const input = { path: '/site/app.js', content: source, siteVer: 'unknown', channel: '5opka', page: '/c/5opka/' };
    const first = engine.applyToFile(input).report;
    expect(engine.applyToFile(input).report.entries).toEqual(first.entries);
    expect(engine.reports).toHaveLength(1);
    expect(engine.settleRuntime('network-only', 'unknown', '/site/app.js', 'applied')?.entries[0]?.status).toBe('applied');
    expect(engine.settleRuntime('network-only', 'unknown', '/site/app.js', 'failed', 'later-failure')).toBeUndefined();
  });
  it('replaces a named function body independently of its formatting', () => {
    const engine = new PatchEngine([{ ...base, id: 'ast', type: 'ast', targets: [{ file: '/site/app.js', functionName: 'render', expect: 1, replacement: 'return 42;' }] }]);
    const result = engine.applyToFile({ path: '/site/app.js', content: 'function render (x) { return x + 1; }', siteVer: '13ebcdcfc1' });
    expect(result.content).toContain('return 42;');
    expect(result.report.entries[0]?.status).toBe('applied');
  });
  it('rejects ambiguous AST matches and disables the patch for subsequent loads', () => {
    const engine = new PatchEngine([{ ...base, id: 'ast', type: 'ast', targets: [{ file: '/site/app.js', functionName: 'render', replacement: 'return 42;' }] }]);
    const input = { path: '/site/app.js', content: 'function render() {} function render() {}', siteVer: '13ebcdcfc1' };
    expect(engine.applyToFile(input).report.entries[0]?.reason).toBe('function-count:2/1');
    expect(engine.applyToFile(input).report.entries[0]?.reason).toBe('failed-earlier');
  });
  it('rolls back an invalid AST replacement', () => {
    const engine = new PatchEngine([{ ...base, id: 'ast', type: 'ast', targets: [{ file: '/site/app.js', functionName: 'render', replacement: 'return (' }] }]);
    const input = { path: '/site/app.js', content: 'function render() { return 1; }', siteVer: '13ebcdcfc1' };
    const result = engine.applyToFile(input);
    expect(result.content).toBe(input.content);
    expect(result.report.entries[0]?.status).toBe('failed');
  });
});

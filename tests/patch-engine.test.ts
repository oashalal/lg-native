import { describe, expect, it } from 'vitest';
import { PatchEngine } from '../src/main/patching/engine.js';

const source = 'const api = (p) => fetch(p);\nwindow.LGLive = () => true;';
const base = { name: 'test', version: '1', enabled: true, siteVersions: ['13ebcdcfc1'], strict: true, scope: { channels: ['*'], pages: ['/c/*'] }, requires: [], onFail: 'disable', settings: {} };

describe('PatchEngine', () => {
  it('applies an exact source anchor and validates syntax', () => {
    const engine = new PatchEngine([{ ...base, id: 'source', type: 'source', targets: [{ file: '/site/app.js', anchor: 'window.LGLive = () => true;', expect: 1, replacement: 'window.LGX = true;' }] }]);
    const result = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: '13ebcdcfc1', channel: '5opka', page: '/c/5opka/' });
    expect(result.content).toContain('window.LGX = true;'); expect(result.report.entries[0]?.status).toBe('applied');
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
  it('does not inject network-enabled runtime code into the page world', () => {
    const engine = new PatchEngine([{ ...base, id: 'network', type: 'runtime', strict: false, network: { hosts: ['example.com'] }, settings: { script: 'window.secret = true;' } }]);
    const result = engine.applyToFile({ path: '/site/app.js', content: source, siteVer: 'unknown' });
    expect(result.content).toBe(source);
    expect(result.report.entries).toEqual([]);
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

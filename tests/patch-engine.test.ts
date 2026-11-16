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
    const engine = new PatchEngine([{ ...base, id: 'css', type: 'css', settings: { css: 'body{}' } }], [], true);
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
});

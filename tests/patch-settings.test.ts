import { describe, expect, it } from 'vitest';
import { parseManifest } from '../src/shared/manifest.js';
import { applyOverride, validateOverride } from '../src/main/patching/settings.js';

const manifest = parseManifest({ id: 'settings-example', name: 'Example', version: '1', type: 'runtime', settings: { internal: 1 }, settingsSchema: { label: { type: 'string', label: 'Label', default: 'Test', maxLength: 8 }, show: { type: 'boolean', label: 'Show', default: true }, count: { type: 'number', label: 'Count', default: 2, min: 1, max: 5 } } });
describe('patch settings', () => {
  it('merges defaults and valid saved settings', () => {
    expect(applyOverride(manifest, { enabled: false, values: { label: 'Hello', show: false, count: 3 } })).toMatchObject({ enabled: false, settings: { label: 'Hello', show: false, count: 3, internal: 1 } });
    expect(applyOverride(manifest, undefined).settings).toMatchObject({ label: 'Test', show: true, count: 2 });
  });
  it('rejects unknown or invalid fields and falls back to defaults for stale settings', () => {
    expect(() => validateOverride(manifest, { enabled: true, values: { count: 10 } })).toThrow('invalid-setting');
    expect(() => validateOverride(manifest, { enabled: true, values: { script: 'bad' } })).toThrow('unknown-setting');
    expect(applyOverride(manifest, { enabled: false, values: { count: 10 } }).settings.count).toBe(2);
  });
  it('rejects invalid manifest defaults', () => {
    expect(() => parseManifest({ id: 'bad', name: 'Bad', version: '1', type: 'runtime', settingsSchema: { field: { type: 'number', label: 'Field', min: 2, default: 1 } } })).toThrow();
  });
});

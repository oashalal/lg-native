import type { PatchManifest } from '../../shared/manifest.js';

export type SettingValue = boolean | string | number;
export interface PatchOverride { enabled: boolean; values: Record<string, SettingValue>; }
export type PatchOverrides = Record<string, PatchOverride>;

export function validateOverride(manifest: PatchManifest, input: unknown): PatchOverride {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('invalid-patch-settings');
  const data = input as { enabled?: unknown; values?: unknown };
  if (typeof data.enabled !== 'boolean' || !data.values || typeof data.values !== 'object' || Array.isArray(data.values)) throw new Error('invalid-patch-settings');
  const values: Record<string, SettingValue> = {};
  const raw = data.values as Record<string, unknown>;
  const schema = manifest.settingsSchema ?? {};
  if (Object.keys(raw).some((key) => !Object.hasOwn(schema, key))) throw new Error('unknown-setting');
  for (const [key, spec] of Object.entries(schema)) {
    const value = raw[key] ?? spec.default;
    if (spec.type === 'boolean' && typeof value === 'boolean') values[key] = value;
    else if (spec.type === 'string' && typeof value === 'string' && value.length <= spec.maxLength) values[key] = value;
    else if (spec.type === 'number' && typeof value === 'number' && Number.isFinite(value) && (spec.min === undefined || value >= spec.min) && (spec.max === undefined || value <= spec.max)) values[key] = value;
    else throw new Error(`invalid-setting:${key}`);
  }
  return { enabled: data.enabled, values };
}

export function applyOverride(manifest: PatchManifest, input: unknown): PatchManifest {
  const defaults = { enabled: manifest.enabled, values: {} };
  let override: PatchOverride;
  try { override = validateOverride(manifest, input ?? defaults); } catch { override = validateOverride(manifest, defaults); }
  return { ...manifest, enabled: override.enabled, settings: { ...manifest.settings, ...override.values } };
}

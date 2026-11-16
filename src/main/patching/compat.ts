import { z } from 'zod';
import type { PatchManifest } from '../../shared/manifest.js';

const matrixSchema = z.record(z.string(), z.record(z.string(), z.enum(['ok', 'failed', 'skipped'])));
export type CompatibilityMatrix = z.infer<typeof matrixSchema>;
export function parseMatrix(value: unknown): CompatibilityMatrix { return matrixSchema.parse(value); }

export function compatibility(manifest: PatchManifest, siteVer: string, matrix: CompatibilityMatrix): 'ok' | 'unverified' | 'failed' | 'skipped' {
  if (manifest.siteVersions.length && !manifest.siteVersions.includes(siteVer)) return 'skipped';
  const result = matrix[siteVer]?.[manifest.id];
  if (result === 'failed') return 'failed';
  if (result === 'ok') return 'ok';
  if (manifest.strict) return 'skipped';
  return 'unverified';
}

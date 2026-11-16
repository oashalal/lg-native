import { z } from 'zod';

export const PatchType = z.enum(['css', 'runtime', 'source', 'ast', 'native']);
export const Requirement = z.string().min(1);

const targetSchema = z.object({
  file: z.string().startsWith('/'),
  anchor: z.string().optional(),
  expect: z.number().int().positive().optional(),
  replacement: z.string().optional(),
});

const networkSchema = z.object({
  hosts: z.array(z.string().min(1)),
  timeoutMs: z.number().int().positive().max(120_000).optional(),
  maxBytes: z.number().int().positive().max(20_000_000).optional(),
}).optional();

export const patchManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  name: z.string().min(1),
  version: z.string().min(1),
  type: PatchType,
  enabled: z.boolean().default(true),
  siteVersions: z.array(z.string().min(1)).default([]),
  strict: z.boolean().default(false),
  scope: z.object({ channels: z.array(z.string()).default(['*']), pages: z.array(z.string()).default(['/c/*']) }).default({ channels: ['*'], pages: ['/c/*'] }),
  targets: z.array(targetSchema).default([]),
  requires: z.array(Requirement).default([]),
  onFail: z.enum(['disable', 'original']).default('disable'),
  settings: z.record(z.string(), z.unknown()).default({}),
  network: networkSchema,
});

export type PatchManifest = z.infer<typeof patchManifestSchema>;
export type PatchTypeName = z.infer<typeof PatchType>;
export type PatchStatus = 'applied' | 'skipped' | 'failed';
export interface PatchReportEntry { patchId: string; status: PatchStatus; reason?: string; siteVer: string; }
export interface PatchReport { siteVer: string; entries: PatchReportEntry[]; safeMode: boolean; generatedAt: string; path?: string; }

export function parseManifest(value: unknown): PatchManifest {
  return patchManifestSchema.parse(value);
}

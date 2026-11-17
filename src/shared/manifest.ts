import { z } from 'zod';

export const PatchType = z.enum(['css', 'runtime', 'source', 'ast', 'native']);
export const Requirement = z.string().min(1);

const targetSchema = z.object({
  file: z.string().startsWith('/'),
  anchor: z.string().optional(),
  expect: z.number().int().positive().optional(),
  replacement: z.string().optional(),
  functionName: z.string().regex(/^[A-Za-z_$][\w$]*$/).optional(),
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
  settingsSchema: z.record(z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/).refine((key) => key !== 'script', 'reserved-setting'), z.discriminatedUnion('type', [
    z.object({ type: z.literal('boolean'), label: z.string().min(1), default: z.boolean(), description: z.string().optional(), public: z.boolean().default(false), secret: z.boolean().default(false), visibility: z.enum(['public', 'secret']).optional() }),
    z.object({ type: z.literal('string'), label: z.string().min(1), default: z.string().max(4096), description: z.string().optional(), maxLength: z.number().int().min(1).max(4096).default(512), public: z.boolean().default(false), secret: z.boolean().default(false), visibility: z.enum(['public', 'secret']).optional() }).refine((value) => value.default.length <= value.maxLength, 'invalid-default'),
    z.object({ type: z.literal('number'), label: z.string().min(1), default: z.number().finite(), description: z.string().optional(), min: z.number().finite().optional(), max: z.number().finite().optional(), public: z.boolean().default(false), secret: z.boolean().default(false), visibility: z.enum(['public', 'secret']).optional() }).refine((value) => (value.min === undefined || value.default >= value.min) && (value.max === undefined || value.default <= value.max), 'invalid-default'),
  ])).default({}),
  network: networkSchema,
});

type ParsedManifest = z.infer<typeof patchManifestSchema>;
export type PatchManifest = Omit<ParsedManifest, 'settingsSchema'> & { settingsSchema?: ParsedManifest['settingsSchema'] };
export type PatchTypeName = z.infer<typeof PatchType>;
export type PatchStatus = 'applied' | 'skipped' | 'failed';
export interface PatchReportEntry { patchId: string; status: PatchStatus; reason?: string; siteVer: string; }
export interface PatchReport { siteVer: string; entries: PatchReportEntry[]; safeMode: boolean; generatedAt: string; path?: string; fileVer?: string; }

export function parseManifest(value: unknown): PatchManifest {
  const manifest = patchManifestSchema.parse(value);
  return { ...manifest, settingsSchema: manifest.settingsSchema ?? {}, strict: (typeof value === 'object' && value !== null && 'strict' in value && typeof value.strict === 'boolean') ? value.strict : manifest.type === 'source' || manifest.type === 'ast' };
}

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

const scriptSource = z.union([z.string().min(1), z.object({ file: z.string().min(1) })]);
const queryParameter = z.object({
  type: z.enum(['string', 'number', 'boolean']),
  required: z.boolean().default(false),
  maxLength: z.number().int().min(1).max(4096).default(256),
});
const networkSchema = z.object({
  // Validate hosts as host[:port] or the server profile token; reject URL syntax early.
  hosts: z.array(z.string().min(1).refine((host) => {
    if (host === '$serverUrl') return true;
    if (host !== host.toLowerCase() || /[/?#@\\]/.test(host)) return false;
    try { const url = new URL(`https://${host}`); return url.host === host && url.pathname === '/'; } catch { return false; }
  }, 'invalid-host')),
  endpoints: z.array(z.string().startsWith('/')).default([]),
  namedEndpoints: z.record(z.string().regex(/^[a-zA-Z][\w-]*$/), z.string().min(1)).default({}),
  query: z.union([z.record(z.string().regex(/^[a-zA-Z][\w-]*$/), queryParameter), z.record(z.string().startsWith('/'), z.record(z.string().regex(/^[a-zA-Z][\w-]*$/), queryParameter))]).default({}),
  serverUrl: z.string().url().optional(),
  timeoutMs: z.number().int().positive().max(120_000).optional(),
  maxBytes: z.number().int().positive().max(20_000_000).optional(),
  maxRedirects: z.number().int().min(0).max(5).default(5),
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
  runtime: z.object({
    pageScript: scriptSource.optional(),
    networkScript: scriptSource.optional(),
    updateMs: z.number().int().min(0).max(86_400_000).optional(),
  }).optional(),
  settingsSchema: z.record(z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/).refine((key) => key !== 'script', 'reserved-setting'), z.discriminatedUnion('type', [
    z.object({ type: z.literal('boolean'), label: z.string().min(1), default: z.boolean(), description: z.string().optional(), public: z.boolean().default(false), secret: z.boolean().default(false), visibility: z.enum(['public', 'secret']).optional() }),
    z.object({ type: z.literal('string'), label: z.string().min(1), default: z.string().max(4096), description: z.string().optional(), maxLength: z.number().int().min(1).max(4096).default(512), public: z.boolean().default(false), secret: z.boolean().default(false), visibility: z.enum(['public', 'secret']).optional() }).refine((value) => value.default.length <= value.maxLength, 'invalid-default'),
    z.object({ type: z.literal('number'), label: z.string().min(1), default: z.number().finite(), min: z.number().finite().optional(), max: z.number().finite().optional(), public: z.boolean().default(false), secret: z.boolean().default(false), visibility: z.enum(['public', 'secret']).optional() }).refine((value) => (value.min === undefined || value.default >= value.min) && (value.max === undefined || value.default <= value.max), 'invalid-default'),
  ])).default({}),
  network: networkSchema,
});

type ParsedManifest = z.infer<typeof patchManifestSchema>;
type QueryField = { type: 'string' | 'number' | 'boolean'; required: boolean; maxLength: number };
export type PatchNetwork = { hosts: string[]; endpoints?: string[] | undefined; namedEndpoints?: Record<string, string> | undefined; query?: Record<string, QueryField | Record<string, QueryField>> | undefined; serverUrl?: string | undefined; timeoutMs?: number | undefined; maxBytes?: number | undefined; maxRedirects?: number | undefined };
export type ScriptSource = string | { file: string };
export type PatchManifest = Omit<ParsedManifest, 'settingsSchema' | 'network' | 'runtime'> & { settingsSchema?: ParsedManifest['settingsSchema'] | undefined; network?: PatchNetwork | undefined; runtime?: { pageScript?: ScriptSource | undefined; networkScript?: ScriptSource | undefined; updateMs?: number | undefined } | undefined };
export type PatchTypeName = z.infer<typeof PatchType>;
export type PatchStatus = 'applied' | 'pending' | 'skipped' | 'failed';
export interface PatchReportEntry { patchId: string; status: PatchStatus; reason?: string; siteVer: string; }
export interface PatchReport { siteVer: string; entries: PatchReportEntry[]; safeMode: boolean; generatedAt: string; path?: string; fileVer?: string; }

export function parseManifest(value: unknown): PatchManifest {
  const manifest = patchManifestSchema.parse(value);
  return { ...manifest, settingsSchema: manifest.settingsSchema ?? {}, strict: (typeof value === 'object' && value !== null && 'strict' in value && typeof value.strict === 'boolean') ? value.strict : manifest.type === 'source' || manifest.type === 'ast' };
}

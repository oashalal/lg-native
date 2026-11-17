import type { PatchReport } from '../../shared/manifest.js';

export const NOTIFY_TITLE_MAX_LENGTH = 120;
export const NOTIFY_BODY_MAX_LENGTH = 1_000;
export const NOTIFY_LIMIT = 5;
export const NOTIFY_WINDOW_MS = 60_000;

export interface PublicNotify {
  title: string;
  body: string;
}

export function parseNotify(value: unknown): PublicNotify {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('invalid-notify');
  const data = value as { title?: unknown; body?: unknown };
  if (typeof data.title !== 'string' || typeof data.body !== 'string') throw new Error('invalid-notify');
  if (data.title.length > NOTIFY_TITLE_MAX_LENGTH || data.body.length > NOTIFY_BODY_MAX_LENGTH) throw new Error('notify-too-long');
  return { title: data.title, body: data.body };
}

export class NotificationGate {
  private startedAt = 0;
  private count = 0;

  allow(now = Date.now()): boolean {
    if (now - this.startedAt >= NOTIFY_WINDOW_MS) {
      this.startedAt = now;
      this.count = 0;
    }
    if (this.count >= NOTIFY_LIMIT) return false;
    this.count += 1;
    return true;
  }
}

export type PublicPatchReport = Omit<PatchReport, 'path'>;

export function publicPatchReports(reports: readonly PatchReport[]): PublicPatchReport[] {
  return reports.map((report) => {
    const publicReport = { ...report } as Partial<PatchReport>;
    delete publicReport.path;
    return publicReport as PublicPatchReport;
  });
}

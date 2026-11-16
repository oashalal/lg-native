import { appendFile, mkdir, rename, stat, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { PatchReport } from '../../shared/manifest.js';

/** Serializes writes so concurrent asset requests cannot race rotation. */
export class ReportLog {
  private pending: Promise<void> = Promise.resolve();
  constructor(private readonly path: string, private readonly maxBytes = 5 * 1024 * 1024) {}

  write(report: PatchReport): Promise<void> {
    const line = `${JSON.stringify(report)}\n`;
    const operation = this.pending.then(async () => {
      await mkdir(dirname(this.path), { recursive: true });
      let size = 0;
      try { size = (await stat(this.path)).size; } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
      if (size && size + Buffer.byteLength(line) > this.maxBytes) {
        await rm(`${this.path}.1`, { force: true });
        await rename(this.path, `${this.path}.1`);
      }
      await appendFile(this.path, line, 'utf8');
    });
    this.pending = operation.catch(() => undefined);
    return operation;
  }
}

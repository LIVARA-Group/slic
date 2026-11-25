import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { BenchmarkReport } from '../../core/results/benchmark-report.js';

export async function writeBenchmarkReport(
  report: BenchmarkReport,
  filePath: string,
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });

  await writeFile(filePath, `${JSON.stringify(report, null, 2)}\n`, {
    encoding: 'utf8',
  });
}

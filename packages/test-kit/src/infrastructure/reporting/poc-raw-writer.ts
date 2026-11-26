import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { BenchmarkResult } from '../../core/benchmark/benchmark-result.js';
import type { DatasetManifest } from '../../core/dataset/dataset.js';
import type { EnvironmentManifest } from '../../core/environment/environment-manifest.js';
import type { POCOperationMix } from '../../core/results/poc-result.js';

export interface POCRawResults {
  schemaVersion: 1;
  poc_id: string;
  scenario: string;
  candidate: string;
  dataset: DatasetManifest;
  environment: EnvironmentManifest;
  seed: number;
  operation_mix: POCOperationMix;
  runs: BenchmarkResult[];
}

export async function writePOCRawResults(
  results: POCRawResults,
  filePath: string,
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });

  await writeFile(filePath, `${JSON.stringify(results, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'wx',
  });
}

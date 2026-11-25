import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectEnvironmentManifest } from '../environment/manifest.js';
import { createBenchmarkReport } from './report.js';
import { writeBenchmarkReport } from './report-writer.js';

let temporaryDirectory: string | undefined;

afterEach(async () => {
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    temporaryDirectory = undefined;
  }
});

describe('writeBenchmarkReport', () => {
  it('writes a benchmark report as JSON', async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'slic-benchmark-'));

    const filePath = join(temporaryDirectory, 'nested', 'report.json');

    const report = createBenchmarkReport({
      id: 'poc-01-baseline',
      environment: collectEnvironmentManifest(),
      dataset: {
        seed: 42,
        noteCount: 1000,
        entityCount: 500,
        relationCount: 1500,
      },
      benchmarks: [],
    });

    await writeBenchmarkReport(report, filePath);

    const content = await readFile(filePath, 'utf8');
    const restored = JSON.parse(content);

    expect(restored).toEqual(report);
  });
});

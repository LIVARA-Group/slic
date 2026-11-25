import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createBenchmarkReport } from '../../core/results/benchmark-report.js';
import { createPOCResult } from '../../core/results/poc-result.js';
import { runBenchmark } from '../benchmark/benchmark-runner.js';
import { collectEnvironmentManifest } from '../environment/manifest-collector.js';
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
        distribution: {},
        metadata: {
          id: 'DS-P-S',
          family: 'DS-P',
          seed: 42,
          generatorVersion: '1.0.0',
          checksum: 'a'.repeat(64),
        },
        recordCounts: {
          notes: 1000,
          entities: 500,
          relations: 1500,
        },
      },
      benchmarks: [],
    });

    await writeBenchmarkReport(report, filePath);

    const content = await readFile(filePath, 'utf8');
    const restored = JSON.parse(content);

    expect(restored).toEqual(report);
    expect(restored.environment).toEqual(report.environment);
  });

  it('preserves complete POC results through JSON serialization', async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'slic-benchmark-'));

    const filePath = join(temporaryDirectory, 'nested', 'poc-report.json');
    const environment = collectEnvironmentManifest();

    const run = await runBenchmark(() => { }, {
      name: 'insert-records',
      warmupIterations: 1,
      iterations: 3,
    });

    const pocResult = createPOCResult({
      poc_id: 'POC-01',
      scenario: 'baseline-insert',
      candidate: 'indexeddb',
      dataset_id: 'DS-P-S',
      seed: 42,
      environment_manifest_id: environment.id,
      runs: [run],
      raw_uri: 'results/poc-01/raw.json',
      operation_mix: {
        create_note: 0.4,
        update_note: 0.3,
        read_note: 0.2,
        delete_note: 0.1,
      },
    });

    const report = createBenchmarkReport({
      id: 'poc-01-baseline',
      environment,
      dataset: {
        distribution: {},
        metadata: {
          id: 'DS-P-S',
          family: 'DS-P',
          seed: 42,
          generatorVersion: '1.0.0',
          checksum: 'a'.repeat(64),
        },
        recordCounts: {
          notes: 1000,
          entities: 500,
          relations: 1500,
        },
      },
      benchmarks: [run],
      pocResults: [pocResult],
    });

    await writeBenchmarkReport(report, filePath);

    const content = await readFile(filePath, 'utf8');
    const restored = JSON.parse(content);

    expect(restored).toEqual(report);
    expect(restored.environment).toEqual(report.environment);
    expect(restored.pocResults).toEqual([pocResult]);
    expect(restored.pocResults[0].percentiles).toEqual(pocResult.percentiles);
    expect(restored.pocResults[0].memory).toEqual(pocResult.memory);
    expect(restored.pocResults[0].failures).toEqual([]);
  });
});

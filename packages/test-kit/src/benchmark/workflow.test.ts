import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createBenchmarkReport } from '../core/results/benchmark-report.js';
import { generatePersonalDataset } from '../generators/personal/personal-dataset.js';
import { runBenchmark } from '../infrastructure/benchmark/benchmark-runner.js';
import { collectEnvironmentManifest } from '../infrastructure/environment/manifest-collector.js';
import { writeBenchmarkReport } from '../infrastructure/reporting/report-writer.js';

let temporaryDirectory: string | undefined;

afterEach(async () => {
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    temporaryDirectory = undefined;
  }
});

describe('benchmark workflow', () => {
  it('generates data, benchmarks an operation and saves a report', async () => {
    const datasetOptions = {
      id: 'DS-P-S',
      seed: 42,
      noteCount: 1_000,
      entityCount: 500,
      relationCount: 1_500,
    };

    const dataset = generatePersonalDataset(datasetOptions);

    const benchmark = await runBenchmark(
      () => {
        generatePersonalDataset(datasetOptions);
      },
      {
        name: 'personal-dataset-generation',
        warmupIterations: 2,
        iterations: 5,
      },
    );

    const report = createBenchmarkReport({
      id: 'wp-010-smoke-test',
      environment: collectEnvironmentManifest(),
      dataset: dataset.manifest,
      benchmarks: [benchmark],
    });

    temporaryDirectory = await mkdtemp(join(tmpdir(), 'slic-workflow-'));

    const reportPath = join(temporaryDirectory, 'results', 'report.json');

    await writeBenchmarkReport(report, reportPath);

    const content = await readFile(reportPath, 'utf8');
    const restored = JSON.parse(content);

    expect(dataset.data.notes).toHaveLength(1_000);
    expect(dataset.data.entities).toHaveLength(500);
    expect(dataset.data.relations).toHaveLength(1_500);

    expect(benchmark.duration.samples).toBe(5);
    expect(restored.id).toBe('wp-010-smoke-test');
    expect(restored.benchmarks).toHaveLength(1);
    expect(restored.dataset).toEqual(dataset.manifest);

    expect(restored.benchmarks[0].memoryBefore).toEqual(benchmark.memoryBefore);
    expect(restored.benchmarks[0].memoryAfter).toEqual(benchmark.memoryAfter);
    expect(restored.benchmarks[0].memoryDelta).toEqual(benchmark.memoryDelta);

    expect(restored.environment).toEqual(report.environment);

    expect(restored.dataset.metadata.generatorVersion).toBe(dataset.manifest.metadata.generatorVersion);
    expect(restored.dataset.metadata.checksum).toBe(dataset.manifest.metadata.checksum);
  });
});

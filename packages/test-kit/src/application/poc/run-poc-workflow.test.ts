
import { describe, expect, it, vi } from 'vitest';
import type { BenchmarkResult } from '../../core/benchmark/benchmark-result.js';
import type { GeneratedDataset } from '../../core/dataset/dataset.js';
import type { BenchmarkReport } from '../../core/results/benchmark-report.js';
import type { POCResult } from '../../core/results/poc-result.js';
import { collectEnvironmentManifest } from '../../infrastructure/environment/manifest-collector.js';
import type { PocWorkflowDependencies } from './run-poc-workflow.js';
import { runPocWorkflow } from './run-poc-workflow.js';

function createBenchmarkResult(name: string): BenchmarkResult {
  return {
    name,
    warmupIterations: 0,
    iterations: 1,
    concurrency: 1,
    cacheState: 'not-applicable',
    startedAt: '2026-11-26T00:00:00.000Z',
    completedAt: '2026-11-26T00:00:01.000Z',
    samplesMs: [1],
    duration: {
      samples: 1,
      min: 1,
      max: 1,
      mean: 1,
      median: 1,
      p95: 1,
      p99: 1,
    },
    operationsPerSecond: 1000,
    memoryMeasurement: {
      method: 'test',
      scope: 'test',
    },
    memoryBefore: {
      rss: 100,
      heapTotal: 50,
      heapUsed: 30,
      external: 5,
      arrayBuffers: 1,
    },
    memoryAfter: {
      rss: 110,
      heapTotal: 55,
      heapUsed: 35,
      external: 6,
      arrayBuffers: 2,
    },
    memoryDelta: {
      rss: 10,
      heapTotal: 5,
      heapUsed: 5,
      external: 1,
      arrayBuffers: 1,
    },
  };
}

function createDataset(): GeneratedDataset<unknown> {
  return {
    data: {},
    manifest: {
      metadata: {
        id: 'DS-P-test',
        family: 'DS-P',
        seed: 42,
        generatorVersion: '1.0.0',
        checksum: 'a'.repeat(64),
      },
      recordCounts: {},
      distribution: {},
    },
  };
}

function createPocResult(): POCResult {
  return {
    poc_id: 'POC-01',
    scenario: 'baseline',
    candidate: 'test-engine',
    dataset_id: 'DS-P-test',
    seed: 42,
    environment_manifest_id: 'environment-test',
    runs: [createBenchmarkResult('run-1')],
    percentiles: { p50: 1, p95: 1, p99: 1 },
    memory: { runs: [] },
    failures: [],
    raw_uri: 'results/poc01/raw.json',
    operation_mix: { read: 1 },
  };
}

function createReport(
  options: Parameters<PocWorkflowDependencies['createReport']>[0],
): BenchmarkReport {
  return {
    schemaVersion: 1,
    id: 'report-test',
    createdAt: '2026-11-26T00:00:00.000Z',
    environment: options.environment,
    dataset: options.dataset,
    benchmarks: options.benchmarks,
    pocResults: options.pocResults ?? [],
  };
}


function createDependencies(
  overrides: Partial<PocWorkflowDependencies> = {},
): PocWorkflowDependencies {
  const environment = collectEnvironmentManifest();

  return {
    collectEnvironment: vi.fn<PocWorkflowDependencies['collectEnvironment']>(() => ({
      ...environment,
      id: 'environment-test',
    })),
    runBenchmark: vi.fn<PocWorkflowDependencies['runBenchmark']>(
      async (_operation, options) => createBenchmarkResult(options.name),
    ),
    createPocResult: vi.fn<PocWorkflowDependencies['createPocResult']>(
      () => createPocResult(),
    ),
    writeRawResults: vi.fn<PocWorkflowDependencies['writeRawResults']>(
      async () => { },
    ),
    createReport: vi.fn<PocWorkflowDependencies['createReport']>(createReport),
    writeReport: vi.fn<PocWorkflowDependencies['writeReport']>(
      async () => { },
    ),
    ...overrides,
  };
}

function createRequest() {
  return {
    reportId: 'report-test',
    pocId: 'POC-01',
    scenario: 'baseline',
    candidate: 'test-engine',
    dataset: createDataset(),
    operationMix: { read: 1 },
    runs: [
      {
        benchmark: { name: 'run-1', iterations: 1 },
        operation: () => { },
      },
      {
        benchmark: { name: 'run-2', iterations: 1 },
        operation: () => { },
      },
    ],
    rawOutputPath: 'results/poc01/raw.json',
    reportOutputPath: 'results/poc01/report.json',
  };
}

describe('runPocWorkflow', () => {
  it('executes runs and persists raw results and report in order', async () => {
    const events: string[] = [];

    const dependencies = createDependencies({
      collectEnvironment: vi.fn<PocWorkflowDependencies['collectEnvironment']>(() => {
        events.push('environment');
        return {
          ...collectEnvironmentManifest(),
          id: 'environment-test',
        };
      }),
      runBenchmark: vi.fn<PocWorkflowDependencies['runBenchmark']>(
        async (_operation, options) => {
          events.push(options.name);
          return createBenchmarkResult(options.name);
        },
      ),
      writeRawResults: vi.fn<PocWorkflowDependencies['writeRawResults']>(
        async () => {
          events.push('raw');
        },
      ),
      createPocResult: vi.fn<PocWorkflowDependencies['createPocResult']>(() => {
        events.push('poc-result');
        return createPocResult();
      }),
      createReport: vi.fn<PocWorkflowDependencies['createReport']>((options) => {
        events.push('report');
        return createReport(options);
      }),
      writeReport: vi.fn<PocWorkflowDependencies['writeReport']>(async () => {
        events.push('write-report');
      }),
    });

    const report = await runPocWorkflow(createRequest(), dependencies);

    expect(events).toEqual([
      'environment',
      'run-1',
      'run-2',
      'raw',
      'poc-result',
      'report',
      'write-report',
    ]);

    expect(report.id).toBe('report-test');
    expect(report.benchmarks).toHaveLength(2);
    expect(report.pocResults).toHaveLength(1);
  });

  it('writes raw results with the collected metadata and all runs', async () => {
    const dependencies = createDependencies();

    await runPocWorkflow(createRequest(), dependencies);

    const rawWriteCall = vi.mocked(dependencies.writeRawResults).mock.calls.at(0);

    expect(rawWriteCall).toBeDefined();

    if (!rawWriteCall) {
      throw new Error('Expected raw results to be written');
    }

    const [rawResults, outputPath] = rawWriteCall;

    expect(outputPath).toBe('results/poc01/raw.json');
    expect(rawResults.poc_id).toBe('POC-01');
    expect(rawResults.dataset.metadata.id).toBe('DS-P-test');
    expect(rawResults.seed).toBe(42);
    expect(rawResults.runs).toHaveLength(2);
  });

  it('does not execute or persist anything when no runs are provided', async () => {
    const dependencies = createDependencies();

    await expect(
      runPocWorkflow(
        { ...createRequest(), runs: [] },
        dependencies,
      ),
    ).rejects.toThrow('at least one benchmark run');

    expect(dependencies.collectEnvironment).not.toHaveBeenCalled();
    expect(dependencies.runBenchmark).not.toHaveBeenCalled();
    expect(dependencies.writeRawResults).not.toHaveBeenCalled();
    expect(dependencies.writeReport).not.toHaveBeenCalled();
  });

  it('does not persist results when a benchmark run fails', async () => {
    const error = new Error('Benchmark failed');
    const dependencies = createDependencies({
      runBenchmark: vi.fn<PocWorkflowDependencies['runBenchmark']>(async () => {
        throw error;
      }),
    });

    await expect(
      runPocWorkflow(createRequest(), dependencies),
    ).rejects.toThrow('Benchmark failed');

    expect(dependencies.writeRawResults).not.toHaveBeenCalled();
    expect(dependencies.createPocResult).not.toHaveBeenCalled();
    expect(dependencies.createReport).not.toHaveBeenCalled();
    expect(dependencies.writeReport).not.toHaveBeenCalled();
  });

  it('does not create a report when raw results cannot be written', async () => {
    const dependencies = createDependencies({
      writeRawResults: vi.fn<PocWorkflowDependencies['writeRawResults']>(async () => {
        throw new Error('Raw write failed');
      }),
    });

    await expect(
      runPocWorkflow(createRequest(), dependencies),
    ).rejects.toThrow('Raw write failed');

    expect(dependencies.createPocResult).not.toHaveBeenCalled();
    expect(dependencies.createReport).not.toHaveBeenCalled();
    expect(dependencies.writeReport).not.toHaveBeenCalled();
  });

  it('does not write a report when report creation fails', async () => {
    const dependencies = createDependencies({
      createReport: vi.fn<PocWorkflowDependencies['createReport']>(() => {
        throw new Error('Report creation failed');
      }),
    });

    await expect(
      runPocWorkflow(createRequest(), dependencies),
    ).rejects.toThrow('Report creation failed');

    expect(dependencies.writeRawResults).toHaveBeenCalledOnce();
    expect(dependencies.writeReport).not.toHaveBeenCalled();
  });
});

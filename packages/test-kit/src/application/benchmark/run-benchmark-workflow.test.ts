import { describe, expect, it, vi } from 'vitest';
import type { BenchmarkResult } from '../../core/benchmark/benchmark-result.js';
import { collectEnvironmentManifest } from '../../infrastructure/environment/manifest-collector.js';
import type { BenchmarkWorkflowDependencies } from './run-benchmark-workflow.js';
import { runBenchmarkWorkflow } from './run-benchmark-workflow.js';

function createBenchmarkResult(): BenchmarkResult {
  return {
    name: 'test-operation',
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

describe('runBenchmarkWorkflow', () => {
  it('executes the workflow in the expected order', async () => {
    const events: string[] = [];

    const environment = collectEnvironmentManifest();
    const benchmark = createBenchmarkResult();

    const dependencies: BenchmarkWorkflowDependencies = {
      collectEnvironment: () => {
        events.push('environment');
        return environment;
      },
      prepareDataset: (request) => {
        events.push('dataset');

        return {
          data: {
            notes: [],
            entities: [],
            relations: [],
          },
          manifest: {
            metadata: {
              id: 'DS-P-test',
              family: request.family,
              seed: request.seed,
              generatorVersion: '1.0.0',
              checksum: 'a'.repeat(64),
            },
            recordCounts: {
              notes: 0,
              entities: 0,
              relations: 0,
            },
            distribution: {},
          },
        };
      },
      runBenchmark: async () => {
        events.push('benchmark');
        return benchmark;
      },
      createReport: (options) => {
        events.push('report');
        return {
          schemaVersion: 1,
          id: options.id,
          createdAt: '2026-11-26T00:00:00.000Z',
          environment: options.environment,
          dataset: options.dataset,
          benchmarks: options.benchmarks,
          pocResults: options.pocResults ?? [],
        };
      },
      writeReport: async () => {
        events.push('write');
      },
    };

    const report = await runBenchmarkWorkflow(
      {
        reportId: 'test-report',
        outputPath: 'results/test.json',
        dataset: {
          family: 'DS-P',
          seed: 42,
          options: {
            noteCount: 0,
            entityCount: 0,
            relationCount: 0,
          },
        },
        benchmark: {
          name: 'test-operation',
          warmupIterations: 0,
          iterations: 1,
        },
        operation: () => { },
      },
      dependencies,
    );

    expect(events).toEqual([
      'environment',
      'dataset',
      'benchmark',
      'report',
      'write',
    ]);

    expect(report.id).toBe('test-report');
    expect(report.environment).toEqual(environment);
    expect(report.dataset.metadata.seed).toBe(42);
    expect(report.benchmarks).toEqual([benchmark]);
  });

  it('does not create or write a report when benchmark execution fails', async () => {
    const error = new Error('Benchmark failed');
    const createReport = vi.fn<BenchmarkWorkflowDependencies['createReport']>();
    const writeReport = vi.fn<BenchmarkWorkflowDependencies['writeReport']>();

    const dependencies: BenchmarkWorkflowDependencies = {
      collectEnvironment: collectEnvironmentManifest,
      prepareDataset: () => ({
        data: {
          notes: [],
          entities: [],
          relations: [],
        },
        manifest: {
          metadata: {
            id: 'DS-P-test',
            family: 'DS-P',
            seed: 42,
            generatorVersion: '1.0.0',
            checksum: 'a'.repeat(64),
          },
          recordCounts: {
            notes: 0,
            entities: 0,
            relations: 0,
          },
          distribution: {},
        },
      }),
      runBenchmark: async () => {
        throw error;
      },
      createReport,
      writeReport,
    };

    await expect(
      runBenchmarkWorkflow(
        {
          reportId: 'failed-report',
          outputPath: 'results/failed.json',
          dataset: {
            family: 'DS-P',
            seed: 42,
            options: {
              noteCount: 0,
              entityCount: 0,
              relationCount: 0,
            },
          },
          benchmark: {
            name: 'failing-operation',
            iterations: 1,
          },
          operation: () => { },
        },
        dependencies,
      ),
    ).rejects.toThrow('Benchmark failed');

    expect(createReport).not.toHaveBeenCalled();
    expect(writeReport).not.toHaveBeenCalled();
  });
});

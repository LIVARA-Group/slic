import { describe, expect, it } from 'vitest';
import type { BenchmarkResult } from '../benchmark/benchmark-result.js';
import type { EnvironmentManifest } from '../environment/environment-manifest.js';
import { createBenchmarkReport } from './benchmark-report.js';
import { createPOCResult } from './poc-result.js';

const environment: EnvironmentManifest = {
  schemaVersion: 1,
  id: 'test-environment',
  capturedAt: '2026-11-25T12:00:00.000Z',
  host: {
    os: {
      name: 'win32',
      version: '10.0.26200',
      architecture: 'x64',
    },
    cpu: {
      model: 'Test CPU',
      logicalCores: 8,
    },
    memory: {
      totalBytes: 16_000_000_000,
    },
    storage: {
      type: 'SSD',
      freeSpaceBytes: 100_000_000_000,
    },
  },
  runtime: {
    name: 'node',
    version: 'v22.22.2',
    flags: [],
  },
  browser: null,
  execution: {
    powerMode: null,
  },
  source: {
    commitSha: 'test-commit',
    packageManager: {
      name: 'pnpm',
      version: '12.21.0',
    },
  },
};

function createPOCResultForReport() {
  return createPOCResult({
    poc_id: 'POC-01',
    scenario: 'baseline-insert',
    candidate: 'indexeddb',
    dataset_id: 'DS-P-S',
    seed: 42,
    environment_manifest_id: environment.id,
    runs: [
      {
        name: 'insert-records',
        warmupIterations: 0,
        iterations: 1,
        concurrency: 1,
        cacheState: 'not-applicable',
        memoryMeasurement: {
          method: 'node:process.memoryUsage',
          scope: 'process-snapshot-before-and-after',
        },
        startedAt: '2026-11-25T12:00:00.000Z',
        completedAt: '2026-11-25T12:00:01.000Z',
        samplesMs: [2],
        duration: {
          samples: 1,
          min: 2,
          max: 2,
          mean: 2,
          median: 2,
          p95: 2,
          p99: 2,
        },
        operationsPerSecond: 500,
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
      },
    ],
    raw_uri: 'results/poc-01/raw.json',
    operation_mix: {
      create_note: 0.4,
      update_note: 0.3,
      read_note: 0.2,
      delete_note: 0.1,
    },
  });
}

function createReportOptions() {
  return {
    id: 'poc-01-baseline',
    environment,
    dataset: {
      distribution: {},
      metadata: {
        id: 'DS-P-S',
        family: 'DS-P' as const,
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
  };
}

describe('createBenchmarkReport', () => {
  it('creates a report with the supplied metadata', () => {
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
      benchmarks: [],
    });

    expect(report.schemaVersion).toBe(1);
    expect(report.id).toBe('poc-01-baseline');
    expect(report.environment).toEqual(environment);
    expect(report.dataset.metadata.seed).toBe(42);
    expect(report.benchmarks).toEqual([]);

    expect(report.dataset.metadata.generatorVersion).toBe('1.0.0');
    expect(report.dataset.metadata.checksum).toBe('a'.repeat(64));

    expect(report.pocResults).toEqual([]);
  });

  it('preserves benchmark results', () => {
    const benchmark: BenchmarkResult = {
      name: 'insert-records',
      warmupIterations: 5,
      iterations: 30,
      concurrency: 1,
      cacheState: 'not-applicable',
      memoryMeasurement: {
        method: 'node:process.memoryUsage',
        scope: 'process-snapshot-before-and-after',
      },
      startedAt: '2026-11-25T12:00:00.000Z',
      completedAt: '2026-11-25T12:00:01.000Z',
      samplesMs: [1, 2, 3, 4, 5],
      memoryBefore: {
        rss: 100_000_000,
        heapTotal: 50_000_000,
        heapUsed: 30_000_000,
        external: 5_000_000,
        arrayBuffers: 1_000_000,
      },
      memoryAfter: {
        rss: 110_000_000,
        heapTotal: 55_000_000,
        heapUsed: 35_000_000,
        external: 6_000_000,
        arrayBuffers: 2_000_000,
      },
      memoryDelta: {
        rss: 10_000_000,
        heapTotal: 5_000_000,
        heapUsed: 5_000_000,
        external: 1_000_000,
        arrayBuffers: 1_000_000,
      },
      duration: {
        samples: 10,
        min: 1,
        max: 5,
        mean: 2,
        median: 2,
        p95: 4.5,
        p99: 4.9,
      },
      operationsPerSecond: 500,
    };

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
      benchmarks: [benchmark],
    });

    expect(report.benchmarks).toEqual([benchmark]);

    expect(report.dataset.metadata.generatorVersion).toBe('1.0.0');
    expect(report.dataset.metadata.checksum).toBe('a'.repeat(64));

    expect(report.pocResults).toEqual([]);
  });

  it('accepts POC results matching the report dataset and environment', () => {
    const pocResult = createPOCResultForReport();

    const report = createBenchmarkReport({
      ...createReportOptions(),
      pocResults: [pocResult],
    });

    expect(report.pocResults).toEqual([pocResult]);
  });

  it('rejects POC results with a different dataset ID', () => {
    const pocResult = createPOCResult({
      ...createPOCResultForReport(),
      dataset_id: 'DS-G-S',
    });

    expect(() =>
      createBenchmarkReport({
        ...createReportOptions(),
        pocResults: [pocResult],
      }),
    ).toThrow('POC dataset ID does not match report dataset: DS-G-S');
  });

  it('rejects POC results with a different environment manifest ID', () => {
    const pocResult = createPOCResult({
      ...createPOCResultForReport(),
      environment_manifest_id: 'different-environment',
    });

    expect(() =>
      createBenchmarkReport({
        ...createReportOptions(),
        pocResults: [pocResult],
      }),
    ).toThrow(
      'POC environment manifest ID does not match report environment: different-environment',
    );
  });

  it('rejects POC results with a different dataset seed', () => {
    const pocResult = createPOCResult({
      ...createPOCResultForReport(),
      seed: 123,
    });

    expect(() =>
      createBenchmarkReport({
        ...createReportOptions(),
        pocResults: [pocResult],
      }),
    ).toThrow('POC seed does not match report dataset: 123');
  });
});

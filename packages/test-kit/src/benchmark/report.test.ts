import { describe, expect, it } from 'vitest';
import type { EnvironmentManifest } from '../environment/manifest.js';
import { createBenchmarkReport } from './report.js';

const environment: EnvironmentManifest = {
  platform: 'win32',
  architecture: 'x64',
  cpu: 'Test CPU',
  cpuCount: 8,
  totalMemoryBytes: 16_000_000_000,
  nodeVersion: 'v22.22.2',
  pnpmVersion: '12.21.0',
  commitSha: 'test-commit',
  timestamp: '2026-11-25T12:00:00.000Z',
};

describe('createBenchmarkReport', () => {
  it('creates a report with the supplied metadata', () => {
    const report = createBenchmarkReport({
      id: 'poc-01-baseline',
      environment,
      dataset: {
        seed: 42,
        noteCount: 1000,
        entityCount: 500,
        relationCount: 1500,
      },
      benchmarks: [],
    });

    expect(report.schemaVersion).toBe(1);
    expect(report.id).toBe('poc-01-baseline');
    expect(report.environment).toEqual(environment);
    expect(report.dataset.seed).toBe(42);
    expect(report.benchmarks).toEqual([]);
  });

  it('preserves benchmark results', () => {
    const benchmark = {
      name: 'insert-records',
      warmupIterations: 5,
      iterations: 30,
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
        seed: 42,
        noteCount: 1000,
        entityCount: 500,
        relationCount: 1500,
      },
      benchmarks: [benchmark],
    });

    expect(report.benchmarks).toEqual([benchmark]);
  });
});

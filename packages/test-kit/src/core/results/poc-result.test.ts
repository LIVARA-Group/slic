import { describe, expect, it } from 'vitest';
import type { BenchmarkResult } from '../benchmark/benchmark-result.js';
import { createPOCResult } from './poc-result.js';

function createRun(samplesMs: number[]): BenchmarkResult {
  return {
    name: 'insert-records',
    warmupIterations: 5,
    iterations: samplesMs.length,
    concurrency: 1,
    cacheState: 'not-applicable',
    memoryMeasurement: {
      method: 'node:process.memoryUsage',
      scope: 'process-snapshot-before-and-after',
    },
    startedAt: '2026-11-25T12:00:00.000Z',
    completedAt: '2026-11-25T12:00:01.000Z',
    samplesMs,
    duration: {
      samples: samplesMs.length,
      min: Math.min(...samplesMs),
      max: Math.max(...samplesMs),
      mean: samplesMs.reduce((sum, value) => sum + value, 0) / samplesMs.length,
      median: 0,
      p95: 0,
      p99: 0,
    },
    operationsPerSecond: null,
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
  };
}

function createOptions() {
  return {
    poc_id: 'POC-01',
    scenario: 'baseline-insert',
    candidate: 'indexeddb',
    dataset_id: 'DS-P-S',
    seed: 20261115,
    environment_manifest_id: 'environment-001',
    runs: [createRun([1, 2, 3]), createRun([4, 5, 6])],
    raw_uri: 'results/poc-01/raw.json',
    operation_mix: {
      create_note: 0.4,
      update_note: 0.3,
      read_note: 0.2,
      delete_note: 0.1,
    },
  };
}

describe('createPOCResult', () => {
  it('creates a POC result with the required metadata', () => {
    const result = createPOCResult(createOptions());

    expect(result.poc_id).toBe('POC-01');
    expect(result.scenario).toBe('baseline-insert');
    expect(result.candidate).toBe('indexeddb');
    expect(result.dataset_id).toBe('DS-P-S');
    expect(result.seed).toBe(20261115);
    expect(result.environment_manifest_id).toBe('environment-001');
    expect(result.raw_uri).toBe('results/poc-01/raw.json');
    expect(result.runs).toHaveLength(2);
  });

  it('calculates percentiles from all samples across all runs', () => {
    const result = createPOCResult(createOptions());

    expect(result.percentiles).toEqual({
      p50: 3.5,
      p95: 5.75,
      p99: 5.95,
    });
  });

  it('preserves memory measurements, snapshots and deltas for every run', () => {
    const result = createPOCResult(createOptions());

    expect(result.memory.runs).toHaveLength(2);
    expect(result.memory.runs[0]).toEqual({
      run_index: 0,
      measurement: result.runs[0]?.memoryMeasurement,
      before: result.runs[0]?.memoryBefore,
      after: result.runs[0]?.memoryAfter,
      delta: result.runs[0]?.memoryDelta,
    });
  });

  it('preserves the operation mix', () => {
    const options = createOptions();
    const result = createPOCResult(options);

    expect(result.operation_mix).toEqual(options.operation_mix);
  });

  it('rejects an empty operation mix', () => {
    expect(() =>
      createPOCResult({
        ...createOptions(),
        operation_mix: {},
      }),
    ).toThrow('POC operation mix must contain at least one operation');
  });

  it('rejects operation mix ratios that do not sum to 1', () => {
    expect(() =>
      createPOCResult({
        ...createOptions(),
        operation_mix: {
          create_note: 0.4,
          read_note: 0.4,
        },
      }),
    ).toThrow('POC operation mix ratios must sum to 1');
  });

  it.each([
    ['zero', 0],
    ['negative', -0.1],
    ['greater than one', 1.1],
    ['NaN', Number.NaN],
    ['infinity', Number.POSITIVE_INFINITY],
  ])('rejects a %s operation ratio', (_label, ratio) => {
    expect(() =>
      createPOCResult({
        ...createOptions(),
        operation_mix: {
          create_note: ratio,
        },
      }),
    ).toThrow('Invalid POC operation mix entry: create_note');
  });

  it('rejects an empty operation name', () => {
    expect(() =>
      createPOCResult({
        ...createOptions(),
        operation_mix: {
          '': 1,
        },
      }),
    ).toThrow('Invalid POC operation mix entry: ');
  });

  it('defaults failures to an empty array', () => {
    const result = createPOCResult(createOptions());

    expect(result.failures).toEqual([]);
  });

  it('preserves supplied failures', () => {
    const options = {
      ...createOptions(),
      failures: [
        {
          run_index: 1,
          name: 'StorageError',
          message: 'Transaction aborted',
        },
      ],
    };

    const result = createPOCResult(options);

    expect(result.failures).toEqual(options.failures);
  });

  it('rejects results without benchmark runs', () => {
    expect(() =>
      createPOCResult({
        ...createOptions(),
        runs: [],
      }),
    ).toThrow('POC result must contain at least one benchmark run');
  });

  it('rejects runs without measurement samples', () => {
    expect(() =>
      createPOCResult({
        ...createOptions(),
        runs: [createRun([])],
      }),
    ).toThrow('POC result must contain at least one measurement sample');
  });
});

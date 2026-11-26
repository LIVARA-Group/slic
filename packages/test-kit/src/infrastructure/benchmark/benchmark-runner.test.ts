import { describe, expect, it, vi } from 'vitest';
import { runBenchmark } from './benchmark-runner.js';

describe('runBenchmark', () => {
  it('executes warmup and measurement iterations', async () => {
    const operation = vi.fn<() => void>();

    const result = await runBenchmark(operation, {
      name: 'test-operation',
      warmupIterations: 3,
      iterations: 5,
    });

    expect(operation).toHaveBeenCalledTimes(8);
    expect(result.name).toBe('test-operation');
    expect(result.duration.samples).toBe(5);
    expect(result.samplesMs).toHaveLength(5);
    expect(result.samplesMs.every((sample) => sample >= 0)).toBe(true);
  });

  it('executes operations concurrently within each batch', async () => {
    let active = 0;
    let maximumActive = 0;

    const operation = async () => {
      active += 1;
      maximumActive = Math.max(maximumActive, active);
      await Promise.resolve();
      active -= 1;
    };

    const result = await runBenchmark(operation, {
      name: 'concurrent-operation',
      warmupIterations: 0,
      iterations: 2,
      concurrency: 3,
    });

    expect(maximumActive).toBe(3);
    expect(result.concurrency).toBe(3);
    expect(result.samplesMs).toHaveLength(2);
  });

  it('calculates throughput using batch concurrency', async () => {
    const result = await runBenchmark(() => undefined, {
      name: 'throughput-operation',
      warmupIterations: 0,
      iterations: 3,
      concurrency: 4,
    });

    expect(result.operationsPerSecond).toBe(
      result.duration.mean > 0 ? (4 * 1000) / result.duration.mean : null,
    );
  });

  it('records cache state and memory measurement metadata', async () => {
    const result = await runBenchmark(() => undefined, {
      name: 'metadata-operation',
      warmupIterations: 0,
      iterations: 1,
      cacheState: 'cold',
    });

    expect(result.cacheState).toBe('cold');
    expect(result.memoryMeasurement).toEqual({
      method: 'node:process.memoryUsage',
      scope: 'process-snapshot-before-and-after',
    });
  });

  it('returns valid duration statistics', async () => {
    const result = await runBenchmark(
      async () => {
        await Promise.resolve();
      },
      {
        name: 'async-operation',
        warmupIterations: 1,
        iterations: 5,
      },
    );

    expect(result.duration.min).toBeGreaterThanOrEqual(0);
    expect(result.duration.max).toBeGreaterThanOrEqual(result.duration.min);
    expect(result.duration.median).toBeGreaterThanOrEqual(0);
    expect(result.operationsPerSecond).toBeGreaterThan(0);
  });

  it('rejects invalid iteration counts', async () => {
    await expect(
      runBenchmark(() => undefined, {
        name: 'invalid',
        iterations: 0,
      }),
    ).rejects.toThrow(RangeError);
  });

  it('rejects invalid concurrency', async () => {
    await expect(
      runBenchmark(() => undefined, {
        name: 'invalid-concurrency',
        concurrency: 0,
      }),
    ).rejects.toThrow(RangeError);
  });

  it('supports zero warmup iterations', async () => {
    const operation = vi.fn<() => void>();

    await runBenchmark(operation, {
      name: 'no-warmup',
      warmupIterations: 0,
      iterations: 3,
    });

    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('captures memory snapshots and calculates memory delta', async () => {
    const result = await runBenchmark(
      () => {
        const buffer = new Array(1000).fill('benchmark-data');
        void buffer;
      },
      {
        name: 'memory-test',
        warmupIterations: 1,
        iterations: 3,
      },
    );

    expect(result.memoryBefore.rss).toBeGreaterThan(0);
    expect(result.memoryAfter.rss).toBeGreaterThan(0);

    expect(result.memoryDelta).toEqual({
      rss: result.memoryAfter.rss - result.memoryBefore.rss,
      heapTotal: result.memoryAfter.heapTotal - result.memoryBefore.heapTotal,
      heapUsed: result.memoryAfter.heapUsed - result.memoryBefore.heapUsed,
      external: result.memoryAfter.external - result.memoryBefore.external,
      arrayBuffers: result.memoryAfter.arrayBuffers - result.memoryBefore.arrayBuffers,
    });
  });
});

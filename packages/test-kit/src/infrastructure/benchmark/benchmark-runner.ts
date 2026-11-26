import { performance } from 'node:perf_hooks';
import { memoryUsage } from 'node:process';
import type {
  BenchmarkCacheState,
  BenchmarkMemoryDelta,
  BenchmarkMemorySnapshot,
  BenchmarkResult,
} from '../../core/benchmark/benchmark-result.js';
import { calculateStatistics } from '../../core/benchmark/statistics.js';

export interface BenchmarkOptions {
  name: string;
  warmupIterations?: number;
  iterations?: number;
  concurrency?: number;
  cacheState?: BenchmarkCacheState;
}

type BenchmarkOperation = () => void | Promise<void>;

const MEMORY_MEASUREMENT = {
  method: 'node:process.memoryUsage',
  scope: 'process-snapshot-before-and-after',
} as const;

function collectMemorySnapshot(): BenchmarkMemorySnapshot {
  const usage = memoryUsage();

  return {
    rss: usage.rss,
    heapTotal: usage.heapTotal,
    heapUsed: usage.heapUsed,
    external: usage.external,
    arrayBuffers: usage.arrayBuffers,
  };
}

function calculateMemoryDelta(
  before: BenchmarkMemorySnapshot,
  after: BenchmarkMemorySnapshot,
): BenchmarkMemoryDelta {
  return {
    rss: after.rss - before.rss,
    heapTotal: after.heapTotal - before.heapTotal,
    heapUsed: after.heapUsed - before.heapUsed,
    external: after.external - before.external,
    arrayBuffers: after.arrayBuffers - before.arrayBuffers,
  };
}

async function executeBatch(operation: BenchmarkOperation, concurrency: number): Promise<void> {
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      await operation();
    }),
  );
}

export async function runBenchmark(
  operation: BenchmarkOperation,
  options: BenchmarkOptions,
): Promise<BenchmarkResult> {
  const warmupIterations = options.warmupIterations ?? 5;
  const iterations = options.iterations ?? 30;
  const concurrency = options.concurrency ?? 1;
  const cacheState = options.cacheState ?? 'not-applicable';

  if (!Number.isSafeInteger(warmupIterations) || warmupIterations < 0) {
    throw new RangeError('warmupIterations must be a non-negative safe integer');
  }

  if (!Number.isSafeInteger(iterations) || iterations < 1) {
    throw new RangeError('iterations must be a positive safe integer');
  }

  if (!Number.isSafeInteger(concurrency) || concurrency < 1) {
    throw new RangeError('concurrency must be a positive safe integer');
  }

  const startedAt = new Date().toISOString();

  for (let index = 0; index < warmupIterations; index++) {
    await executeBatch(operation, concurrency);
  }

  const memoryBefore = collectMemorySnapshot();
  const samples: number[] = [];

  for (let index = 0; index < iterations; index++) {
    const start = performance.now();

    await executeBatch(operation, concurrency);

    samples.push(performance.now() - start);
  }

  const memoryAfter = collectMemorySnapshot();
  const duration = calculateStatistics(samples);

  return {
    name: options.name,
    warmupIterations,
    iterations,
    concurrency,
    cacheState,
    startedAt,
    completedAt: new Date().toISOString(),
    samplesMs: samples,
    duration,
    operationsPerSecond: duration.mean > 0 ? (concurrency * 1000) / duration.mean : null,
    memoryMeasurement: MEMORY_MEASUREMENT,
    memoryBefore,
    memoryAfter,
    memoryDelta: calculateMemoryDelta(memoryBefore, memoryAfter),
  };
}

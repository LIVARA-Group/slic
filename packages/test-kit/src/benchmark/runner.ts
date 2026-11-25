import { performance } from 'node:perf_hooks';
import { memoryUsage } from 'node:process';
import { type BenchmarkStatistics, calculateStatistics } from './statistics.js';

export interface BenchmarkOptions {
  name: string;
  warmupIterations?: number;
  iterations?: number;
}

export interface BenchmarkMemorySnapshot {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
}

export interface BenchmarkMemoryDelta {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers: number;
}

export interface BenchmarkResult {
  name: string;
  warmupIterations: number;
  iterations: number;
  startedAt: string;
  completedAt: string;
  samplesMs: number[];
  duration: BenchmarkStatistics;
  operationsPerSecond: number | null;
  memoryBefore: BenchmarkMemorySnapshot;
  memoryAfter: BenchmarkMemorySnapshot;
  memoryDelta: BenchmarkMemoryDelta;
}

type BenchmarkOperation = () => void | Promise<void>;

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

export async function runBenchmark(
  operation: BenchmarkOperation,
  options: BenchmarkOptions,
): Promise<BenchmarkResult> {
  const warmupIterations = options.warmupIterations ?? 5;
  const iterations = options.iterations ?? 30;

  if (!Number.isInteger(warmupIterations) || warmupIterations < 0) {
    throw new RangeError('warmupIterations must be a non-negative integer');
  }

  if (!Number.isInteger(iterations) || iterations < 1) {
    throw new RangeError('iterations must be a positive integer');
  }

  const startedAt = new Date().toISOString();

  for (let index = 0; index < warmupIterations; index++) {
    await operation();
  }

  const memoryBefore = collectMemorySnapshot();
  const samples: number[] = [];

  for (let index = 0; index < iterations; index++) {
    const start = performance.now();

    await operation();

    samples.push(performance.now() - start);
  }

  const memoryAfter = collectMemorySnapshot();
  const duration = calculateStatistics(samples);

  return {
    name: options.name,
    warmupIterations,
    iterations,
    startedAt,
    completedAt: new Date().toISOString(),
    samplesMs: samples,
    duration,
    operationsPerSecond: duration.mean > 0 ? 1000 / duration.mean : null,
    memoryBefore,
    memoryAfter,
    memoryDelta: calculateMemoryDelta(memoryBefore, memoryAfter),
  };
}

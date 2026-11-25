import { performance } from 'node:perf_hooks';
import { type BenchmarkStatistics, calculateStatistics } from './statistics.js';

export interface BenchmarkOptions {
  name: string;
  warmupIterations?: number;
  iterations?: number;
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
}

type BenchmarkOperation = () => void | Promise<void>;

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

  const samples: number[] = [];

  for (let index = 0; index < iterations; index++) {
    const start = performance.now();

    await operation();

    samples.push(performance.now() - start);
  }

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
  };
}

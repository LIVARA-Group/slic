export type BenchmarkCacheState = 'warm' | 'cold' | 'not-applicable';

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

export interface BenchmarkMemoryMeasurement {
  method: string;
  scope: string;
}

export interface BenchmarkResult {
  name: string;
  warmupIterations: number;
  iterations: number;
  concurrency: number;
  cacheState: BenchmarkCacheState;
  startedAt: string;
  completedAt: string;
  samplesMs: number[];
  duration: import('./statistics.js').BenchmarkStatistics;
  operationsPerSecond: number | null;
  memoryMeasurement: BenchmarkMemoryMeasurement;
  memoryBefore: BenchmarkMemorySnapshot;
  memoryAfter: BenchmarkMemorySnapshot;
  memoryDelta: BenchmarkMemoryDelta;
}

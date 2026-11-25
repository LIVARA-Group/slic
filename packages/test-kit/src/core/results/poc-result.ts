import type {
  BenchmarkMemoryDelta,
  BenchmarkMemoryMeasurement,
  BenchmarkMemorySnapshot,
  BenchmarkResult,
} from '../benchmark/benchmark-result.js';
import { calculateStatistics } from '../benchmark/statistics.js';

export type POCOperationMix = Record<string, number>;

export interface POCFailure {
  run_index: number;
  name: string;
  message: string;
}

export interface POCMemoryRun {
  run_index: number;
  measurement: BenchmarkMemoryMeasurement;
  before: BenchmarkMemorySnapshot;
  after: BenchmarkMemorySnapshot;
  delta: BenchmarkMemoryDelta;
}

export interface POCMemoryMetrics {
  runs: POCMemoryRun[];
}

export interface POCPercentiles {
  p50: number;
  p95: number;
  p99: number;
}

export interface POCResult {
  poc_id: string;
  scenario: string;
  candidate: string;
  dataset_id: string;
  seed: number;
  environment_manifest_id: string;
  runs: BenchmarkResult[];
  percentiles: POCPercentiles;
  memory: POCMemoryMetrics;
  failures: POCFailure[];
  raw_uri: string;
  operation_mix: POCOperationMix;
}

export interface CreatePOCResultOptions {
  poc_id: string;
  scenario: string;
  candidate: string;
  dataset_id: string;
  seed: number;
  environment_manifest_id: string;
  runs: BenchmarkResult[];
  failures?: POCFailure[];
  raw_uri: string;
  operation_mix: POCOperationMix;
}

export function createPOCResult(options: CreatePOCResultOptions): POCResult {
  if (options.runs.length === 0) {
    throw new Error('POC result must contain at least one benchmark run');
  }

  const samples = options.runs.flatMap((run) => run.samplesMs);

  if (samples.length === 0) {
    throw new Error('POC result must contain at least one measurement sample');
  }

  const statistics = calculateStatistics(samples);

  const operationMixEntries = Object.entries(options.operation_mix);

  if (operationMixEntries.length === 0) {
    throw new Error('POC operation mix must contain at least one operation');
  }

  for (const [operation, ratio] of operationMixEntries) {
    if (!operation.trim() || !Number.isFinite(ratio) || ratio <= 0 || ratio > 1) {
      throw new Error(`Invalid POC operation mix entry: ${operation}`);
    }
  }

  const operationMixTotal = operationMixEntries.reduce((total, [, ratio]) => total + ratio, 0);

  if (Math.abs(operationMixTotal - 1) > 1e-9) {
    throw new Error('POC operation mix ratios must sum to 1');
  }

  return {
    poc_id: options.poc_id,
    scenario: options.scenario,
    candidate: options.candidate,
    dataset_id: options.dataset_id,
    seed: options.seed,
    environment_manifest_id: options.environment_manifest_id,
    runs: options.runs,
    percentiles: {
      p50: statistics.median,
      p95: statistics.p95,
      p99: statistics.p99,
    },
    memory: {
      runs: options.runs.map((run, index) => ({
        run_index: index,
        measurement: run.memoryMeasurement,
        before: run.memoryBefore,
        after: run.memoryAfter,
        delta: run.memoryDelta,
      })),
    },
    failures: options.failures ?? [],
    raw_uri: options.raw_uri,
    operation_mix: { ...options.operation_mix },
  };
}

import type { EnvironmentManifest } from '../environment/manifest.js';
import type { BenchmarkResult } from './runner.js';

export interface BenchmarkDatasetMetadata {
  seed: number;
  noteCount: number;
  entityCount: number;
  relationCount: number;
}

export interface BenchmarkReport {
  schemaVersion: 1;
  id: string;
  createdAt: string;
  environment: EnvironmentManifest;
  dataset: BenchmarkDatasetMetadata;
  benchmarks: BenchmarkResult[];
}

export interface CreateBenchmarkReportOptions {
  id: string;
  environment: EnvironmentManifest;
  dataset: BenchmarkDatasetMetadata;
  benchmarks: BenchmarkResult[];
}

export function createBenchmarkReport(options: CreateBenchmarkReportOptions): BenchmarkReport {
  return {
    schemaVersion: 1,
    id: options.id,
    createdAt: new Date().toISOString(),
    environment: options.environment,
    dataset: options.dataset,
    benchmarks: options.benchmarks,
  };
}

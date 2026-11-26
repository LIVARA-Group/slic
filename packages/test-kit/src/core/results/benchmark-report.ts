import type { BenchmarkResult } from '../benchmark/benchmark-result.js';
import type { DatasetManifest } from '../dataset/dataset.js';
import type { EnvironmentManifest } from '../environment/environment-manifest.js';
import type { POCResult } from './poc-result.js';

export interface BenchmarkReport {
  schemaVersion: 1;
  id: string;
  createdAt: string;
  environment: EnvironmentManifest;
  dataset: DatasetManifest;
  benchmarks: BenchmarkResult[];
  pocResults: POCResult[];
}

export interface CreateBenchmarkReportOptions {
  id: string;
  environment: EnvironmentManifest;
  dataset: DatasetManifest;
  benchmarks: BenchmarkResult[];
  pocResults?: POCResult[];
}

export function createBenchmarkReport(options: CreateBenchmarkReportOptions): BenchmarkReport {
  for (const result of options.pocResults ?? []) {
    if (result.dataset_id !== options.dataset.metadata.id) {
      throw new Error(`POC dataset ID does not match report dataset: ${result.dataset_id}`);
    }

    if (result.seed !== options.dataset.metadata.seed) {
      throw new Error(`POC seed does not match report dataset: ${result.seed}`);
    }

    if (result.environment_manifest_id !== options.environment.id) {
      throw new Error(
        `POC environment manifest ID does not match report environment: ${result.environment_manifest_id}`,
      );
    }
  }

  return {
    schemaVersion: 1,
    id: options.id,
    createdAt: new Date().toISOString(),
    environment: options.environment,
    dataset: options.dataset,
    benchmarks: options.benchmarks,
    pocResults: options.pocResults ?? [],
  };
}

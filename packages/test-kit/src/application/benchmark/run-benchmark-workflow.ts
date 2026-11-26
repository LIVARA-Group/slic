import type { BenchmarkResult } from '../../core/benchmark/benchmark-result.js';
import type { EnvironmentManifest } from '../../core/environment/environment-manifest.js';
import type { BenchmarkReport } from '../../core/results/benchmark-report.js';
import { createBenchmarkReport } from '../../core/results/benchmark-report.js';
import {
  type BenchmarkOptions,
  runBenchmark,
} from '../../infrastructure/benchmark/benchmark-runner.js';
import { collectEnvironmentManifest } from '../../infrastructure/environment/manifest-collector.js';
import { writeBenchmarkReport } from '../../infrastructure/reporting/report-writer.js';
import type { PreparedDataset, PreparePersonalDatasetRequest } from '../dataset/prepare-dataset.js';
import { prepareDataset } from '../dataset/prepare-dataset.js';

export type BenchmarkOperation = () => void | Promise<void>;

export interface RunBenchmarkWorkflowRequest {
  reportId: string;
  outputPath: string;
  dataset: PreparePersonalDatasetRequest;
  benchmark: BenchmarkOptions;
  operation: BenchmarkOperation;
}

export interface BenchmarkWorkflowDependencies {
  collectEnvironment: () => EnvironmentManifest;
  prepareDataset: (request: PreparePersonalDatasetRequest) => PreparedDataset;
  runBenchmark: (
    operation: BenchmarkOperation,
    options: BenchmarkOptions,
  ) => Promise<BenchmarkResult>;
  createReport: typeof createBenchmarkReport;
  writeReport: (report: BenchmarkReport, filePath: string) => Promise<void>;
}

const defaultDependencies: BenchmarkWorkflowDependencies = {
  collectEnvironment: collectEnvironmentManifest,
  prepareDataset,
  runBenchmark,
  createReport: createBenchmarkReport,
  writeReport: writeBenchmarkReport,
};

export async function runBenchmarkWorkflow(
  request: RunBenchmarkWorkflowRequest,
  dependencies: BenchmarkWorkflowDependencies = defaultDependencies,
): Promise<BenchmarkReport> {
  const environment = dependencies.collectEnvironment();

  const dataset = dependencies.prepareDataset(request.dataset);

  const benchmark = await dependencies.runBenchmark(request.operation, request.benchmark);

  const report = dependencies.createReport({
    id: request.reportId,
    environment,
    dataset: dataset.manifest,
    benchmarks: [benchmark],
  });

  await dependencies.writeReport(report, request.outputPath);

  return report;
}

import type { BenchmarkResult } from '../../core/benchmark/benchmark-result.js';
import type { GeneratedDataset } from '../../core/dataset/dataset.js';
import type { EnvironmentManifest } from '../../core/environment/environment-manifest.js';
import type { BenchmarkReport } from '../../core/results/benchmark-report.js';
import { createBenchmarkReport } from '../../core/results/benchmark-report.js';
import type { POCOperationMix, POCResult } from '../../core/results/poc-result.js';
import { createPOCResult } from '../../core/results/poc-result.js';
import type { BenchmarkOptions } from '../../infrastructure/benchmark/benchmark-runner.js';
import { runBenchmark as runBenchmarkDefault } from '../../infrastructure/benchmark/benchmark-runner.js';
import { collectEnvironmentManifest } from '../../infrastructure/environment/manifest-collector.js';
import {
  type POCRawResults,
  writePOCRawResults,
} from '../../infrastructure/reporting/poc-raw-writer.js';
import { writeBenchmarkReport } from '../../infrastructure/reporting/report-writer.js';

export type PocOperation = () => void | Promise<void>;

export interface PocBenchmarkRun {
  benchmark: BenchmarkOptions;
  operation: PocOperation;
}

export interface RunPocWorkflowRequest {
  reportId: string;
  pocId: string;
  scenario: string;
  candidate: string;
  dataset: GeneratedDataset<unknown>;
  operationMix: POCOperationMix;
  runs: PocBenchmarkRun[];
  rawOutputPath: string;
  reportOutputPath: string;
}

export interface PocWorkflowDependencies {
  collectEnvironment: () => EnvironmentManifest;
  runBenchmark: (operation: PocOperation, options: BenchmarkOptions) => Promise<BenchmarkResult>;
  createPocResult: typeof createPOCResult;
  writeRawResults: (results: POCRawResults, filePath: string) => Promise<void>;
  createReport: typeof createBenchmarkReport;
  writeReport: typeof writeBenchmarkReport;
}

const defaultDependencies: PocWorkflowDependencies = {
  collectEnvironment: collectEnvironmentManifest,
  runBenchmark: runBenchmarkDefault,
  createPocResult: createPOCResult,
  writeRawResults: writePOCRawResults,
  createReport: createBenchmarkReport,
  writeReport: writeBenchmarkReport,
};

export async function runPocWorkflow(
  request: RunPocWorkflowRequest,
  dependencies: PocWorkflowDependencies = defaultDependencies,
): Promise<BenchmarkReport> {
  if (request.runs.length === 0) {
    throw new Error('POC workflow must contain at least one benchmark run');
  }

  const environment = dependencies.collectEnvironment();
  const dataset = request.dataset.manifest;

  const benchmarkResults: BenchmarkResult[] = [];

  for (const run of request.runs) {
    benchmarkResults.push(await dependencies.runBenchmark(run.operation, run.benchmark));
  }

  const rawResults: POCRawResults = {
    schemaVersion: 1,
    poc_id: request.pocId,
    scenario: request.scenario,
    candidate: request.candidate,
    dataset,
    environment,
    seed: dataset.metadata.seed,
    operation_mix: request.operationMix,
    runs: benchmarkResults,
  };

  await dependencies.writeRawResults(rawResults, request.rawOutputPath);

  const pocResult: POCResult = dependencies.createPocResult({
    poc_id: request.pocId,
    scenario: request.scenario,
    candidate: request.candidate,
    dataset_id: dataset.metadata.id,
    seed: dataset.metadata.seed,
    environment_manifest_id: environment.id,
    runs: benchmarkResults,
    raw_uri: request.rawOutputPath,
    operation_mix: request.operationMix,
  });

  const report = dependencies.createReport({
    id: request.reportId,
    environment,
    dataset,
    benchmarks: benchmarkResults,
    pocResults: [pocResult],
  });

  await dependencies.writeReport(report, request.reportOutputPath);

  return report;
}

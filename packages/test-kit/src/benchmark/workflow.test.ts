import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { prepareDataset } from '../application/dataset/prepare-dataset.js';
import {
  acknowledgeTransactionWorkflow,
  restoreAckLedgerWorkflow,
  verifyRecoveredTransactionsWorkflow,
} from '../application/ledger/ack-ledger-workflow.js';
import { calculateTransactionChecksum } from '../core/ledger/ack-ledger.js';
import { createBenchmarkReport } from '../core/results/benchmark-report.js';
import { runBenchmark } from '../infrastructure/benchmark/benchmark-runner.js';
import { collectEnvironmentManifest } from '../infrastructure/environment/manifest-collector.js';
import { writeBenchmarkReport } from '../infrastructure/reporting/report-writer.js';

let temporaryDirectory: string | undefined;

afterEach(async () => {
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    temporaryDirectory = undefined;
  }
});

describe('benchmark workflow', () => {
  it('validates dataset determinism, benchmark execution, independent engine recovery, ACK ledger integrity and report persistence', async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'slic-workflow-'));

    const datasetRequest = {
      family: 'DS-P' as const,
      seed: 42,
      options: {
        id: 'DS-P-S',
        noteCount: 1_000,
        entityCount: 500,
        relationCount: 1_500,
      },
    };

    const dataset = prepareDataset(datasetRequest);
    const repeatedDataset = prepareDataset(datasetRequest);

    expect(repeatedDataset.manifest.metadata.checksum).toBe(dataset.manifest.metadata.checksum);

    const benchmark = await runBenchmark(
      () => {
        const noteCount = dataset.data.notes.length;
        const entityCount = dataset.data.entities.length;

        if (noteCount !== 1_000 || entityCount !== 500) {
          throw new Error('Trivial engine dataset validation failed');
        }
      },
      {
        name: 'trivial-engine',
        warmupIterations: 2,
        iterations: 5,
      },
    );

    const recordIds = dataset.data.notes.slice(0, 2).map((note) => note.id);

    expect(recordIds).toHaveLength(2);

    const engineDataPath = join(temporaryDirectory, 'engine', 'transactions.json');

    await mkdir(join(temporaryDirectory, 'engine'), {
      recursive: true,
    });

    await writeFile(
      engineDataPath,
      JSON.stringify({
        transactions: [
          {
            transactionId: 'tx-001',
            recordIds,
          },
        ],
      }),
      'utf8',
    );

    const ledgerPath = join(temporaryDirectory, 'ledger', 'ack.jsonl');

    await acknowledgeTransactionWorkflow(ledgerPath, {
      transactionId: 'tx-001',
      recordIds,
    });

    const restoredLedger = await restoreAckLedgerWorkflow(ledgerPath);

    expect(restoredLedger.ledger.transactions).toHaveLength(1);
    expect(restoredLedger.truncatedTail).toBe(false);

    const engineState: unknown = JSON.parse(await readFile(engineDataPath, 'utf8'));

    if (
      typeof engineState !== 'object' ||
      engineState === null ||
      !('transactions' in engineState) ||
      !Array.isArray(engineState.transactions)
    ) {
      throw new Error('Invalid recovered engine state');
    }

    const recoveredTransactions = engineState.transactions.map((transaction: unknown) => {
      if (
        typeof transaction !== 'object' ||
        transaction === null ||
        !('transactionId' in transaction) ||
        typeof transaction.transactionId !== 'string' ||
        !('recordIds' in transaction) ||
        !Array.isArray(transaction.recordIds) ||
        !transaction.recordIds.every((recordId: unknown) => typeof recordId === 'string')
      ) {
        throw new Error('Invalid recovered engine transaction');
      }

      return {
        transactionId: transaction.transactionId,
        recordIds: transaction.recordIds,
        checksum: calculateTransactionChecksum(transaction.recordIds),
      };
    });

    const integrity = await verifyRecoveredTransactionsWorkflow(ledgerPath, recoveredTransactions);

    expect(integrity.passed).toBe(true);
    expect(integrity.issues).toHaveLength(0);
    expect(integrity.acknowledgedCount).toBe(1);
    expect(integrity.recoveredCount).toBe(1);

    const report = createBenchmarkReport({
      id: 'wp-010-self-validation',
      environment: collectEnvironmentManifest(),
      dataset: dataset.manifest,
      benchmarks: [benchmark],
    });

    const reportPath = join(temporaryDirectory, 'results', 'report.json');

    await writeBenchmarkReport(report, reportPath);

    const content = await readFile(reportPath, 'utf8');
    const restoredReport = JSON.parse(content);

    expect(benchmark.duration.samples).toBe(5);
    expect(restoredReport.id).toBe('wp-010-self-validation');
    expect(restoredReport.benchmarks).toHaveLength(1);
    expect(restoredReport.dataset).toEqual(dataset.manifest);
    expect(restoredReport.environment).toEqual(report.environment);
    expect(restoredReport.benchmarks[0].memoryBefore).toEqual(benchmark.memoryBefore);
    expect(restoredReport.benchmarks[0].memoryAfter).toEqual(benchmark.memoryAfter);
    expect(restoredReport.benchmarks[0].memoryDelta).toEqual(benchmark.memoryDelta);
  });
});

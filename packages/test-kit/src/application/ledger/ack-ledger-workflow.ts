import type { AcknowledgedTransaction } from '../../core/ledger/ack-ledger.js';
import {
  type AckLedger,
  type AckLedgerCheckResult,
  checkAckLedger,
  type RecoveredTransaction,
} from '../../core/ledger/ack-ledger.js';
import {
  type AckLedgerRestoreResult,
  appendAckLedgerEntry,
  restoreAckLedger,
} from '../../infrastructure/filesystem/ack-ledger-store.js';

export type AcknowledgeTransactionRequest = Omit<
  AcknowledgedTransaction,
  'acknowledgedAt' | 'checksum'
>;

export interface AckLedgerWorkflowDependencies {
  restore: typeof restoreAckLedger;
  append: typeof appendAckLedgerEntry;
  check: typeof checkAckLedger;
}

const defaultDependencies: AckLedgerWorkflowDependencies = {
  restore: restoreAckLedger,
  append: appendAckLedgerEntry,
  check: checkAckLedger,
};

export async function restoreAckLedgerWorkflow(
  filePath: string,
  dependencies: AckLedgerWorkflowDependencies = defaultDependencies,
): Promise<AckLedgerRestoreResult> {
  return dependencies.restore(filePath);
}

export async function acknowledgeTransactionWorkflow(
  filePath: string,
  transaction: AcknowledgeTransactionRequest,
  dependencies: AckLedgerWorkflowDependencies = defaultDependencies,
): Promise<AckLedger> {
  const restored = await dependencies.restore(filePath);

  return dependencies.append(filePath, restored.ledger, transaction);
}

export async function verifyRecoveredTransactionsWorkflow(
  filePath: string,
  recovered: RecoveredTransaction[],
  dependencies: AckLedgerWorkflowDependencies = defaultDependencies,
): Promise<AckLedgerCheckResult> {
  const restored = await dependencies.restore(filePath);

  return dependencies.check(restored.ledger, recovered);
}

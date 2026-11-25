
import { createHash } from 'node:crypto';

export interface AcknowledgedTransaction {
  transactionId: string;
  acknowledgedAt: string;
  recordIds: string[];
  checksum: string;
}

export interface RecoveredTransaction {
  transactionId: string;
  recordIds: string[];
  checksum: string;
}

export interface AckLedger {
  schemaVersion: 1;
  transactions: AcknowledgedTransaction[];
}

export interface AckLedgerIssue {
  transactionId: string;
  type: 'missing' | 'incomplete' | 'checksum-mismatch' | 'duplicate';
  expectedRecordIds?: string[];
  actualRecordIds?: string[];
}

export interface AckLedgerCheckResult {
  passed: boolean;
  acknowledgedCount: number;
  recoveredCount: number;
  unacknowledgedTransactions: string[];
  issues: AckLedgerIssue[];
}

export function calculateTransactionChecksum(recordIds: string[]): string {
  const normalizedRecordIds = [...recordIds].sort();

  return createHash('sha256')
    .update(JSON.stringify(normalizedRecordIds))
    .digest('hex');
}

export function createAckLedger(): AckLedger {
  return {
    schemaVersion: 1,
    transactions: [],
  };
}

export function acknowledgeTransaction(
  ledger: AckLedger,
  transaction: Omit<AcknowledgedTransaction, 'acknowledgedAt' | 'checksum'>,
): AckLedger {
  if (ledger.transactions.some((entry) => entry.transactionId === transaction.transactionId)) {
    throw new Error(`Transaction already acknowledged: ${transaction.transactionId}`);
  }

  if (transaction.recordIds.length === 0) {
    throw new Error('Acknowledged transaction must contain at least one record');
  }

  const recordIds = [...transaction.recordIds];

  if (new Set(recordIds).size !== recordIds.length) {
    throw new Error('Transaction contains duplicate record IDs');
  }

  return {
    ...ledger,
    transactions: [
      ...ledger.transactions,
      {
        ...transaction,
        recordIds,
        acknowledgedAt: new Date().toISOString(),
        checksum: calculateTransactionChecksum(recordIds),
      },
    ],
  };
}

export function checkAckLedger(
  ledger: AckLedger,
  recovered: RecoveredTransaction[],
): AckLedgerCheckResult {
  const issues: AckLedgerIssue[] = [];
  const acknowledgedIds = new Set<string>();
  const recoveredById = new Map<string, RecoveredTransaction>();

  for (const transaction of ledger.transactions) {
    if (acknowledgedIds.has(transaction.transactionId)) {
      issues.push({
        transactionId: transaction.transactionId,
        type: 'duplicate',
      });
      continue;
    }

    acknowledgedIds.add(transaction.transactionId);
  }

  for (const transaction of recovered) {
    if (recoveredById.has(transaction.transactionId)) {
      issues.push({
        transactionId: transaction.transactionId,
        type: 'duplicate',
      });
      continue;
    }

    recoveredById.set(transaction.transactionId, transaction);
  }

  for (const expected of ledger.transactions) {
    const actual = recoveredById.get(expected.transactionId);

    if (!actual) {
      issues.push({
        transactionId: expected.transactionId,
        type: 'missing',
        expectedRecordIds: expected.recordIds,
      });
      continue;
    }

    const expectedIds = [...expected.recordIds].sort();
    const actualIds = [...actual.recordIds].sort();

    if (
      expectedIds.length !== actualIds.length ||
      expectedIds.some((id, index) => id !== actualIds[index])
    ) {
      issues.push({
        transactionId: expected.transactionId,
        type: 'incomplete',
        expectedRecordIds: expectedIds,
        actualRecordIds: actualIds,
      });
      continue;
    }

    const expectedChecksum = calculateTransactionChecksum(expected.recordIds);

    if (expected.checksum !== expectedChecksum || actual.checksum !== expectedChecksum) {
      issues.push({
        transactionId: expected.transactionId,
        type: 'checksum-mismatch',
      });
    }
  }

  const unacknowledgedTransactions = [...recoveredById.keys()].filter(
    (transactionId) => !acknowledgedIds.has(transactionId),
  );

  return {
    passed: issues.length === 0,
    acknowledgedCount: ledger.transactions.length,
    recoveredCount: recovered.length,
    unacknowledgedTransactions,
    issues,
  };
}

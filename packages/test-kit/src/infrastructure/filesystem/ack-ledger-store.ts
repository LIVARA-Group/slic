import { mkdir, open, readFile, truncate } from 'node:fs/promises';
import { dirname } from 'node:path';
import {
  type AckLedger,
  type AcknowledgedTransaction,
  acknowledgeTransaction,
  calculateTransactionChecksum,
  createAckLedger,
} from '../../core/ledger/ack-ledger.js';

export interface AckLedgerRestoreResult {
  ledger: AckLedger;
  truncatedTail: boolean;
}

function isAcknowledgedTransaction(
  value: unknown,
): value is AcknowledgedTransaction {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const transactionId: unknown = Reflect.get(value, 'transactionId');
  const acknowledgedAt: unknown = Reflect.get(value, 'acknowledgedAt');
  const recordIds: unknown = Reflect.get(value, 'recordIds');
  const checksum: unknown = Reflect.get(value, 'checksum');

  return (
    typeof transactionId === 'string' &&
    transactionId.length > 0 &&
    typeof acknowledgedAt === 'string' &&
    !Number.isNaN(Date.parse(acknowledgedAt)) &&
    Array.isArray(recordIds) &&
    recordIds.length > 0 &&
    recordIds.every(
      (recordId: unknown) =>
        typeof recordId === 'string' && recordId.length > 0,
    ) &&
    new Set(recordIds).size === recordIds.length &&
    typeof checksum === 'string' &&
    /^[a-f0-9]{64}$/.test(checksum)
  );
}

export async function appendAckLedgerEntry(
  filePath: string,
  ledger: AckLedger,
  transaction: Omit<AcknowledgedTransaction, 'acknowledgedAt' | 'checksum'>,
): Promise<AckLedger> {
  const nextLedger = acknowledgeTransaction(ledger, transaction);
  const entry = nextLedger.transactions[nextLedger.transactions.length - 1];

  if (!entry) {
    throw new Error('Failed to create ACK ledger entry');
  }

  if (entry.checksum !== calculateTransactionChecksum(entry.recordIds)) {
    throw new Error('Invalid ACK ledger checksum');
  }

  await mkdir(dirname(filePath), { recursive: true });

  const restored = await restoreAckLedger(filePath);

  if (restored.truncatedTail) {
    const content = await readFile(filePath, 'utf8');
    const lastNewline = content.lastIndexOf('\n');

    await truncate(filePath, lastNewline + 1);
  }

  if (
    restored.ledger.transactions.length !== ledger.transactions.length ||
    restored.ledger.transactions.some(
      (restoredEntry, index) =>
        restoredEntry.transactionId !== ledger.transactions[index]?.transactionId ||
        restoredEntry.checksum !== ledger.transactions[index]?.checksum,
    )
  ) {
    throw new Error('ACK ledger state does not match persisted state');
  }

  const handle = await open(filePath, 'a');

  try {
    await handle.writeFile(`${JSON.stringify(entry)}\n`, 'utf8');
    await handle.sync();
  } finally {
    await handle.close();
  }

  return nextLedger;
}

export async function restoreAckLedger(filePath: string): Promise<AckLedgerRestoreResult> {
  let content: string;

  try {
    content = await readFile(filePath, 'utf8');
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
      return {
        ledger: createAckLedger(),
        truncatedTail: false,
      };
    }

    throw error;
  }

  const hasCompleteFinalLine = content.endsWith('\n');
  const lines = content.split('\n');

  if (hasCompleteFinalLine) {
    lines.pop();
  } else if (lines.length > 0) {
    lines.pop();
  }

  const ledger = createAckLedger();

  for (const [index, line] of lines.entries()) {
    if (!line.trim()) {
      throw new Error(`Empty ACK ledger entry at line ${index + 1}`);
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(line);
    } catch {
      throw new Error(`Invalid JSON in ACK ledger at line ${index + 1}`);
    }

    if (!isAcknowledgedTransaction(parsed)) {
      throw new Error(`Invalid ACK ledger entry at line ${index + 1}`);
    }

    if (parsed.checksum !== calculateTransactionChecksum(parsed.recordIds)) {
      throw new Error(`Checksum mismatch in ACK ledger at line ${index + 1}`);
    }

    if (ledger.transactions.some((entry) => entry.transactionId === parsed.transactionId)) {
      throw new Error(`Duplicate transaction in ACK ledger: ${parsed.transactionId}`);
    }

    ledger.transactions.push(parsed);
  }

  return {
    ledger,
    truncatedTail: !hasCompleteFinalLine && content.length > 0,
  };
}

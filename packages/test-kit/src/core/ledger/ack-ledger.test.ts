
import { describe, expect, it } from 'vitest';
import {
  acknowledgeTransaction,
  calculateTransactionChecksum,
  checkAckLedger,
  createAckLedger,
} from './ack-ledger.js';

describe('ack ledger', () => {
  it('creates an empty ledger', () => {
    expect(createAckLedger()).toEqual({
      schemaVersion: 1,
      transactions: [],
    });
  });

  it('records an acknowledged transaction with a checksum', () => {
    const ledger = acknowledgeTransaction(createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1', 'revision-1'],
    });

    expect(ledger.transactions).toHaveLength(1);
    expect(ledger.transactions[0]).toMatchObject({
      transactionId: 'tx-1',
      recordIds: ['note-1', 'revision-1'],
      checksum: calculateTransactionChecksum(['note-1', 'revision-1']),
    });
    expect(ledger.transactions[0]?.acknowledgedAt).toBeTruthy();
  });

  it('rejects duplicate transaction IDs', () => {
    const ledger = acknowledgeTransaction(createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1'],
    });

    expect(() =>
      acknowledgeTransaction(ledger, {
        transactionId: 'tx-1',
        recordIds: ['note-2'],
      }),
    ).toThrow('Transaction already acknowledged');
  });

  it('rejects empty transactions', () => {
    expect(() =>
      acknowledgeTransaction(createAckLedger(), {
        transactionId: 'tx-1',
        recordIds: [],
      }),
    ).toThrow('at least one record');
  });

  it('rejects duplicate record IDs', () => {
    expect(() =>
      acknowledgeTransaction(createAckLedger(), {
        transactionId: 'tx-1',
        recordIds: ['note-1', 'note-1'],
      }),
    ).toThrow('duplicate record IDs');
  });

  it('passes when every acknowledged transaction is recovered intact', () => {
    const ledger = acknowledgeTransaction(createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1', 'revision-1'],
    });

    const result = checkAckLedger(ledger, [
      {
        transactionId: 'tx-1',
        recordIds: ['revision-1', 'note-1'],
        checksum: calculateTransactionChecksum(['note-1', 'revision-1']),
      },
    ]);

    expect(result.passed).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('detects a lost acknowledged transaction', () => {
    const ledger = acknowledgeTransaction(createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1'],
    });

    const result = checkAckLedger(ledger, []);

    expect(result.passed).toBe(false);
    expect(result.issues).toContainEqual({
      transactionId: 'tx-1',
      type: 'missing',
      expectedRecordIds: ['note-1'],
    });
  });

  it('detects a partially recovered transaction', () => {
    const ledger = acknowledgeTransaction(createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1', 'revision-1'],
    });

    const result = checkAckLedger(ledger, [
      {
        transactionId: 'tx-1',
        recordIds: ['note-1'],
        checksum: calculateTransactionChecksum(['note-1']),
      },
    ]);

    expect(result.passed).toBe(false);
    expect(result.issues[0]?.type).toBe('incomplete');
  });

  it('detects a checksum mismatch', () => {
    const ledger = acknowledgeTransaction(createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1'],
    });

    const result = checkAckLedger(ledger, [
      {
        transactionId: 'tx-1',
        recordIds: ['note-1'],
        checksum: 'invalid-checksum',
      },
    ]);

    expect(result.passed).toBe(false);
    expect(result.issues[0]?.type).toBe('checksum-mismatch');
  });

  it('detects duplicate recovered transactions', () => {
    const ledger = acknowledgeTransaction(createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1'],
    });

    const recovered = {
      transactionId: 'tx-1',
      recordIds: ['note-1'],
      checksum: calculateTransactionChecksum(['note-1']),
    };

    const result = checkAckLedger(ledger, [recovered, recovered]);

    expect(result.passed).toBe(false);
    expect(result.issues).toContainEqual({
      transactionId: 'tx-1',
      type: 'duplicate',
    });
  });

  it('reports recovered transactions that were never acknowledged', () => {
    const result = checkAckLedger(createAckLedger(), [
      {
        transactionId: 'tx-1',
        recordIds: ['note-1'],
        checksum: calculateTransactionChecksum(['note-1']),
      },
    ]);

    expect(result.passed).toBe(true);
    expect(result.unacknowledgedTransactions).toEqual(['tx-1']);
  });
});

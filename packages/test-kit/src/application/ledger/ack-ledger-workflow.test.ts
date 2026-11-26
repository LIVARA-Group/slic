import { describe, expect, it, vi } from 'vitest';
import {
  type AckLedger,
  type AckLedgerCheckResult,
  acknowledgeTransaction,
  createAckLedger,
  type RecoveredTransaction,
} from '../../core/ledger/ack-ledger.js';
import type { AckLedgerRestoreResult } from '../../infrastructure/filesystem/ack-ledger-store.js';
import {
  type AckLedgerWorkflowDependencies,
  acknowledgeTransactionWorkflow,
  restoreAckLedgerWorkflow,
  verifyRecoveredTransactionsWorkflow,
} from './ack-ledger-workflow.js';

function createRestoreResult(ledger: AckLedger = createAckLedger()): AckLedgerRestoreResult {
  return {
    ledger,
    truncatedTail: false,
  };
}

describe('ACK ledger application workflow', () => {
  it('restores the ledger through infrastructure', async () => {
    const restore = vi.fn<AckLedgerWorkflowDependencies['restore']>();
    const expected = createRestoreResult();

    restore.mockResolvedValue(expected);

    const result = await restoreAckLedgerWorkflow('ledger.jsonl', {
      restore,
      append: vi.fn<AckLedgerWorkflowDependencies['append']>(),
      check: vi.fn<AckLedgerWorkflowDependencies['check']>(),
    });

    expect(result).toBe(expected);
    expect(restore).toHaveBeenCalledWith('ledger.jsonl');
  });

  it('restores before acknowledging and persisting a transaction', async () => {
    const events: string[] = [];
    const ledger = createAckLedger();
    const nextLedger = acknowledgeTransaction(ledger, {
      transactionId: 'tx-1',
      recordIds: ['note-1'],
    });

    const restore = vi.fn<AckLedgerWorkflowDependencies['restore']>(async () => {
      events.push('restore');
      return createRestoreResult(ledger);
    });

    const append = vi.fn<AckLedgerWorkflowDependencies['append']>(
      async (_filePath, currentLedger) => {
        events.push('append');
        expect(currentLedger).toBe(ledger);
        return nextLedger;
      },
    );

    const result = await acknowledgeTransactionWorkflow(
      'ledger.jsonl',
      {
        transactionId: 'tx-1',
        recordIds: ['note-1'],
      },
      {
        restore,
        append,
        check: vi.fn<AckLedgerWorkflowDependencies['check']>(),
      },
    );

    expect(result).toBe(nextLedger);
    expect(events).toEqual(['restore', 'append']);
    expect(restore).toHaveBeenCalledOnce();
    expect(append).toHaveBeenCalledOnce();
  });

  it('does not append when restoring the ledger fails', async () => {
    const error = new Error('Restore failed');
    const append = vi.fn<AckLedgerWorkflowDependencies['append']>();

    await expect(
      acknowledgeTransactionWorkflow(
        'ledger.jsonl',
        {
          transactionId: 'tx-1',
          recordIds: ['note-1'],
        },
        {
          restore: vi.fn<AckLedgerWorkflowDependencies['restore']>().mockRejectedValue(error),
          append,
          check: vi.fn<AckLedgerWorkflowDependencies['check']>(),
        },
      ),
    ).rejects.toBe(error);

    expect(append).not.toHaveBeenCalled();
  });

  it('checks recovered transactions against the restored ledger', async () => {
    const ledger = createAckLedger();
    const recovered: RecoveredTransaction[] = [];
    const expected: AckLedgerCheckResult = {
      passed: true,
      acknowledgedCount: 0,
      recoveredCount: 0,
      unacknowledgedTransactions: [],
      issues: [],
    };

    const restore = vi
      .fn<AckLedgerWorkflowDependencies['restore']>()
      .mockResolvedValue(createRestoreResult(ledger));

    const check = vi.fn<AckLedgerWorkflowDependencies['check']>().mockReturnValue(expected);

    const result = await verifyRecoveredTransactionsWorkflow('ledger.jsonl', recovered, {
      restore,
      append: vi.fn<AckLedgerWorkflowDependencies['append']>(),
      check,
    });

    expect(result).toBe(expected);
    expect(check).toHaveBeenCalledWith(ledger, recovered);
  });

  it('propagates recovery verification errors', async () => {
    const error = new Error('Verification failed');

    await expect(
      verifyRecoveredTransactionsWorkflow('ledger.jsonl', [], {
        restore: vi
          .fn<AckLedgerWorkflowDependencies['restore']>()
          .mockResolvedValue(createRestoreResult()),
        append: vi.fn<AckLedgerWorkflowDependencies['append']>(),
        check: vi.fn<AckLedgerWorkflowDependencies['check']>().mockImplementation(() => {
          throw error;
        }),
      }),
    ).rejects.toBe(error);
  });
});

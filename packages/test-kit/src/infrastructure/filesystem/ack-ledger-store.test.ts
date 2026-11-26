import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { calculateTransactionChecksum, createAckLedger } from '../../core/ledger/ack-ledger.js';
import { appendAckLedgerEntry, restoreAckLedger } from './ack-ledger-store.js';

let temporaryDirectory: string | undefined;

afterEach(async () => {
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
    temporaryDirectory = undefined;
  }
});

async function createTemporaryFilePath(): Promise<string> {
  temporaryDirectory = await mkdtemp(join(tmpdir(), 'slic-ack-ledger-'));

  const directory = join(temporaryDirectory, 'nested');
  await mkdir(directory, { recursive: true });

  return join(directory, 'ack-ledger.jsonl');
}

describe('ACK ledger store', () => {
  it('restores an empty ledger when the file does not exist', async () => {
    const filePath = await createTemporaryFilePath();

    const result = await restoreAckLedger(filePath);

    expect(result.ledger).toEqual(createAckLedger());
    expect(result.truncatedTail).toBe(false);
  });

  it('persists and restores acknowledged transactions', async () => {
    const filePath = await createTemporaryFilePath();

    let ledger = createAckLedger();

    ledger = await appendAckLedgerEntry(filePath, ledger, {
      transactionId: 'tx-1',
      recordIds: ['note-1', 'note-2'],
    });

    ledger = await appendAckLedgerEntry(filePath, ledger, {
      transactionId: 'tx-2',
      recordIds: ['note-3'],
    });

    const restored = await restoreAckLedger(filePath);

    expect(restored.ledger).toEqual(ledger);
    expect(restored.truncatedTail).toBe(false);
  });

  it('creates nested directories automatically', async () => {
    const filePath = await createTemporaryFilePath();

    await appendAckLedgerEntry(filePath, createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1'],
    });

    const content = await readFile(filePath, 'utf8');

    expect(content.split('\n')).toHaveLength(2);
  });

  it('ignores an incomplete final line', async () => {
    const filePath = await createTemporaryFilePath();

    const ledger = await appendAckLedgerEntry(filePath, createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1'],
    });

    await writeFile(filePath, '{"transactionId":"incomplete"', {
      encoding: 'utf8',
      flag: 'a',
    });

    const restored = await restoreAckLedger(filePath);

    expect(restored.ledger).toEqual(ledger);
    expect(restored.truncatedTail).toBe(true);
  });

  it('rejects corrupted complete lines', async () => {
    const filePath = await createTemporaryFilePath();

    await writeFile(filePath, '{invalid-json}\n', 'utf8');

    await expect(restoreAckLedger(filePath)).rejects.toThrow(
      'Invalid JSON in ACK ledger at line 1',
    );
  });

  it('rejects checksum mismatches', async () => {
    const filePath = await createTemporaryFilePath();

    await writeFile(
      filePath,
      `${JSON.stringify({
        transactionId: 'tx-1',
        acknowledgedAt: new Date().toISOString(),
        recordIds: ['note-1'],
        checksum: 'a'.repeat(64),
      })}\n`,
      'utf8',
    );

    await expect(restoreAckLedger(filePath)).rejects.toThrow(
      'Checksum mismatch in ACK ledger at line 1',
    );
  });

  it('rejects duplicate transaction IDs', async () => {
    const filePath = await createTemporaryFilePath();

    const entry = {
      transactionId: 'tx-1',
      acknowledgedAt: new Date().toISOString(),
      recordIds: ['note-1'],
      checksum: calculateTransactionChecksum(['note-1']),
    };

    await writeFile(filePath, `${JSON.stringify(entry)}\n${JSON.stringify(entry)}\n`, 'utf8');

    await expect(restoreAckLedger(filePath)).rejects.toThrow(
      'Duplicate transaction in ACK ledger: tx-1',
    );
  });

  it('does not modify the original ledger when append fails', async () => {
    const filePath = await createTemporaryFilePath();

    const ledger = createAckLedger();

    await expect(
      appendAckLedgerEntry(filePath, ledger, {
        transactionId: 'tx-1',
        recordIds: [],
      }),
    ).rejects.toThrow('Acknowledged transaction must contain at least one record');

    expect(ledger).toEqual(createAckLedger());
  });

  it('truncates an incomplete tail before appending a new transaction', async () => {
    const filePath = await createTemporaryFilePath();

    const firstLedger = await appendAckLedgerEntry(filePath, createAckLedger(), {
      transactionId: 'tx-1',
      recordIds: ['note-1'],
    });

    await writeFile(filePath, '{"transactionId":"incomplete"', {
      encoding: 'utf8',
      flag: 'a',
    });

    const secondLedger = await appendAckLedgerEntry(filePath, firstLedger, {
      transactionId: 'tx-2',
      recordIds: ['note-2'],
    });

    const restored = await restoreAckLedger(filePath);

    expect(restored.ledger).toEqual(secondLedger);
    expect(restored.truncatedTail).toBe(false);
    expect(restored.ledger.transactions).toHaveLength(2);
  });
});

import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectEnvironmentManifest } from '../environment/manifest-collector.js';
import { writePOCRawResults } from './poc-raw-writer.js';

describe('writePOCRawResults', () => {
  let directory: string | undefined;

  afterEach(async () => {
    if (directory) {
      await rm(directory, { recursive: true, force: true });
      directory = undefined;
    }
  });

  it('writes raw POC results as JSON and creates parent directories', async () => {
    directory = await mkdtemp(join(tmpdir(), 'slic-poc-raw-'));

    const filePath = join(directory, 'nested', 'poc01', 'raw.json');
    const environment = collectEnvironmentManifest();

    const results = {
      schemaVersion: 1 as const,
      poc_id: 'POC-01',
      scenario: 'baseline',
      candidate: 'test-engine',
      dataset: {
        metadata: {
          id: 'DS-P-test',
          family: 'DS-P' as const,
          seed: 42,
          generatorVersion: '1.0.0',
          checksum: 'a'.repeat(64),
        },
        recordCounts: {},
        distribution: {},
      },
      environment,
      seed: 42,
      operation_mix: {
        read: 1,
      },
      runs: [],
    };

    await writePOCRawResults(results, filePath);

    const content = JSON.parse(await readFile(filePath, 'utf8'));

    expect(content).toEqual(results);
  });

  it('does not overwrite an existing raw results file', async () => {
    directory = await mkdtemp(join(tmpdir(), 'slic-poc-raw-'));

    const filePath = join(directory, 'raw.json');

    await writePOCRawResults(
      {
        schemaVersion: 1,
        poc_id: 'POC-01',
        scenario: 'baseline',
        candidate: 'test-engine',
        dataset: {
          metadata: {
            id: 'DS-P-test',
            family: 'DS-P',
            seed: 42,
            generatorVersion: '1.0.0',
            checksum: 'a'.repeat(64),
          },
          recordCounts: {},
          distribution: {},
        },
        environment: collectEnvironmentManifest(),
        seed: 42,
        operation_mix: { read: 1 },
        runs: [],
      },
      filePath,
    );

    await expect(
      writePOCRawResults(
        {
          schemaVersion: 1,
          poc_id: 'POC-02',
          scenario: 'other',
          candidate: 'other',
          dataset: {
            metadata: {
              id: 'DS-P-test',
              family: 'DS-P',
              seed: 42,
              generatorVersion: '1.0.0',
              checksum: 'a'.repeat(64),
            },
            recordCounts: {},
            distribution: {},
          },
          environment: collectEnvironmentManifest(),
          seed: 42,
          operation_mix: { read: 1 },
          runs: [],
        },
        filePath,
      ),
    ).rejects.toThrow(/already exists|EEXIST/i);
  });
});

import { createHash } from 'node:crypto';

export type DatasetFamily = 'DS-P' | 'DS-G' | 'DS-T' | 'DS-A' | 'DS-C' | 'DS-I';

export interface DatasetMetadata {
  id: string;
  family: DatasetFamily;
  seed: number;
  generatorVersion: string;
  checksum: string;
}

export interface DatasetRecordCounts {
  notes?: number;
  entities?: number;
  relations?: number;
  textDocuments?: number;
  attachments?: number;
  cryptographicRecords?: number;
  hostileFiles?: number;
}

export interface DatasetManifest {
  metadata: DatasetMetadata;
  recordCounts: DatasetRecordCounts;
  distribution: Record<string, number>;
}

export interface GeneratedDataset<T> {
  data: T;
  manifest: DatasetManifest;
}

export interface DatasetChecksumInput {
  family: DatasetFamily;
  seed: number;
  generatorVersion: string;
  data: unknown;
}

export interface CreateDatasetManifestOptions extends DatasetChecksumInput {
  recordCounts: DatasetRecordCounts;
  distribution?: Record<string, number>;
}

export function calculateDatasetChecksum(input: DatasetChecksumInput): string {
  const payload = JSON.stringify({
    family: input.family,
    seed: input.seed,
    generatorVersion: input.generatorVersion,
    data: input.data,
  });

  return createHash('sha256').update(payload).digest('hex');
}

export function createDatasetManifest(input: CreateDatasetManifestOptions): DatasetManifest {
  const checksum = calculateDatasetChecksum(input);

  return {
    metadata: {
      id: `${input.family}-${input.seed}-${checksum.slice(0, 12)}`,
      family: input.family,
      seed: input.seed,
      generatorVersion: input.generatorVersion,
      checksum,
    },
    recordCounts: input.recordCounts,
    distribution: input.distribution ?? {},
  };
}

import { describe, expect, it } from 'vitest';
import {
  generatePersonalDataset,
  PERSONAL_DATASET_GENERATOR_VERSION,
} from './personal-dataset.js';

describe('generatePersonalDataset', () => {
  const options = {
    seed: 42,
    noteCount: 100,
    entityCount: 50,
    relationCount: 75,
  };

  it('produces identical datasets and manifests for the same seed', () => {
    expect(generatePersonalDataset(options)).toEqual(
      generatePersonalDataset(options),
    );
  });

  it('produces different datasets for different seeds', () => {
    expect(generatePersonalDataset(options)).not.toEqual(
      generatePersonalDataset({ ...options, seed: 99 }),
    );
  });

  it('generates the requested number of records', () => {
    const { data, manifest } = generatePersonalDataset(options);

    expect(data.notes).toHaveLength(options.noteCount);
    expect(data.entities).toHaveLength(options.entityCount);
    expect(data.relations).toHaveLength(options.relationCount);

    expect(manifest.recordCounts).toEqual({
      notes: options.noteCount,
      entities: options.entityCount,
      relations: options.relationCount,
    });
  });

  it('generates relations referencing existing entities', () => {
    const { data } = generatePersonalDataset(options);
    const entityIds = new Set(data.entities.map((entity) => entity.id));

    for (const relation of data.relations) {
      expect(entityIds.has(relation.sourceId)).toBe(true);
      expect(entityIds.has(relation.targetId)).toBe(true);
      expect(relation.sourceId).not.toBe(relation.targetId);
    }
  });

  it('rejects relations without enough entities', () => {
    expect(() =>
      generatePersonalDataset({
        seed: 42,
        noteCount: 0,
        entityCount: 1,
        relationCount: 1,
      }),
    ).toThrow(RangeError);
  });

  it('includes the generator version in the manifest', () => {
    const { manifest } = generatePersonalDataset(options);

    expect(manifest.metadata.generatorVersion).toBe(
      PERSONAL_DATASET_GENERATOR_VERSION,
    );
  });

  it('generates a valid SHA-256 checksum', () => {
    const { manifest } = generatePersonalDataset(options);

    expect(manifest.metadata.checksum).toMatch(/^[a-f0-9]{64}$/);
  });

  it('generates a deterministic dataset ID', () => {
    const first = generatePersonalDataset(options);
    const second = generatePersonalDataset(options);

    expect(first.manifest.metadata.id).toBe(second.manifest.metadata.id);
  });

  it('includes entity and relation distributions', () => {
    const { manifest } = generatePersonalDataset(options);
    const distribution = manifest.distribution;

    expect(
      Object.keys(distribution).some((key) => key.startsWith('entity.')),
    ).toBe(true);
    expect(
      Object.keys(distribution).some((key) => key.startsWith('relation.')),
    ).toBe(true);

    expect(
      Object.entries(distribution)
        .filter(([key]) => key.startsWith('entity.'))
        .reduce((total, [, count]) => total + count, 0),
    ).toBe(options.entityCount);

    expect(
      Object.entries(distribution)
        .filter(([key]) => key.startsWith('relation.'))
        .reduce((total, [, count]) => total + count, 0),
    ).toBe(options.relationCount);
  });
});

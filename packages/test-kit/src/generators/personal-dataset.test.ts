import { describe, expect, it } from 'vitest';
import { generatePersonalDataset } from './personal-dataset.js';

describe('generatePersonalDataset', () => {
  const options = {
    seed: 42,
    noteCount: 100,
    entityCount: 50,
    relationCount: 75,
  };

  it('produces identical datasets for the same seed', () => {
    const first = generatePersonalDataset(options);
    const second = generatePersonalDataset(options);

    expect(first).toEqual(second);
  });

  it('produces different datasets for different seeds', () => {
    const first = generatePersonalDataset(options);
    const second = generatePersonalDataset({ ...options, seed: 99 });

    expect(first).not.toEqual(second);
  });

  it('generates the requested number of records', () => {
    const dataset = generatePersonalDataset(options);

    expect(dataset.notes).toHaveLength(options.noteCount);
    expect(dataset.entities).toHaveLength(options.entityCount);
    expect(dataset.relations).toHaveLength(options.relationCount);
  });

  it('generates relations referencing existing entities', () => {
    const dataset = generatePersonalDataset(options);
    const entityIds = new Set(dataset.entities.map((entity) => entity.id));

    for (const relation of dataset.relations) {
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
});

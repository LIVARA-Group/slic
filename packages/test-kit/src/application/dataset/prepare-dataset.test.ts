import { describe, expect, it } from 'vitest';
import { prepareDataset } from './prepare-dataset.js';

describe('prepareDataset', () => {
  const request = {
    family: 'DS-P' as const,
    seed: 20261126,
    options: {
      noteCount: 100,
      entityCount: 50,
      relationCount: 75,
    },
  };

  it('generates a personal dataset with the requested record counts', () => {
    const result = prepareDataset(request);

    expect(result.data.notes).toHaveLength(100);
    expect(result.data.entities).toHaveLength(50);
    expect(result.data.relations).toHaveLength(75);
  });

  it('preserves dataset metadata', () => {
    const result = prepareDataset(request);

    expect(result.manifest.metadata.family).toBe('DS-P');
    expect(result.manifest.metadata.seed).toBe(request.seed);
    expect(result.manifest.metadata.generatorVersion).toBe('1.0.0');
    expect(result.manifest.recordCounts).toEqual({
      notes: 100,
      entities: 50,
      relations: 75,
    });
  });

  it('produces deterministic datasets for the same request', () => {
    const first = prepareDataset(request);
    const second = prepareDataset(request);

    expect(first.manifest.metadata.checksum).toBe(
      second.manifest.metadata.checksum,
    );
    expect(first.manifest.metadata.id).toBe(
      second.manifest.metadata.id,
    );
  });

  it('produces different datasets for different seeds', () => {
    const first = prepareDataset(request);
    const second = prepareDataset({
      ...request,
      seed: request.seed + 1,
    });

    expect(first.manifest.metadata.checksum).not.toBe(
      second.manifest.metadata.checksum,
    );
  });

  it('propagates generator validation errors', () => {
    expect(() =>
      prepareDataset({
        ...request,
        options: {
          ...request.options,
          noteCount: -1,
        },
      }),
    ).toThrow('noteCount must be a non-negative safe integer');
  });
});

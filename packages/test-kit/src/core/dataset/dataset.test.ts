import { describe, expect, it } from 'vitest';
import { calculateDatasetChecksum } from './dataset.js';

describe('calculateDatasetChecksum', () => {
  const input = {
    family: 'DS-P' as const,
    seed: 42,
    generatorVersion: '1.0.0',
    data: {
      notes: [{ id: 'note_001', content: 'Test' }],
    },
  };

  it('generates a SHA-256 checksum', () => {
    expect(calculateDatasetChecksum(input)).toMatch(/^[a-f0-9]{64}$/);
  });

  it('generates deterministic checksums', () => {
    expect(calculateDatasetChecksum(input)).toBe(
      calculateDatasetChecksum(input),
    );
  });

  it('changes when dataset content changes', () => {
    expect(
      calculateDatasetChecksum({
        ...input,
        data: { notes: [{ id: 'note_001', content: 'Changed' }] },
      }),
    ).not.toBe(calculateDatasetChecksum(input));
  });

  it('changes when generator version changes', () => {
    expect(
      calculateDatasetChecksum({
        ...input,
        generatorVersion: '2.0.0',
      }),
    ).not.toBe(calculateDatasetChecksum(input));
  });

  it('changes when dataset family changes', () => {
    expect(
      calculateDatasetChecksum({
        ...input,
        family: 'DS-G',
      }),
    ).not.toBe(calculateDatasetChecksum(input));
  });
});

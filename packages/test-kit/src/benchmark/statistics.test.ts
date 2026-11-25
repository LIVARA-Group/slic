import { describe, expect, it } from 'vitest';
import { calculateStatistics } from './statistics.js';

describe('calculateStatistics', () => {
  it('calculates statistics for a sample', () => {
    const result = calculateStatistics([1, 2, 3, 4, 5]);

    expect(result).toEqual({
      samples: 5,
      min: 1,
      max: 5,
      mean: 3,
      median: 3,
      p95: 4.8,
      p99: 4.96,
    });
  });

  it('handles a single sample', () => {
    const result = calculateStatistics([10]);

    expect(result.median).toBe(10);
    expect(result.min).toBe(10);
    expect(result.max).toBe(10);
  });

  it('does not mutate the original array', () => {
    const values = [5, 1, 3];

    calculateStatistics(values);

    expect(values).toEqual([5, 1, 3]);
  });

  it('rejects empty samples', () => {
    expect(() => calculateStatistics([])).toThrow(RangeError);
  });
});

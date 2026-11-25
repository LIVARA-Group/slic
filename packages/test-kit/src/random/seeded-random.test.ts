import { describe, expect, it } from 'vitest';
import { SeededRandom } from './seeded-random.js';

describe('SeededRandom', () => {
  it('produces the same sequence for the same seed', () => {
    const first = new SeededRandom(42);
    const second = new SeededRandom(42);

    const firstSequence = Array.from({ length: 10 }, () => first.next());
    const secondSequence = Array.from({ length: 10 }, () => second.next());

    expect(firstSequence).toEqual(secondSequence);
  });

  it('produces different sequences for different seeds', () => {
    const first = new SeededRandom(42);
    const second = new SeededRandom(99);

    expect(first.next()).not.toBe(second.next());
  });

  it('returns integers within the requested range', () => {
    const random = new SeededRandom(42);

    for (let index = 0; index < 100; index++) {
      const value = random.integer(5, 10);

      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it('rejects invalid seeds', () => {
    expect(() => new SeededRandom(1.5)).toThrow(TypeError);
  });

  it('rejects empty arrays', () => {
    const random = new SeededRandom(42);

    expect(() => random.pick([])).toThrow(RangeError);
  });
});

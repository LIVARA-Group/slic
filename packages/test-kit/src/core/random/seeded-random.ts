export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    if (!Number.isInteger(seed)) {
      throw new TypeError('Seed must be an integer');
    }

    this.state = seed >>> 0;
  }

  next(): number {
    this.state += 0x6d2b79f5;

    let value = this.state;

    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  integer(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
      throw new RangeError('Invalid integer range');
    }

    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) {
      throw new RangeError('Cannot pick from an empty array');
    }

    const value = values[this.integer(0, values.length - 1)];

    if (value === undefined) {
      throw new RangeError('Failed to select a value');
    }

    return value;
  }
}

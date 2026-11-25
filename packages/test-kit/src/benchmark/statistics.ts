export interface BenchmarkStatistics {
  samples: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  p95: number;
  p99: number;
}

function percentile(sorted: number[], value: number): number {
  const index = (sorted.length - 1) * value;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const lowerValue = sorted[lower];
  const upperValue = sorted[upper];

  if (lowerValue === undefined || upperValue === undefined) {
    throw new RangeError('Invalid percentile index');
  }

  if (lower === upper) {
    return lowerValue;
  }

  const weight = index - lower;

  return lowerValue * (1 - weight) + upperValue * weight;
}

export function calculateStatistics(values: number[]): BenchmarkStatistics {
  if (values.length === 0) {
    throw new RangeError('At least one sample is required');
  }

  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  if (min === undefined || max === undefined) {
    throw new RangeError('Failed to calculate statistics');
  }

  const sum = sorted.reduce((total, value) => total + value, 0);

  return {
    samples: sorted.length,
    min,
    max,
    mean: sum / sorted.length,
    median: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
  };
}

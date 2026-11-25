import { describe, expect, it } from 'vitest';

import { traceSignal } from '../src/runtime/index.js';

describe('Runtime trace', () => {
  it('traces a bounded graph from a region', () => {
    const result = traceSignal('retina', {
      maxDepth: 2,
    });

    const regionIds = result.nodes.map((node) => node.regionId);

    expect(regionIds).toContain('retina');
    expect(regionIds).toContain('lateral-geniculate-nucleus');
    expect(regionIds).toContain('superior-colliculus');
    expect(regionIds).toContain('left-primary-visual-cortex');
    expect(regionIds).toContain('brainstem');
  });

  it('respects the maximum depth', () => {
    const result = traceSignal('retina', {
      maxDepth: 1,
    });

    expect(result.nodes.every((node) => node.depth <= 1)).toBe(true);
  });

  it('respects the maximum number of nodes', () => {
    const result = traceSignal('retina', {
      maxDepth: 5,
      maxNodes: 2,
    });

    expect(result.nodes.length).toBeLessThanOrEqual(2);
    expect(result.truncated).toBe(true);
  });

  it('can exclude the origin from returned nodes', () => {
    const result = traceSignal('retina', {
      maxDepth: 1,
      includeStart: false,
    });

    expect(result.nodes.some((node) => node.regionId === 'retina')).toBe(false);
  });

  it('rejects invalid depth', () => {
    expect(() =>
      traceSignal('retina', {
        maxDepth: -1,
      }),
    ).toThrow(RangeError);
  });

  it('rejects invalid node limits', () => {
    expect(() =>
      traceSignal('retina', {
        maxNodes: 0,
      }),
    ).toThrow(RangeError);
  });
});

import { connections } from '@repo/brain';
import { describe, expect, it } from 'vitest';

import { clusterOf, toDot, toGraph, toMermaid } from '../src/index.js';

describe('Graph export', () => {
  const graph = toGraph();

  it('exports every connection as an edge', () => {
    expect(graph.edges).toHaveLength(connections.length);
  });

  it('only contains edges between exported nodes', () => {
    const ids = new Set<string>(graph.nodes.map((n) => n.id));

    for (const e of graph.edges) {
      expect(ids.has(e.from)).toBe(true);
      expect(ids.has(e.to)).toBe(true);
    }
  });

  it('places nodes on the canvas with unique ids', () => {
    expect(new Set(graph.nodes.map((n) => n.id)).size).toBe(graph.nodes.length);

    for (const n of graph.nodes) {
      expect(Number.isFinite(n.x) && Number.isFinite(n.y)).toBe(true);
      expect(n.x).toBeGreaterThanOrEqual(0);
      expect(n.x).toBeLessThanOrEqual(graph.width);
      expect(n.y).toBeGreaterThanOrEqual(0);
      expect(n.y).toBeLessThanOrEqual(graph.height);
    }
  });

  it('keeps the frontal / rest division on nodes', () => {
    const byId = new Map(graph.nodes.map((n) => [n.id, n]));

    expect(byId.get('dorsolateral-prefrontal-cortex')?.part).toBe('frontal');
    expect(byId.get('thalamus')?.part).toBe('rest');
    expect(byId.get('retina')?.part).toBe('outside');
  });

  it('resolves clusters, including by ancestry', () => {
    expect(clusterOf('left-primary-motor-cortex')).toBe('frontal');
    expect(clusterOf('cerebellum')).toBe('cerebellum');
    expect(clusterOf('brain')).toBe('other');
  });

  it('renders text formats', () => {
    expect(toMermaid(graph).startsWith('flowchart LR')).toBe(true);
    expect(toDot(graph)).toContain('digraph Brain');
  });
});

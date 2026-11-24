import { describe, expect, it } from 'vitest';

import {
  findConnectionsBetween,
  getConnections,
  getIncomingConnections,
  getOutgoingConnections,
  getOutgoingNeighbors,
} from '../src/graph/index.js';

describe('Brain graph', () => {
  it('returns all connections for a region', () => {
    const result = getConnections('retina');

    expect(result.length).toBeGreaterThan(0);
  });

  it('returns outgoing connections', () => {
    const result = getOutgoingConnections('retina');

    expect(
      result.every(
        (connection) => connection.from === 'retina' || connection.direction === 'bidirectional',
      ),
    ).toBe(true);
  });

  it('returns incoming connections', () => {
    const result = getIncomingConnections('lateral-geniculate-nucleus');

    expect(result.some((connection) => connection.id === 'retina-to-lgn')).toBe(true);
  });

  it('does not treat directed edges as reversible', () => {
    const result = getOutgoingConnections('lateral-geniculate-nucleus');

    expect(result.some((connection) => connection.id === 'retina-to-lgn')).toBe(false);
  });

  it('returns outgoing neighbors', () => {
    const neighbors = getOutgoingNeighbors('retina');

    expect(neighbors).toContain('lateral-geniculate-nucleus');
    expect(neighbors).toContain('superior-colliculus');
  });

  it('finds connections between two regions', () => {
    const result = findConnectionsBetween('retina', 'lateral-geniculate-nucleus');

    expect(result).toHaveLength(1);
  });
});

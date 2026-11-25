import { describe, expect, it } from 'vitest';

import { connections, getConnection, pathways } from '../src/connectome/index.js';

describe('Connectome', () => {
  it('contains connections', () => {
    expect(connections.length).toBeGreaterThan(0);
  });

  it('contains unique connection identifiers', () => {
    const ids = connections.map((connection) => connection.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('resolves a connection by ID', () => {
    expect(getConnection('retina-to-lgn')?.from).toBe('retina');
  });

  it('contains valid connection endpoints', () => {
    for (const connection of connections) {
      expect(connection.from).toBeTruthy();
      expect(connection.to).toBeTruthy();
      expect(connection.from).not.toBe(connection.to);
    }
  });

  it('contains pathways', () => {
    expect(pathways.length).toBeGreaterThan(0);
  });

  it('references connections from pathways', () => {
    const connectionIds = new Set(connections.map((connection) => connection.id));

    for (const pathway of pathways) {
      for (const connectionId of pathway.connectionIds) {
        expect(connectionIds.has(connectionId)).toBe(true);
      }
    }
  });
});

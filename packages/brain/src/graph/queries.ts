import type { RegionId } from '../anatomy/regions.js';
import { connections } from '../connectome/connections.js';
import type { ConnectionDefinition } from '../connectome/types.js';

export function getConnections(regionId: RegionId): readonly ConnectionDefinition[] {
  return connections.filter(
    (connection) => connection.from === regionId || connection.to === regionId,
  );
}

export function getOutgoingConnections(regionId: RegionId): readonly ConnectionDefinition[] {
  return connections.filter(
    (connection) =>
      connection.from === regionId ||
      (connection.direction === 'bidirectional' && connection.to === regionId),
  );
}

export function getIncomingConnections(regionId: RegionId): readonly ConnectionDefinition[] {
  return connections.filter(
    (connection) =>
      connection.to === regionId ||
      (connection.direction === 'bidirectional' && connection.from === regionId),
  );
}

export function getOutgoingNeighbors(regionId: RegionId): readonly RegionId[] {
  const neighbors = new Set<RegionId>();

  for (const connection of getOutgoingConnections(regionId)) {
    const neighbor = connection.from === regionId ? connection.to : connection.from;

    neighbors.add(neighbor);
  }

  return [...neighbors];
}

export function getIncomingNeighbors(regionId: RegionId): readonly RegionId[] {
  const neighbors = new Set<RegionId>();

  for (const connection of getIncomingConnections(regionId)) {
    const neighbor = connection.to === regionId ? connection.from : connection.to;

    neighbors.add(neighbor);
  }

  return [...neighbors];
}

export function getConnectionCount(): number {
  return connections.length;
}

export function findConnectionsBetween(
  from: RegionId,
  to: RegionId,
): readonly ConnectionDefinition[] {
  return connections.filter(
    (connection) =>
      (connection.from === from && connection.to === to) ||
      (connection.direction === 'bidirectional' &&
        connection.from === to &&
        connection.to === from),
  );
}

import type { RegionId } from '../anatomy/regions.js';
import type { ConnectionDefinition } from '../connectome/types.js';
import { getOutgoingConnections } from '../graph/queries.js';

export interface TraceOptions {
  readonly maxDepth?: number;
  readonly maxNodes?: number;
  readonly includeStart?: boolean;
}

export interface TraceNode {
  readonly regionId: RegionId;
  readonly depth: number;
  readonly viaConnectionId: string | null;
}

export interface TraceResult {
  readonly origin: RegionId;
  readonly nodes: readonly TraceNode[];
  readonly connections: readonly ConnectionDefinition[];
  readonly maxDepth: number;
  readonly truncated: boolean;
}

interface QueueEntry {
  readonly regionId: RegionId;
  readonly depth: number;
  readonly viaConnectionId: string | null;
}

const DEFAULT_MAX_DEPTH = 3;
const DEFAULT_MAX_NODES = 100;

export function traceSignal(origin: RegionId, options: TraceOptions = {}): TraceResult {
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  const maxNodes = options.maxNodes ?? DEFAULT_MAX_NODES;
  const includeStart = options.includeStart ?? true;

  if (!Number.isInteger(maxDepth) || maxDepth < 0) {
    throw new RangeError('maxDepth must be a non-negative integer.');
  }

  if (!Number.isInteger(maxNodes) || maxNodes < 1) {
    throw new RangeError('maxNodes must be a positive integer.');
  }

  const visited = new Set<RegionId>([origin]);
  const visitedConnections = new Set<string>();

  const nodes: TraceNode[] = [];
  const traversedConnections: ConnectionDefinition[] = [];

  const queue: QueueEntry[] = [
    {
      regionId: origin,
      depth: 0,
      viaConnectionId: null,
    },
  ];

  if (includeStart) {
    nodes.push({
      regionId: origin,
      depth: 0,
      viaConnectionId: null,
    });
  }

  let truncated = false;

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    if (current.depth >= maxDepth) {
      continue;
    }

    const outgoing = getOutgoingConnections(current.regionId);

    for (const connection of outgoing) {
      const nextRegion = connection.from === current.regionId ? connection.to : connection.from;

      if (!visitedConnections.has(connection.id)) {
        visitedConnections.add(connection.id);
        traversedConnections.push(connection);
      }

      if (visited.has(nextRegion)) {
        continue;
      }

      if (nodes.length >= maxNodes) {
        truncated = true;
        queue.length = 0;
        break;
      }

      visited.add(nextRegion);

      const nextDepth = current.depth + 1;

      nodes.push({
        regionId: nextRegion,
        depth: nextDepth,
        viaConnectionId: connection.id,
      });

      queue.push({
        regionId: nextRegion,
        depth: nextDepth,
        viaConnectionId: connection.id,
      });
    }
  }

  return {
    origin,
    nodes,
    connections: traversedConnections,
    maxDepth,
    truncated,
  };
}

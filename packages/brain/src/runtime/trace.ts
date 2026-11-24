import type { RegionId } from '../anatomy/regions.js';
import type { ConnectionDefinition } from '../connectome/connections.js';

export interface TraceSignalOptions {
  readonly origin: RegionId;
  readonly connections: readonly ConnectionDefinition[];
  readonly maxHops?: number;
  readonly includeFunctional?: boolean;
  readonly includeModulatory?: boolean;
}

export interface SignalTraceStep {
  readonly regionId: RegionId;
  readonly hop: number;
  readonly viaConnectionId: string | null;
}

export interface SignalTrace {
  readonly origin: RegionId;
  readonly visited: readonly SignalTraceStep[];
  readonly truncated: boolean;
}

/**
 * Traverses a curated connectivity graph. This is a graph-query utility,
 * not a physiological model of action-potential propagation.
 */
export function traceSignal(options: TraceSignalOptions): SignalTrace {
  const maxHops = options.maxHops ?? 3;
  const includeFunctional = options.includeFunctional ?? true;
  const includeModulatory = options.includeModulatory ?? true;
  if (!Number.isInteger(maxHops) || maxHops < 0)
    throw new RangeError('maxHops must be a non-negative integer.');

  const visited: SignalTraceStep[] = [{ regionId: options.origin, hop: 0, viaConnectionId: null }];
  const seen = new Set<RegionId>([options.origin]);
  let frontier: RegionId[] = [options.origin];
  let truncated = false;

  for (let hop = 1; hop <= maxHops; hop += 1) {
    const next: RegionId[] = [];
    for (const current of frontier) {
      for (const edge of options.connections) {
        if (edge.kind === 'functional' && !includeFunctional) continue;
        if (edge.kind === 'modulatory' && !includeModulatory) continue;
        const canFollow =
          edge.from === current || (edge.direction === 'bidirectional' && edge.to === current);
        if (!canFollow) continue;
        const target = edge.from === current ? edge.to : edge.from;
        if (seen.has(target)) continue;
        seen.add(target);
        next.push(target);
        visited.push({ regionId: target, hop, viaConnectionId: edge.id });
      }
    }
    frontier = next;
    if (frontier.length === 0) break;
    if (hop === maxHops) {
      truncated = options.connections.some(
        (edge) =>
          frontier.includes(edge.from) ||
          (edge.direction === 'bidirectional' && frontier.includes(edge.to)),
      );
    }
  }
  return { origin: options.origin, visited, truncated };
}

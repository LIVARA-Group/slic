import { type ConnectionDefinition, connections } from '@repo/brain';
import { connectionDynamics } from './dynamics.generated.js';

export interface ConnectionDynamics {
  /** Conduction delay in milliseconds. */
  readonly latencyMs: number;
  /** Relative coupling strength in (0, 1]. */
  readonly weight: number;
}

/**
 * Parameters used when a connection has no explicit entry.
 * These are modelling defaults, not measured values.
 */
export const DEFAULT_DYNAMICS: ConnectionDynamics = { latencyMs: 5, weight: 0.85 };

export function getDynamics(connectionId: string): ConnectionDynamics {
  return connectionDynamics[connectionId] ?? DEFAULT_DYNAMICS;
}

/** Sign of a connection's effect. Unspecified effects are treated as excitatory. */
export function getEffect(
  connection: ConnectionDefinition,
): 'excitatory' | 'inhibitory' | 'modulatory' {
  if ('effect' in connection && connection.effect !== undefined) {
    return connection.effect;
  }

  return connection.kind === 'modulatory' ? 'modulatory' : 'excitatory';
}

/** Expands bidirectional connections into directed edges. */
export interface DirectedEdge {
  readonly connection: ConnectionDefinition;
  readonly from: string;
  readonly to: string;
}

export function buildDirectedEdges(): readonly DirectedEdge[] {
  const edges: DirectedEdge[] = [];

  for (const connection of connections) {
    edges.push({ connection, from: connection.from, to: connection.to });

    if (connection.direction === 'bidirectional') {
      edges.push({ connection, from: connection.to, to: connection.from });
    }
  }

  return edges;
}

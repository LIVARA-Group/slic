import type { RegionId } from '../anatomy/regions.js';
import type { Evidence, Identifier } from '../shared/types.js';

export type ConnectionKind =
  | 'projection'
  | 'reciprocal_projection'
  | 'commissural'
  | 'association'
  | 'sensory_relay'
  | 'motor_pathway'
  | 'modulatory'
  | 'distributed_network';

export type ConnectionDirection = 'directed' | 'bidirectional';

export type EvidenceStatus = 'curated_baseline' | 'dataset_derived' | 'research_candidate';

export interface ConnectionDefinition {
  readonly id: Identifier;
  readonly from: RegionId;
  readonly to: RegionId;
  readonly kind: ConnectionKind;
  readonly direction: ConnectionDirection;
  readonly evidenceStatus: EvidenceStatus;
  readonly evidence: Evidence;
  readonly description: string;
}

export interface PathwayDefinition {
  readonly id: Identifier;
  readonly name: string;
  readonly description: string;
  readonly regions: readonly RegionId[];
  readonly connectionIds: readonly Identifier[];
  readonly evidence: Evidence;
}

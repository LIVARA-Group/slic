import type { RegionId } from '../anatomy/regions.js';
import type { FunctionalSystemId } from '../anatomy/systems.js';
import type { Evidence } from '../shared/types.js';

export type CognitiveProcessCategory =
  | 'perception'
  | 'attention'
  | 'memory'
  | 'learning'
  | 'executive'
  | 'language'
  | 'emotion'
  | 'motor'
  | 'autonomic';

export interface CognitiveProcessDefinition {
  readonly id: string;
  readonly name: string;
  readonly category: CognitiveProcessCategory;
  readonly description: string;
  readonly candidateRegions: readonly RegionId[];
  readonly participatingSystems: readonly FunctionalSystemId[];
  readonly evidence: Evidence;
  readonly limitations?: string;
}

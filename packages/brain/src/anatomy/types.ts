import type { Evidence, Identifier, Laterality } from '../shared/types.js';

export type StructureKind =
  | 'system'
  | 'subsystem'
  | 'organ'
  | 'division'
  | 'region'
  | 'subregion'
  | 'cortical_area'
  | 'nucleus'
  | 'tract'
  | 'nerve'
  | 'ganglion';

export type StructureSystem =
  | 'nervous'
  | 'central_nervous'
  | 'peripheral_nervous'
  | 'sensory'
  | 'motor'
  | 'autonomic';

export interface BrainStructure {
  readonly id: Identifier;
  readonly name: string;
  readonly latinName?: string;
  readonly abbreviation?: string;
  readonly kind: StructureKind;
  readonly system: StructureSystem;
  readonly laterality: Laterality;
  readonly parentId: Identifier | null;
  readonly description: string;
  readonly evidence: Evidence;
  readonly aliases?: readonly string[];
}

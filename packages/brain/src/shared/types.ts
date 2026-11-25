export type Identifier = string;

export type Laterality = 'left' | 'right' | 'midline' | 'bilateral' | 'unspecified';

export type EvidenceLevel = 'established' | 'strong' | 'moderate' | 'limited' | 'hypothesis';

export type EvidenceKind =
  | 'anatomical'
  | 'histological'
  | 'neuroimaging'
  | 'electrophysiological'
  | 'clinical'
  | 'behavioral'
  | 'computational'
  | 'review';

export interface SourceReference {
  readonly id: Identifier;
  readonly title: string;
  readonly authors?: readonly string[];
  readonly year?: number;
  readonly doi?: string;
  readonly url?: string;
}

export interface Evidence {
  readonly level: EvidenceLevel;
  readonly kind: EvidenceKind;
  readonly sources: readonly SourceReference[];
  readonly note?: string;
}

export interface RegistryMetadata {
  readonly id: Identifier;
  readonly version: string;
  readonly description: string;
}

export interface Coordinate3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface VersionedDefinition {
  readonly version: string;
}

export type SignalEffect = 'excitatory' | 'inhibitory' | 'modulatory';

export type Neurotransmitter =
  | 'glutamate'
  | 'GABA'
  | 'dopamine'
  | 'serotonin'
  | 'acetylcholine'
  | 'noradrenaline'
  | 'histamine'
  | 'orexin'
  | 'oxytocin'
  | 'CRH';

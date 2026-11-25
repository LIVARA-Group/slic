import { getAncestors } from './queries.js';
import { brainStructures, type RegionId } from './regions.js';

type StructureUnion = (typeof brainStructures)[number];

/** Identifiers of the direct children of structure `P`, derived from literal `parentId` values. */
export type ChildIdsOf<P extends string> = Extract<StructureUnion, { readonly parentId: P }>['id'];

/** Identifiers of all descendants of structure `P`, derived at the type level. */
export type DescendantIdsOf<P extends string> =
  ChildIdsOf<P> extends infer C ? (C extends string ? C | DescendantIdsOf<C> : never) : never;

/** The frontal part of the brain: both frontal lobes and everything below them. */
export type FrontalRegionId =
  | 'left-frontal-lobe'
  | 'right-frontal-lobe'
  | DescendantIdsOf<'left-frontal-lobe' | 'right-frontal-lobe'>;

/** Every structure inside the brain (excludes spinal cord and peripheral structures). */
export type BrainRegionId = DescendantIdsOf<'brain'>;

/** The rest of the brain: everything inside the brain that is not frontal. */
export type RestOfBrainRegionId = Exclude<BrainRegionId, FrontalRegionId>;

export type BrainPart = 'frontal' | 'rest';

const FRONTAL_ROOTS: ReadonlySet<string> = new Set(['left-frontal-lobe', 'right-frontal-lobe']);

/**
 * Primary division of the brain. Returns `null` for structures outside the brain
 * (spinal cord, peripheral nervous system, sensory and motor boundaries).
 */
export function getBrainPart(id: RegionId): BrainPart | null {
  const chain = [id, ...getAncestors(id).map((structure) => structure.id)];

  if (chain.some((entry) => FRONTAL_ROOTS.has(entry))) {
    return 'frontal';
  }

  return chain.includes('brain') ? 'rest' : null;
}

export function listFrontalRegionIds(): readonly FrontalRegionId[] {
  return brainStructures
    .map((structure) => structure.id)
    .filter((id): id is FrontalRegionId => getBrainPart(id) === 'frontal');
}

export function listRestOfBrainRegionIds(): readonly RestOfBrainRegionId[] {
  return brainStructures
    .map((structure) => structure.id)
    .filter((id): id is RestOfBrainRegionId => getBrainPart(id) === 'rest');
}

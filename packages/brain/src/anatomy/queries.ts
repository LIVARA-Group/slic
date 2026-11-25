import { BrainEntityNotFoundError } from '../shared/errors.js';
import {
  type BrainStructureDefinition,
  brainStructures,
  type RegionId,
  regions,
} from './regions.js';

const structures: readonly BrainStructureDefinition[] = brainStructures;

const childrenByParentId = new Map<string, RegionId[]>();

for (const structure of brainStructures) {
  if (structure.parentId === null) {
    continue;
  }

  const children = childrenByParentId.get(structure.parentId) ?? [];

  children.push(structure.id);
  childrenByParentId.set(structure.parentId, children);
}

export function hasStructure(id: string): id is RegionId {
  return Object.hasOwn(regions, id);
}

export function getStructure(id: RegionId): BrainStructureDefinition;

export function getStructure(id: string): BrainStructureDefinition | undefined;

export function getStructure(id: string): BrainStructureDefinition | undefined {
  return regions[id] as BrainStructureDefinition | undefined;
}

export function requireStructure(id: string): BrainStructureDefinition {
  const structure = getStructure(id);

  if (!structure) {
    throw new BrainEntityNotFoundError('Brain structure', id);
  }

  return structure;
}

export function findStructure(query: string): readonly BrainStructureDefinition[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return structures.filter((structure) => {
    const searchableValues = [
      structure.id,
      structure.name,
      structure.latinName,
      structure.abbreviation,
      ...(structure.aliases ?? []),
    ];

    return searchableValues.some((value) => value?.toLowerCase().includes(normalizedQuery));
  });
}

export interface ListStructuresOptions {
  readonly kind?: BrainStructureDefinition['kind'];
  readonly system?: BrainStructureDefinition['system'];
  readonly laterality?: BrainStructureDefinition['laterality'];
  readonly parentId?: RegionId | null;
}

export function listStructures(
  options: ListStructuresOptions = {},
): readonly BrainStructureDefinition[] {
  return structures.filter((structure) => {
    if (options.kind && structure.kind !== options.kind) {
      return false;
    }

    if (options.system && structure.system !== options.system) {
      return false;
    }

    if (options.laterality && structure.laterality !== options.laterality) {
      return false;
    }

    if (options.parentId !== undefined && structure.parentId !== options.parentId) {
      return false;
    }

    return true;
  });
}

export function getChildren(id: RegionId): readonly BrainStructureDefinition[] {
  const childIds = childrenByParentId.get(id) ?? [];

  return childIds
    .map((childId) => getStructure(childId))
    .filter((structure): structure is BrainStructureDefinition => structure !== undefined);
}

export function getParent(id: RegionId): BrainStructureDefinition | null {
  const structure = requireStructure(id);

  if (structure.parentId === null) {
    return null;
  }

  const parent = getStructure(structure.parentId);

  return parent ?? null;
}

export function getAncestors(id: RegionId): readonly BrainStructureDefinition[] {
  const ancestors: BrainStructureDefinition[] = [];
  const visited = new Set<RegionId>();

  let current = requireStructure(id);

  while (current.parentId !== null) {
    const parentId = current.parentId;

    if (visited.has(parentId as RegionId)) {
      break;
    }

    visited.add(parentId as RegionId);

    const parent = getStructure(parentId);

    if (!parent) {
      break;
    }

    ancestors.push(parent);
    current = parent;
  }

  return ancestors;
}

export function getDescendants(id: RegionId): readonly BrainStructureDefinition[] {
  const result: BrainStructureDefinition[] = [];
  const visited = new Set<RegionId>();
  const queue = [...(childrenByParentId.get(id) ?? [])];

  while (queue.length > 0) {
    const currentId = queue.shift();

    if (!currentId || visited.has(currentId)) {
      continue;
    }

    visited.add(currentId);

    const structure = getStructure(currentId);

    if (!structure) {
      continue;
    }

    result.push(structure);

    queue.push(...(childrenByParentId.get(currentId) ?? []));
  }

  return result;
}

export function getStructurePath(id: RegionId): readonly BrainStructureDefinition[] {
  const structure = requireStructure(id);

  return [...[...getAncestors(id)].reverse(), structure];
}

export function getStructureCount(): number {
  return brainStructures.length;
}

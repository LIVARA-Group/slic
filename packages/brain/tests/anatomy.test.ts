import { describe, expect, it } from 'vitest';

import {
  brainStructures,
  getAncestors,
  getChildren,
  getDescendants,
  getStructure,
  getStructureCount,
  getStructurePath,
  hasStructure,
  listStructures,
} from '../src/anatomy/index.js';

describe('Anatomy registry', () => {
  it('contains anatomical structures', () => {
    expect(brainStructures.length).toBeGreaterThan(0);
    expect(getStructureCount()).toBe(brainStructures.length);
  });

  it('contains unique identifiers', () => {
    const ids = brainStructures.map((structure) => structure.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('resolves known structures', () => {
    expect(hasStructure('brain')).toBe(true);
    expect(hasStructure('left-hippocampus')).toBe(true);
    expect(hasStructure('unknown-region')).toBe(false);
  });

  it('returns a structure by ID', () => {
    expect(getStructure('left-hippocampus')?.name).toBe('Left hippocampus');
  });

  it('returns undefined for unknown IDs', () => {
    expect(getStructure('unknown-region')).toBeUndefined();
  });

  it('finds structures by name', () => {
    const result = listStructures({
      kind: 'cortical_area',
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((structure) => structure.kind === 'cortical_area')).toBe(true);
  });

  it('returns children of a structure', () => {
    const children = getChildren('brain');

    expect(children.length).toBeGreaterThan(0);
    expect(children.every((child) => child.parentId === 'brain')).toBe(true);
  });

  it('returns ancestors of a structure', () => {
    const ancestors = getAncestors('left-hippocampus');
    const ids = ancestors.map((structure) => structure.id);

    expect(ids).toContain('left-temporal-lobe');
    expect(ids).toContain('left-hemisphere');
    expect(ids).toContain('cerebrum');
    expect(ids).toContain('brain');
  });

  it('returns descendants of a structure', () => {
    const descendants = getDescendants('cerebrum');

    expect(descendants.some((structure) => structure.id === 'left-hippocampus')).toBe(true);
  });

  it('returns the complete root-to-node path', () => {
    const path = getStructurePath('left-hippocampus');
    const ids = path.map((structure) => structure.id);

    expect(ids[0]).toBe('nervous-system');
    expect(ids.at(-1)).toBe('left-hippocampus');
  });
});

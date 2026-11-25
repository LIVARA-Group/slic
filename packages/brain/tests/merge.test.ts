import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  brainStructures,
  cognitiveProcesses,
  connections,
  corticalAreas,
  type FrontalRegionId,
  getAncestors,
  getBrainModelStats,
  getBrainPart,
  getProvenanceSummary,
  getRegionsForSystem,
  getSystemsForRegion,
  listFrontalRegionIds,
  listRestOfBrainRegionIds,
  pathways,
  type RestOfBrainRegionId,
  validateAnatomy,
  validateConnectome,
  validateCoverage,
  validateProvenance,
} from '../src/index.js';

describe('Merged SLIC model', () => {
  it('keeps the model valid with zero errors', () => {
    expect(validateAnatomy().errors).toHaveLength(0);
    expect(validateConnectome().errors).toHaveLength(0);
  });

  it('is substantially larger than the baseline', () => {
    const stats = getBrainModelStats();

    expect(stats.structures).toBeGreaterThanOrEqual(140);
    expect(stats.connections).toBeGreaterThanOrEqual(200);
    expect(stats.pathways).toBeGreaterThanOrEqual(35);
    expect(stats.cognitiveProcesses).toBeGreaterThanOrEqual(20);
  });

  it('has globally unique identifiers across all registries', () => {
    for (const list of [
      brainStructures,
      connections,
      pathways,
      cognitiveProcesses,
      corticalAreas,
    ]) {
      const ids = list.map((entry) => entry.id);

      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('preserves baseline identifiers', () => {
    const ids = new Set<string>(brainStructures.map((s) => s.id));

    for (const id of ['left-hippocampus', 'retina', 'thalamus', 'left-primary-visual-cortex']) {
      expect(ids.has(id)).toBe(true);
    }

    expect(connections.some((c) => c.id === 'retina-to-lgn')).toBe(true);
  });

  it('attaches every merged structure to the hierarchy', () => {
    for (const structure of brainStructures) {
      const ancestors = getAncestors(structure.id);

      expect(structure.parentId === null || ancestors.length > 0).toBe(true);
    }
  });

  it('carries effect and neurotransmitter on merged connections', () => {
    const inhibitory = connections.filter((c) => 'effect' in c && c.effect === 'inhibitory');

    expect(inhibitory.length).toBeGreaterThan(10);
    expect(
      connections.some((c) => 'neurotransmitter' in c && c.neurotransmitter === 'dopamine'),
    ).toBe(true);
  });

  it('extends functional systems with merged structures', () => {
    expect(getRegionsForSystem('executive')).toContain('dorsolateral-prefrontal-cortex');
    expect(getSystemsForRegion('ventral-tegmental-area').map((s) => s.id)).toContain('limbic');
  });

  it('adds Brodmann-based cortical fields', () => {
    expect(corticalAreas.some((a) => a.regionId === 'wernicke-area')).toBe(true);
  });
});

describe('Primary division: frontal part vs rest', () => {
  it('classifies structures', () => {
    expect(getBrainPart('dorsolateral-prefrontal-cortex')).toBe('frontal');
    expect(getBrainPart('left-broca-area')).toBe('frontal');
    expect(getBrainPart('thalamus')).toBe('rest');
    expect(getBrainPart('cerebellum')).toBe('rest');
    expect(getBrainPart('spinal-cord')).toBeNull();
    expect(getBrainPart('retina')).toBeNull();
  });

  it('partitions brain structures without overlap', () => {
    const frontal = new Set<string>(listFrontalRegionIds());
    const rest = new Set<string>(listRestOfBrainRegionIds());

    expect(frontal.size).toBeGreaterThan(10);
    expect(rest.size).toBeGreaterThan(60);
    expect([...frontal].some((id) => rest.has(id))).toBe(false);
  });

  it('derives division types from the hierarchy', () => {
    expectTypeOf<'dorsolateral-prefrontal-cortex'>().toExtend<FrontalRegionId>();
    expectTypeOf<'left-hippocampus'>().toExtend<RestOfBrainRegionId>();
    expectTypeOf<'left-hippocampus'>().not.toExtend<FrontalRegionId>();
  });
});

describe('Provenance and coverage reporting', () => {
  it('reports unsourced connections as warnings only', () => {
    const result = validateProvenance();

    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('summarizes evidence levels', () => {
    const summary = getProvenanceSummary();

    expect(summary.connections.total).toBe(connections.length);
    expect(summary.connections.byLevel.moderate).toBeGreaterThan(100);
  });

  it('lists unconnected leaf structures as warnings', () => {
    const result = validateCoverage();

    expect(result.valid).toBe(true);
    expect(result.issues.every((issue) => issue.code === 'UNCONNECTED_LEAF_STRUCTURE')).toBe(true);
  });
});

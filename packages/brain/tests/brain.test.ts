import { describe, expect, it } from 'vitest';
import {
  Brain,
  connections,
  getAncestors,
  getChildren,
  getConnections,
  getDescendants,
  regions,
  traceSignal,
  validateBrainGraph,
} from '../src/index.js';

describe('@repo/brain', () => {
  it('exposes a composed Brain model', () => {
    expect(Brain.metadata.id).toBe('slic-brain-model');
    expect(Object.keys(Brain.anatomy).length).toBeGreaterThan(50);
    expect(Brain.connectome.length).toBeGreaterThan(30);
  });

  it('supports hierarchical anatomy queries', () => {
    expect(getChildren('brain')).toContain('telencephalon');
    expect(getDescendants('brain')).toContain('hippocampus');
    expect(getAncestors('hippocampus')).toContain('medial_temporal_lobe');
  });

  it('returns region connections', () => {
    expect(getConnections('thalamus').length).toBeGreaterThan(0);
  });

  it('traces graph edges from a sensory origin', () => {
    const trace = traceSignal({ origin: 'retina', connections, maxHops: 2 });
    expect(trace.visited.map((step) => step.regionId)).toContain('lateral_geniculate_nucleus');
    expect(trace.visited.map((step) => step.regionId)).toContain('superior_colliculus');
  });

  it('validates registry references and hierarchy', () => {
    expect(validateBrainGraph()).toEqual([]);
    expect(regions.primary_visual_cortex.parentId).toBe('cerebral_cortex');
  });
});

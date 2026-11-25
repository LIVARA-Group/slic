import { describe, expect, it } from 'vitest';
import { functionalSystems, getSystemsForRegion } from '../src/anatomy/index.js';
import {
  cognitiveProcesses,
  findCognitiveProcessesByCategory,
  findCognitiveProcessesByRegion,
  getCognitiveProcess,
} from '../src/cognition/index.js';

describe('Cognition', () => {
  it('contains cognitive processes', () => {
    expect(cognitiveProcesses.length).toBeGreaterThan(0);
  });

  it('resolves a cognitive process', () => {
    expect(getCognitiveProcess('visual-perception')?.name).toBe('Visual perception');
  });

  it('finds processes by category', () => {
    const processes = findCognitiveProcessesByCategory('memory');

    expect(processes.length).toBeGreaterThan(0);
    expect(processes.every((process) => process.category === 'memory')).toBe(true);
  });

  it('finds processes by anatomical region', () => {
    const processes = findCognitiveProcessesByRegion('left-hippocampus');

    expect(processes.some((process) => process.id === 'episodic-memory-formation')).toBe(true);
  });

  it('references existing functional systems', () => {
    const systemIds = new Set(functionalSystems.map((system) => system.id));

    for (const process of cognitiveProcesses) {
      for (const systemId of process.participatingSystems) {
        expect(systemIds.has(systemId)).toBe(true);
      }
    }
  });

  it('returns functional systems for a region', () => {
    const systems = getSystemsForRegion('left-hippocampus');

    expect(systems.some((system) => system.id === 'memory')).toBe(true);
  });
});

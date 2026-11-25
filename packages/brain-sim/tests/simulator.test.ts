import { connections, getRegionsForSystem } from '@repo/brain';
import { describe, expect, it } from 'vitest';
import {
  BrainSimulator,
  connectionDynamics,
  getDynamics,
  isEffector,
  isSensor,
} from '../src/index.js';

function run(sensor: Parameters<BrainSimulator['stimulate']>[0], ms = 250): BrainSimulator {
  const sim = new BrainSimulator();

  sim.stimulate(sensor, 1);
  sim.run(ms);

  return sim;
}

describe('Dynamics parameters', () => {
  it('only reference existing connections', () => {
    const ids = new Set<string>(connections.map((c) => c.id));

    for (const id of Object.keys(connectionDynamics)) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it('are in valid ranges and fall back to defaults', () => {
    for (const d of Object.values(connectionDynamics)) {
      expect(d.latencyMs).toBeGreaterThan(0);
      expect(d.weight).toBeGreaterThan(0);
      expect(d.weight).toBeLessThanOrEqual(1);
    }

    expect(getDynamics('retina-to-lgn').latencyMs).toBeGreaterThan(0);
  });

  it('declare boundary structures that exist in the model', () => {
    expect(isSensor('retina')).toBe(true);
    expect(isEffector('skeletal-muscles')).toBe(true);
    expect(getRegionsForSystem('visual').length).toBeGreaterThan(0);
  });
});

describe('BrainSimulator', () => {
  it('vision reaches visual recognition', () => {
    const sim = run('retina');

    expect(sim.startedProcesses()).toContain('visual-object-recognition');
    expect(sim.fireCount('left-primary-visual-cortex')).toBeGreaterThan(0);
  });

  it('hearing reaches language comprehension', () => {
    const sim = run('cochlea');

    expect(sim.startedProcesses()).toContain('language-comprehension');
    expect(sim.fireCount('wernicke-area')).toBeGreaterThan(0);
  });

  it('pain produces pain processing and a motor output', () => {
    const sim = run('somatic-receptors');

    expect(sim.startedProcesses()).toContain('pain-processing');
    expect(sim.firedEffectors()).toContain('skeletal-muscles');
  });

  it('emits events with the NeuralEvent contract', () => {
    const sim = run('retina', 60);

    expect(sim.eventsOfType('sensory-input')[0]?.modality).toBe('visual');
    expect(sim.eventsOfType('regional-signal').length).toBeGreaterThan(0);
    expect(sim.events.every((event) => event.source === 'brain-sim')).toBe(true);
  });

  it('inhibition lowers activation', () => {
    const sim = new BrainSimulator();

    sim.stimulate('left-amygdala', 0.2);

    const before = sim.activation('left-amygdala');

    sim.stimulate('ventromedial-prefrontal-cortex', 0.9);
    sim.run(20);

    expect(sim.activation('left-amygdala')).toBeLessThan(before);
  });

  it('modulatory edges raise neurotransmitter levels', () => {
    const sim = new BrainSimulator();

    sim.stimulate('ventral-tegmental-area', 1);
    sim.run(30);

    expect(sim.neuromodulators.get('dopamine') ?? 0).toBeGreaterThan(0);
  });

  it('is deterministic', () => {
    const a = run('retina', 100).hottest(5);
    const b = run('retina', 100).hottest(5);

    expect(a).toEqual(b);
  });

  it('terminates and stays selective', () => {
    const sim = run('cochlea', 300);

    expect(sim.firedRegions().length).toBeLessThan(120);
  });
});

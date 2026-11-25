import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BrainSimulator, type SensorId } from '@repo/brain-sim';
import { toDot, toGraph, toMermaid } from '../src/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs');

mkdirSync(out, { recursive: true });

const graph = toGraph();

const stimuli: ReadonlyArray<{ label: string; sensor: SensorId }> = [
  { label: '👁 Vision', sensor: 'retina' },
  { label: '👂 Hearing', sensor: 'cochlea' },
  { label: '✋ Pain / touch', sensor: 'somatic-receptors' },
  { label: '👃 Smell', sensor: 'olfactory-epithelium' },
  { label: '👅 Taste', sensor: 'taste-receptors' },
  { label: '🌀 Balance', sensor: 'vestibular-apparatus' },
];

const scenarios = stimuli.map(({ label, sensor }) => {
  const sim = new BrainSimulator();

  sim.stimulate(sensor, 1);
  sim.run(250);

  return {
    label,
    duration: 250,
    events: sim.impulses
      .slice(0, 2500)
      .map((i) => ({ t: i.at, d: i.arrivesAt - i.at, from: i.from, to: i.to })),
    thoughts: sim.startedProcesses(),
    actions: sim.firedEffectors(),
  };
});

const html = readFileSync(join(root, 'assets/map-template.html'), 'utf8')
  .replace('/*GRAPH_JSON*/null', JSON.stringify(graph))
  .replace('/*SCENARIOS_JSON*/null', JSON.stringify(scenarios));

writeFileSync(join(out, 'brain.html'), html);
writeFileSync(join(out, 'brain.mmd'), toMermaid(graph));
writeFileSync(join(out, 'brain.dot'), toDot(graph));
writeFileSync(join(out, 'brain.json'), JSON.stringify(graph, null, 2));

console.log(`docs/: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);

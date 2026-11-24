import { regions } from './anatomy/regions.js';
import { functionalSystems } from './anatomy/systems.js';
import { cognitiveProcesses } from './cognition/processes.js';
import { connections } from './connectome/connections.js';
import { pathways } from './connectome/pathways.js';

export * from './anatomy/index.js';
export * from './cognition/events.js';
export * from './cognition/processes.js';
export * from './connectome/index.js';
export * from './graph/queries.js';
export * from './runtime/index.js';

export const Brain = {
  metadata: {
    id: 'slic-brain-model',
    name: 'SLIC Brain Model',
    version: '0.1.0',
    modelKind: 'curated-anatomical-functional-graph',
    completeness: 'initial-baseline',
  },
  anatomy: regions,
  connectome: connections,
  pathways,
  functionalSystems,
  cognitiveProcesses,
} as const;

export type BrainModel = typeof Brain;

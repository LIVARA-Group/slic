import { brainStructures } from './anatomy/regions.js';
import { functionalSystems } from './anatomy/systems.js';
import { cognitiveProcesses } from './cognition/processes.js';
import { connections } from './connectome/connections.js';
import { pathways } from './connectome/pathways.js';

export * from './anatomy/index.js';
export * from './cognition/index.js';
export * from './connectome/index.js';
export * from './graph/index.js';
export * from './runtime/index.js';
export * from './shared/errors.js';
export * from './shared/types.js';
export * from './validation/index.js';

export const brainModel = Object.freeze({
  metadata: Object.freeze({
    id: 'slic-brain',
    version: '0.3.0',
    name: 'SLIC Brain Model',
    description:
      'A curated conceptual model of selected human neuroanatomical structures, connectivity and distributed functional relationships.',
  }),
  anatomy: brainStructures,
  functionalSystems,
  connections,
  pathways,
  cognitiveProcesses,
});

export function getBrainModelStats() {
  return {
    structures: brainStructures.length,
    functionalSystems: functionalSystems.length,
    connections: connections.length,
    pathways: pathways.length,
    cognitiveProcesses: cognitiveProcesses.length,
  };
}

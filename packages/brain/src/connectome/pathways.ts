import type { RegionId } from '../anatomy/regions.js';
import type { Evidence } from '../shared/types.js';
import { extendedPathways } from './pathways-extended.js';
import type { PathwayDefinition } from './types.js';

const pathwayEvidence = {
  level: 'established',
  kind: 'review',
  sources: [],
  note: 'Simplified curated pathway. Intermediate structures may be omitted.',
} as const satisfies Evidence;

export const corePathways = [
  {
    id: 'visual-geniculostriate',
    name: 'Geniculostriate visual pathway',
    description:
      'A simplified representation of the principal retinal-thalamic-cortical visual pathway.',
    regions: ['retina', 'lateral-geniculate-nucleus', 'left-primary-visual-cortex'],
    connectionIds: ['retina-to-lgn', 'lgn-to-primary-visual-cortex'],
    evidence: pathwayEvidence,
  },
  {
    id: 'visual-tectal',
    name: 'Retinotectal pathway',
    description:
      'A simplified representation of retinal projections to the superior colliculus and related orienting networks.',
    regions: ['retina', 'superior-colliculus', 'brainstem'],
    connectionIds: ['retina-to-superior-colliculus', 'superior-colliculus-to-brainstem'],
    evidence: pathwayEvidence,
  },
  {
    id: 'auditory-ascending',
    name: 'Ascending auditory pathway',
    description:
      'A simplified auditory route from the cochlea through midbrain and thalamic relay structures to auditory cortex.',
    regions: [
      'cochlea',
      'inferior-colliculus',
      'medial-geniculate-nucleus',
      'left-primary-auditory-cortex',
    ],
    connectionIds: [
      'cochlea-to-inferior-colliculus',
      'inferior-colliculus-to-mgn',
      'mgn-to-primary-auditory-cortex',
    ],
    evidence: pathwayEvidence,
  },
  {
    id: 'somatosensory-ascending',
    name: 'Ascending somatosensory pathway',
    description:
      'A highly simplified representation of ascending somatosensory information and cortical processing.',
    regions: [
      'dorsal-root-ganglion',
      'ventral-posterior-nucleus',
      'left-primary-somatosensory-cortex',
      'left-posterior-parietal-cortex',
    ],
    connectionIds: [
      'drg-to-ventral-posterior-nucleus',
      'ventral-posterior-to-s1',
      's1-to-posterior-parietal',
    ],
    evidence: pathwayEvidence,
  },
  {
    id: 'corticospinal',
    name: 'Corticospinal pathway',
    description:
      'A simplified descending motor pathway from cortical motor regions to the spinal cord.',
    regions: ['left-premotor-cortex', 'left-primary-motor-cortex', 'spinal-cord'],
    connectionIds: ['premotor-to-m1', 'm1-to-spinal-cord'],
    evidence: pathwayEvidence,
  },
  {
    id: 'hippocampal-fornical',
    name: 'Hippocampal-fornical pathway',
    description:
      'A simplified representation of hippocampal formation output through subicular and fornical structures.',
    regions: ['entorhinal-cortex', 'left-hippocampus', 'subiculum', 'fornix'],
    connectionIds: ['entorhinal-to-hippocampus', 'hippocampus-to-subiculum', 'subiculum-to-fornix'],
    evidence: pathwayEvidence,
  },
] as const satisfies readonly PathwayDefinition[];

export const pathways = [
  ...corePathways,
  ...extendedPathways,
] as const satisfies readonly PathwayDefinition[];

export type PathwayId = (typeof pathways)[number]['id'];

export function getPathway(id: PathwayId): (typeof pathways)[number] | undefined {
  return pathways.find((pathway) => pathway.id === id);
}

export function findPathwaysByRegion(regionId: RegionId): readonly (typeof pathways)[number][] {
  return pathways.filter((pathway) => pathway.regions.some((id) => id === regionId));
}

import type { RegionId } from './regions.js';

export type FunctionalSystemId =
  | 'visual'
  | 'auditory'
  | 'somatosensory'
  | 'motor'
  | 'memory'
  | 'limbic'
  | 'executive'
  | 'autonomic';

export interface FunctionalSystem {
  readonly id: FunctionalSystemId;
  readonly name: string;
  readonly description: string;
  readonly regions: readonly RegionId[];
}

export const functionalSystems = [
  {
    id: 'visual',
    name: 'Visual system',
    description: 'Structures involved in visual sensation, processing and orienting.',
    regions: [
      'retina',
      'lateral-geniculate-nucleus',
      'superior-colliculus',
      'left-primary-visual-cortex',
      'right-primary-visual-cortex',
      'left-occipital-lobe',
      'right-occipital-lobe',
    ],
  },
  {
    id: 'auditory',
    name: 'Auditory system',
    description: 'Structures involved in auditory sensation and central auditory processing.',
    regions: [
      'cochlea',
      'inferior-colliculus',
      'medial-geniculate-nucleus',
      'left-primary-auditory-cortex',
      'right-primary-auditory-cortex',
    ],
  },
  {
    id: 'somatosensory',
    name: 'Somatosensory system',
    description:
      'Structures involved in processing tactile, proprioceptive and related bodily sensory information.',
    regions: [
      'dorsal-root-ganglion',
      'ventral-posterior-nucleus',
      'left-primary-somatosensory-cortex',
      'right-primary-somatosensory-cortex',
      'left-posterior-parietal-cortex',
      'right-posterior-parietal-cortex',
    ],
  },
  {
    id: 'motor',
    name: 'Motor system',
    description:
      'Distributed structures involved in movement planning, selection, execution and adaptation.',
    regions: [
      'left-primary-motor-cortex',
      'right-primary-motor-cortex',
      'left-premotor-cortex',
      'right-premotor-cortex',
      'basal-ganglia',
      'caudate-nucleus',
      'putamen',
      'globus-pallidus',
      'substantia-nigra',
      'subthalamus',
      'cerebellum',
      'cerebellar-cortex',
      'dentate-nucleus',
      'spinal-cord',
    ],
  },
  {
    id: 'memory',
    name: 'Memory system',
    description: 'Structures participating in memory encoding, consolidation and retrieval.',
    regions: [
      'hippocampal-formation',
      'left-hippocampus',
      'right-hippocampus',
      'entorhinal-cortex',
      'subiculum',
      'fornix',
      'left-prefrontal-cortex',
      'right-prefrontal-cortex',
    ],
  },
  {
    id: 'limbic',
    name: 'Limbic-related network',
    description:
      'A conceptual grouping of structures involved in emotion, motivation, memory and homeostatic regulation. The term does not imply a universally agreed anatomical boundary.',
    regions: [
      'left-amygdala',
      'right-amygdala',
      'hippocampal-formation',
      'hypothalamus',
      'epithalamus',
      'left-insula',
      'right-insula',
    ],
  },
  {
    id: 'executive',
    name: 'Executive control network',
    description:
      'A broad functional grouping involved in goal maintenance, working memory, cognitive control and behavioral regulation.',
    regions: [
      'left-prefrontal-cortex',
      'right-prefrontal-cortex',
      'left-posterior-parietal-cortex',
      'right-posterior-parietal-cortex',
      'left-premotor-cortex',
      'right-premotor-cortex',
    ],
  },
  {
    id: 'autonomic',
    name: 'Autonomic regulation system',
    description:
      'Central and peripheral structures involved in regulating involuntary physiological functions.',
    regions: [
      'hypothalamus',
      'medulla-oblongata',
      'pons',
      'reticular-formation',
      'autonomic-nervous-system',
      'spinal-cord',
    ],
  },
] as const satisfies readonly FunctionalSystem[];

export function getFunctionalSystem(id: FunctionalSystemId): FunctionalSystem | undefined {
  return functionalSystems.find((system) => system.id === id);
}

export function getSystemsForRegion(regionId: RegionId): readonly FunctionalSystem[] {
  return functionalSystems.filter((system) => system.regions.some((id) => id === regionId));
}

export function getRegionsForSystem(systemId: FunctionalSystemId): readonly RegionId[] {
  return getFunctionalSystem(systemId)?.regions ?? [];
}

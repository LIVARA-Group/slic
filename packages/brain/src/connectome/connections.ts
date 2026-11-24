import type { Evidence } from '../shared/types.js';
import type { ConnectionDefinition } from './types.js';

const anatomicalReview = {
  level: 'established',
  kind: 'review',
  sources: [],
  note: 'Curated conceptual baseline. Specific dataset provenance has not yet been attached.',
} as const satisfies Evidence;

export const connections = [
  // Visual pathways

  {
    id: 'retina-to-lgn',
    from: 'retina',
    to: 'lateral-geniculate-nucleus',
    kind: 'sensory_relay',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Retinal ganglion cell projections to the lateral geniculate nucleus.',
  },
  {
    id: 'lgn-to-primary-visual-cortex',
    from: 'lateral-geniculate-nucleus',
    to: 'left-primary-visual-cortex',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description:
      'Geniculostriate projection to primary visual cortex. The current model represents a simplified hemispheric endpoint.',
  },
  {
    id: 'retina-to-superior-colliculus',
    from: 'retina',
    to: 'superior-colliculus',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Retinal projections contributing to visual orienting pathways.',
  },
  {
    id: 'superior-colliculus-to-brainstem',
    from: 'superior-colliculus',
    to: 'brainstem',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description:
      'Descending orienting-related projections from the superior colliculus to brainstem networks.',
  },

  // Auditory pathways

  {
    id: 'cochlea-to-inferior-colliculus',
    from: 'cochlea',
    to: 'inferior-colliculus',
    kind: 'sensory_relay',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description:
      'Simplified ascending auditory pathway representation. Intermediate auditory nuclei are omitted.',
  },
  {
    id: 'inferior-colliculus-to-mgn',
    from: 'inferior-colliculus',
    to: 'medial-geniculate-nucleus',
    kind: 'sensory_relay',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Ascending auditory projection to the medial geniculate complex.',
  },
  {
    id: 'mgn-to-primary-auditory-cortex',
    from: 'medial-geniculate-nucleus',
    to: 'left-primary-auditory-cortex',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Thalamocortical auditory projection to primary auditory cortex.',
  },

  // Somatosensory pathways

  {
    id: 'drg-to-ventral-posterior-nucleus',
    from: 'dorsal-root-ganglion',
    to: 'ventral-posterior-nucleus',
    kind: 'sensory_relay',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Simplified ascending somatosensory pathway representation.',
  },
  {
    id: 'ventral-posterior-to-s1',
    from: 'ventral-posterior-nucleus',
    to: 'left-primary-somatosensory-cortex',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Thalamocortical somatosensory projection to primary somatosensory cortex.',
  },
  {
    id: 's1-to-posterior-parietal',
    from: 'left-primary-somatosensory-cortex',
    to: 'left-posterior-parietal-cortex',
    kind: 'association',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description:
      'Cortical association pathway contributing to higher-order somatosensory integration.',
  },

  // Motor pathways

  {
    id: 'premotor-to-m1',
    from: 'left-premotor-cortex',
    to: 'left-primary-motor-cortex',
    kind: 'association',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Premotor cortical projections involved in movement preparation and execution.',
  },
  {
    id: 'm1-to-spinal-cord',
    from: 'left-primary-motor-cortex',
    to: 'spinal-cord',
    kind: 'motor_pathway',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Simplified corticospinal projection from primary motor cortex to spinal cord.',
  },
  {
    id: 'cortex-to-striatum',
    from: 'left-prefrontal-cortex',
    to: 'caudate-nucleus',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description:
      'Corticostriatal projection representing one component of associative basal ganglia circuits.',
  },
  {
    id: 'striatum-to-globus-pallidus',
    from: 'caudate-nucleus',
    to: 'globus-pallidus',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description:
      'Striatopallidal projection. The model does not encode its neurotransmitter or physiological effect.',
  },
  {
    id: 'substantia-nigra-to-striatum',
    from: 'substantia-nigra',
    to: 'putamen',
    kind: 'modulatory',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Nigrostriatal projection represented at a conceptual level.',
  },
  {
    id: 'globus-pallidus-to-thalamus',
    from: 'globus-pallidus',
    to: 'thalamus',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Pallidothalamic output contributing to basal ganglia-thalamocortical circuits.',
  },
  {
    id: 'thalamus-to-motor-cortex',
    from: 'thalamus',
    to: 'left-primary-motor-cortex',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Thalamocortical projection contributing to motor circuit activity.',
  },

  // Hippocampal and memory-related pathways

  {
    id: 'entorhinal-to-hippocampus',
    from: 'entorhinal-cortex',
    to: 'left-hippocampus',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Entorhinal projections into hippocampal circuitry.',
  },
  {
    id: 'hippocampus-to-subiculum',
    from: 'left-hippocampus',
    to: 'subiculum',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Simplified hippocampal output through subicular circuitry.',
  },
  {
    id: 'subiculum-to-fornix',
    from: 'subiculum',
    to: 'fornix',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Hippocampal formation output associated with the fornix.',
  },
  {
    id: 'amygdala-to-hypothalamus',
    from: 'left-amygdala',
    to: 'hypothalamus',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Amygdala projections contributing to autonomic and behavioral responses.',
  },

  // Cerebellar pathways

  {
    id: 'cerebellar-cortex-to-dentate',
    from: 'cerebellar-cortex',
    to: 'dentate-nucleus',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Cerebellar cortical output to a deep cerebellar nucleus.',
  },
  {
    id: 'dentate-to-thalamus',
    from: 'dentate-nucleus',
    to: 'thalamus',
    kind: 'projection',
    direction: 'directed',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description: 'Cerebellothalamic projection represented as a simplified pathway.',
  },

  // Distributed and interhemispheric relationships

  {
    id: 'left-to-right-hemisphere',
    from: 'left-hemisphere',
    to: 'right-hemisphere',
    kind: 'commissural',
    direction: 'bidirectional',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description:
      'Interhemispheric connectivity represented at a broad conceptual level. Specific commissural tracts are not resolved here.',
  },
  {
    id: 'prefrontal-to-posterior-parietal',
    from: 'left-prefrontal-cortex',
    to: 'left-posterior-parietal-cortex',
    kind: 'association',
    direction: 'bidirectional',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description:
      'Frontoparietal association relationship involved in executive control and attention.',
  },
  {
    id: 'prefrontal-to-amygdala',
    from: 'left-prefrontal-cortex',
    to: 'left-amygdala',
    kind: 'association',
    direction: 'bidirectional',
    evidenceStatus: 'curated_baseline',
    evidence: anatomicalReview,
    description:
      'Prefrontal-amygdala interaction represented as a distributed functional relationship.',
  },
] as const satisfies readonly ConnectionDefinition[];

export type ConnectionId = (typeof connections)[number]['id'];

export function getConnection(id: ConnectionId): (typeof connections)[number] | undefined {
  return connections.find((connection) => connection.id === id);
}

export type CognitiveProcessKind =
  | 'perception'
  | 'attention'
  | 'working-memory'
  | 'encoding'
  | 'consolidation'
  | 'retrieval'
  | 'language'
  | 'planning'
  | 'decision'
  | 'emotion'
  | 'motor-planning'
  | 'motor-execution';

export interface CognitiveProcessDefinition {
  readonly kind: CognitiveProcessKind;
  readonly name: string;
  readonly description: string;
  readonly participatingSystems: readonly string[];
  readonly candidateRegions: readonly string[];
  readonly caveat: string;
}

export const cognitiveProcesses = {
  visualPerception: {
    kind: 'perception',
    name: 'Visual perception',
    description: 'Transforming retinal input into increasingly structured visual representations.',
    participatingSystems: ['visual'],
    candidateRegions: [
      'retina',
      'lateral_geniculate_nucleus',
      'primary_visual_cortex',
      'visual_association_cortex',
    ],
    caveat:
      'This is a distributed process; the listed regions are a curated route, not a complete account.',
  },
  selectiveAttention: {
    kind: 'attention',
    name: 'Selective attention',
    description: 'Prioritizing information for further processing.',
    participatingSystems: ['executive', 'visual', 'somatosensory'],
    candidateRegions: [
      'thalamus',
      'posterior_parietal_cortex',
      'prefrontal_cortex',
      'cingulate_cortex',
    ],
    caveat: 'Attention is implemented by interacting networks and neuromodulatory systems.',
  },
  workingMemory: {
    kind: 'working-memory',
    name: 'Working memory',
    description: 'Maintaining and manipulating information over short intervals.',
    participatingSystems: ['executive'],
    candidateRegions: ['dorsolateral_prefrontal_cortex', 'posterior_parietal_cortex'],
    caveat:
      'Working memory is not stored in one frontal-lobe box; it recruits distributed sensory and association circuits.',
  },
  episodicMemory: {
    kind: 'encoding',
    name: 'Episodic memory encoding and retrieval',
    description: 'Binding event-related information and supporting later recollection.',
    participatingSystems: ['memory'],
    candidateRegions: [
      'entorhinal_cortex',
      'hippocampus',
      'parahippocampal_cortex',
      'prefrontal_cortex',
    ],
    caveat: 'The hippocampal formation interacts with distributed neocortical representations.',
  },
  actionSelection: {
    kind: 'decision',
    name: 'Action selection',
    description: 'Selecting actions using goals, context, learned values and current state.',
    participatingSystems: ['motor', 'executive', 'limbic'],
    candidateRegions: [
      'prefrontal_cortex',
      'striatum',
      'globus_pallidus',
      'subthalamic_nucleus',
      'thalamus',
    ],
    caveat:
      'Basal ganglia loops are simplified here; multiple parallel loops and cell populations are involved.',
  },
  motorExecution: {
    kind: 'motor-execution',
    name: 'Voluntary motor execution',
    description: 'Converting motor plans into descending commands and coordinated movement.',
    participatingSystems: ['motor'],
    candidateRegions: ['premotor_cortex', 'primary_motor_cortex', 'spinal_cord', 'cerebellum'],
    caveat:
      'This model does not represent motor units, spinal interneurons, muscles or biomechanics.',
  },
} as const satisfies Record<string, CognitiveProcessDefinition>;

export type CognitiveProcessId = keyof typeof cognitiveProcesses;

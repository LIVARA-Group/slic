import type { Evidence } from '../shared/types.js';
import type { CognitiveProcessDefinition } from './types.js';

const reviewEvidence = {
  level: 'established',
  kind: 'review',
  sources: [],
  note: 'Distributed functional model. Specific contributions vary by task and context.',
} as const satisfies Evidence;

export const cognitiveProcesses = [
  {
    id: 'visual-perception',
    name: 'Visual perception',
    category: 'perception',
    description:
      'Processing and interpretation of visual information through distributed retinal, subcortical and cortical pathways.',
    candidateRegions: [
      'retina',
      'lateral-geniculate-nucleus',
      'superior-colliculus',
      'left-primary-visual-cortex',
      'right-primary-visual-cortex',
    ],
    participatingSystems: ['visual'],
    evidence: reviewEvidence,
    limitations:
      'Visual perception involves distributed cortical and subcortical networks beyond the listed structures.',
  },
  {
    id: 'auditory-perception',
    name: 'Auditory perception',
    category: 'perception',
    description:
      'Processing of sound-related information through ascending auditory pathways and cortical networks.',
    candidateRegions: [
      'cochlea',
      'inferior-colliculus',
      'medial-geniculate-nucleus',
      'left-primary-auditory-cortex',
      'right-primary-auditory-cortex',
    ],
    participatingSystems: ['auditory'],
    evidence: reviewEvidence,
  },
  {
    id: 'somatosensory-processing',
    name: 'Somatosensory processing',
    category: 'perception',
    description: 'Processing of tactile, proprioceptive and related bodily sensory information.',
    candidateRegions: [
      'dorsal-root-ganglion',
      'ventral-posterior-nucleus',
      'left-primary-somatosensory-cortex',
      'right-primary-somatosensory-cortex',
      'left-posterior-parietal-cortex',
      'right-posterior-parietal-cortex',
    ],
    participatingSystems: ['somatosensory'],
    evidence: reviewEvidence,
  },
  {
    id: 'selective-attention',
    name: 'Selective attention',
    category: 'attention',
    description:
      'Selection and prioritization of information for further processing through distributed attention-related networks.',
    candidateRegions: [
      'left-prefrontal-cortex',
      'right-prefrontal-cortex',
      'left-posterior-parietal-cortex',
      'right-posterior-parietal-cortex',
      'superior-colliculus',
      'left-insula',
      'right-insula',
    ],
    participatingSystems: ['executive', 'visual', 'somatosensory'],
    evidence: reviewEvidence,
    limitations:
      'Attention is not localized to one structure; the candidate list represents only selected components.',
  },
  {
    id: 'episodic-memory-formation',
    name: 'Episodic memory formation',
    category: 'memory',
    description:
      'Formation and organization of memories for personally experienced events, involving medial temporal and distributed cortical systems.',
    candidateRegions: [
      'hippocampal-formation',
      'left-hippocampus',
      'right-hippocampus',
      'entorhinal-cortex',
      'subiculum',
      'left-prefrontal-cortex',
      'right-prefrontal-cortex',
    ],
    participatingSystems: ['memory', 'executive'],
    evidence: reviewEvidence,
    limitations:
      'Memory formation is distributed and depends on the type of information, task and time scale.',
  },
  {
    id: 'executive-control',
    name: 'Executive control',
    category: 'executive',
    description:
      'Goal maintenance, planning, monitoring and regulation of behavior in relation to task demands.',
    candidateRegions: [
      'left-prefrontal-cortex',
      'right-prefrontal-cortex',
      'left-posterior-parietal-cortex',
      'right-posterior-parietal-cortex',
      'left-insula',
      'right-insula',
    ],
    participatingSystems: ['executive'],
    evidence: reviewEvidence,
  },
  {
    id: 'language-production',
    name: 'Language production',
    category: 'language',
    description:
      'A distributed process involving language-related frontal, temporal and other cortical regions.',
    candidateRegions: ['left-broca-area', 'left-primary-auditory-cortex', 'left-prefrontal-cortex'],
    participatingSystems: ['auditory', 'executive'],
    evidence: reviewEvidence,
    limitations:
      'Language production is not reducible to Broca area; this entry represents a deliberately simplified model.',
  },
  {
    id: 'emotional-processing',
    name: 'Emotional processing',
    category: 'emotion',
    description:
      'Distributed processing involving emotional learning, salience, interoception and autonomic regulation.',
    candidateRegions: [
      'left-amygdala',
      'right-amygdala',
      'left-insula',
      'right-insula',
      'hypothalamus',
      'left-prefrontal-cortex',
      'right-prefrontal-cortex',
    ],
    participatingSystems: ['limbic', 'autonomic', 'executive'],
    evidence: reviewEvidence,
    limitations:
      'The term limbic system is used here as a functional grouping, not as a universally agreed anatomical unit.',
  },
  {
    id: 'motor-planning',
    name: 'Motor planning',
    category: 'motor',
    description:
      'Preparation and organization of intended movement through cortical, basal ganglia and cerebellar networks.',
    candidateRegions: [
      'left-premotor-cortex',
      'right-premotor-cortex',
      'left-primary-motor-cortex',
      'right-primary-motor-cortex',
      'basal-ganglia',
      'cerebellum',
    ],
    participatingSystems: ['motor', 'executive'],
    evidence: reviewEvidence,
  },
  {
    id: 'autonomic-regulation',
    name: 'Autonomic regulation',
    category: 'autonomic',
    description:
      'Regulation of involuntary physiological functions through central and peripheral autonomic networks.',
    candidateRegions: [
      'hypothalamus',
      'medulla-oblongata',
      'pons',
      'reticular-formation',
      'autonomic-nervous-system',
    ],
    participatingSystems: ['autonomic'],
    evidence: reviewEvidence,
  },
] as const satisfies readonly CognitiveProcessDefinition[];

export type CognitiveProcessId = (typeof cognitiveProcesses)[number]['id'];

export function getCognitiveProcess(
  id: CognitiveProcessId,
): (typeof cognitiveProcesses)[number] | undefined {
  return cognitiveProcesses.find((process) => process.id === id);
}

export function findCognitiveProcessesByRegion(
  regionId: string,
): readonly (typeof cognitiveProcesses)[number][] {
  return cognitiveProcesses.filter((process) =>
    process.candidateRegions.some((candidate) => candidate === regionId),
  );
}

export function findCognitiveProcessesByCategory(
  category: CognitiveProcessDefinition['category'],
): readonly CognitiveProcessDefinition[] {
  return cognitiveProcesses.filter((process) => process.category === category);
}

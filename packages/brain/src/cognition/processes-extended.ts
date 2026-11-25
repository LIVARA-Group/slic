
import type { Evidence } from '../shared/types.js';
import type { CognitiveProcessDefinition } from './types.js';

const importedProcessEvidence = {
  level: 'moderate',
  kind: 'review',
  sources: [],
  note: 'Distributed functional model imported from the SLIC prototype. Specific contributions vary by task and context.',
} as const satisfies Evidence;

export const extendedCognitiveProcesses = [
  {
    id: 'working-memory-network',
    name: 'Working memory network',
    category: 'memory',
    description:
      'Distributed process imported from the SLIC prototype (Working memory; schema role: STM). Modulators: dopamine, noradrenaline.',
    candidateRegions: [
      'dorsolateral-prefrontal-cortex',
      'left-posterior-parietal-cortex',
      'mediodorsal-nucleus',
    ],
    participatingSystems: ['executive', 'memory'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'visual-object-recognition',
    name: 'Visual object recognition',
    category: 'perception',
    description:
      'Distributed process imported from the SLIC prototype (Visual recognition; schema role: LTM (visual)). Modulators: acetylcholine.',
    candidateRegions: [
      'left-primary-visual-cortex',
      'visual-area-v4',
      'fusiform-gyrus',
      'inferior-temporal-cortex',
    ],
    participatingSystems: ['visual'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'semantic-knowledge-network',
    name: 'Semantic knowledge network',
    category: 'memory',
    description:
      'Distributed process imported from the SLIC prototype (Knowledge and meaning; schema role: LTM (knowledge)). Modulators: none specified.',
    candidateRegions: ['anterior-temporal-lobe', 'inferior-temporal-cortex', 'wernicke-area'],
    participatingSystems: ['memory'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'episodic-memory-network',
    name: 'Episodic memory network',
    category: 'memory',
    description:
      'Distributed process imported from the SLIC prototype (Episodic memory; schema role: LTM (episode)). Modulators: acetylcholine, noradrenaline.',
    candidateRegions: ['left-hippocampus', 'entorhinal-cortex', 'posterior-cingulate-cortex'],
    participatingSystems: ['memory'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'language-comprehension',
    name: 'Language comprehension',
    category: 'language',
    description:
      'Distributed process imported from the SLIC prototype (Language comprehension; schema role: Perception). Modulators: none specified.',
    candidateRegions: ['left-primary-auditory-cortex', 'wernicke-area', 'inferior-parietal-lobule'],
    participatingSystems: ['auditory', 'executive'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'speech-planning',
    name: 'Speech planning',
    category: 'language',
    description:
      'Distributed process imported from the SLIC prototype (Speech preparation; schema role: Action). Modulators: none specified.',
    candidateRegions: ['wernicke-area', 'left-broca-area', 'left-primary-motor-cortex'],
    participatingSystems: ['motor', 'executive'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'attention-network',
    name: 'Attention network',
    category: 'attention',
    description:
      'Distributed process imported from the SLIC prototype (Attention; schema role: Attention switch). Modulators: noradrenaline, acetylcholine.',
    candidateRegions: [
      'anterior-cingulate-cortex',
      'left-posterior-parietal-cortex',
      'pulvinar',
      'locus-coeruleus',
    ],
    participatingSystems: ['executive'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'fear-response',
    name: 'Fear response',
    category: 'emotion',
    description:
      'Distributed process imported from the SLIC prototype (Fear; schema role: Conscious/Survival). Modulators: noradrenaline.',
    candidateRegions: ['left-amygdala', 'periaqueductal-gray', 'hypothalamus'],
    participatingSystems: ['limbic', 'autonomic'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'emotion-regulation',
    name: 'Emotion regulation',
    category: 'emotion',
    description:
      'Distributed process imported from the SLIC prototype (Emotion regulation; schema role: Conscious engine). Modulators: serotonin.',
    candidateRegions: [
      'ventromedial-prefrontal-cortex',
      'dorsolateral-prefrontal-cortex',
      'left-amygdala',
    ],
    participatingSystems: ['limbic', 'executive'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'reward-and-motivation',
    name: 'Reward and motivation',
    category: 'emotion',
    description:
      'Distributed process imported from the SLIC prototype (Reward and motivation; schema role: Conscious engine). Modulators: dopamine.',
    candidateRegions: ['ventral-tegmental-area', 'nucleus-accumbens', 'orbitofrontal-cortex'],
    participatingSystems: ['limbic'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'decision-making',
    name: 'Decision making',
    category: 'executive',
    description:
      'Distributed process imported from the SLIC prototype (Decision making; schema role: Conscious engine). Modulators: dopamine.',
    candidateRegions: [
      'dorsolateral-prefrontal-cortex',
      'orbitofrontal-cortex',
      'anterior-cingulate-cortex',
      'caudate-nucleus',
    ],
    participatingSystems: ['executive'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'motor-planning-network',
    name: 'Motor planning network',
    category: 'motor',
    description:
      'Distributed process imported from the SLIC prototype (Motor planning; schema role: Action drive). Modulators: dopamine.',
    candidateRegions: [
      'left-premotor-cortex',
      'supplementary-motor-area',
      'left-posterior-parietal-cortex',
      'ventral-lateral-nucleus',
    ],
    participatingSystems: ['motor'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'motor-execution',
    name: 'Motor execution',
    category: 'motor',
    description:
      'Distributed process imported from the SLIC prototype (Motor execution; schema role: Muscle servos). Modulators: none specified.',
    candidateRegions: ['left-primary-motor-cortex', 'ventral-horn', 'skeletal-muscles'],
    participatingSystems: ['motor'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
  {
    id: 'pain-processing',
    name: 'Pain processing',
    category: 'perception',
    description:
      'Distributed process imported from the SLIC prototype (Pain; schema role: Sensory pathway). Modulators: none specified.',
    candidateRegions: [
      'dorsal-horn',
      'ventral-posterior-nucleus',
      'left-primary-somatosensory-cortex',
      'left-amygdala',
    ],
    participatingSystems: ['somatosensory', 'limbic'],
    evidence: importedProcessEvidence,
    limitations:
      'Co-activation of listed regions is a simplified abstraction; contributions vary by task and context.',
  },
] as const satisfies readonly CognitiveProcessDefinition[];

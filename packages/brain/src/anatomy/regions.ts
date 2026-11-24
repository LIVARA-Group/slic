import type { BrainStructure } from './types.js';

const establishedReview = {
  level: 'established',
  kind: 'review',
  sources: [],
} as const;

export const brainStructures: readonly BrainStructure[] = [
  {
    id: 'nervous-system',
    name: 'Nervous system',
    kind: 'system',
    system: 'nervous',
    laterality: 'bilateral',
    parentId: null,
    description:
      'The biological system responsible for neural signaling, sensory processing, motor control and physiological regulation.',
    evidence: establishedReview,
  },
  {
    id: 'central-nervous-system',
    name: 'Central nervous system',
    kind: 'subsystem',
    system: 'central_nervous',
    laterality: 'bilateral',
    parentId: 'nervous-system',
    description: 'The central nervous system consists of the brain and spinal cord.',
    evidence: establishedReview,
  },
  {
    id: 'peripheral-nervous-system',
    name: 'Peripheral nervous system',
    kind: 'subsystem',
    system: 'peripheral_nervous',
    laterality: 'bilateral',
    parentId: 'nervous-system',
    description:
      'Neural structures outside the brain and spinal cord, including peripheral nerves and ganglia.',
    evidence: establishedReview,
  },
  {
    id: 'sensory-boundaries',
    name: 'Sensory boundaries',
    kind: 'subsystem',
    system: 'sensory',
    laterality: 'bilateral',
    parentId: null,
    description:
      'Conceptual grouping of peripheral sensory interfaces included to represent input boundaries. It is not a formal anatomical division of the nervous system.',
    evidence: establishedReview,
  },
  {
    id: 'brain',
    name: 'Brain',
    kind: 'organ',
    system: 'central_nervous',
    laterality: 'bilateral',
    parentId: 'central-nervous-system',
    description:
      'The central organ of the nervous system, integrating sensory information and coordinating cognitive, autonomic and motor functions.',
    evidence: establishedReview,
  },
  {
    id: 'spinal-cord',
    name: 'Spinal cord',
    kind: 'organ',
    system: 'central_nervous',
    laterality: 'bilateral',
    parentId: 'central-nervous-system',
    description:
      'A central nervous system structure that conducts information between the brain and body and supports spinal reflexes.',
    evidence: establishedReview,
  },

  // Major brain divisions

  {
    id: 'forebrain',
    name: 'Forebrain',
    kind: 'division',
    system: 'central_nervous',
    laterality: 'bilateral',
    parentId: 'brain',
    description:
      'The anterior major division of the brain, including the telencephalon and diencephalon.',
    evidence: establishedReview,
  },
  {
    id: 'midbrain',
    name: 'Midbrain',
    kind: 'division',
    system: 'central_nervous',
    laterality: 'midline',
    parentId: 'brainstem',
    description:
      'The mesencephalon, involved in sensory and motor integration, orienting responses and arousal.',
    evidence: establishedReview,
  },
  {
    id: 'hindbrain',
    name: 'Hindbrain',
    kind: 'division',
    system: 'central_nervous',
    laterality: 'midline',
    parentId: 'brain',
    description: 'The rhombencephalon, including the pons, medulla and cerebellum.',
    evidence: establishedReview,
  },
  {
    id: 'brainstem',
    name: 'Brainstem',
    kind: 'division',
    system: 'central_nervous',
    laterality: 'midline',
    parentId: 'brain',
    description: 'The brainstem comprises the midbrain, pons and medulla oblongata.',
    evidence: establishedReview,
  },
  {
    id: 'cerebrum',
    name: 'Cerebrum',
    kind: 'division',
    system: 'central_nervous',
    laterality: 'bilateral',
    parentId: 'forebrain',
    description:
      'The largest brain division, comprising the cerebral hemispheres and their associated structures.',
    evidence: establishedReview,
  },
  {
    id: 'diencephalon',
    name: 'Diencephalon',
    kind: 'division',
    system: 'central_nervous',
    laterality: 'midline',
    parentId: 'forebrain',
    description:
      'A forebrain division containing the thalamus, hypothalamus, epithalamus and subthalamus.',
    evidence: establishedReview,
  },

  // Cerebral hemispheres

  {
    id: 'left-hemisphere',
    name: 'Left cerebral hemisphere',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'cerebrum',
    description: 'The left cerebral hemisphere, containing cortical and subcortical structures.',
    evidence: establishedReview,
  },
  {
    id: 'right-hemisphere',
    name: 'Right cerebral hemisphere',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'cerebrum',
    description: 'The right cerebral hemisphere, containing cortical and subcortical structures.',
    evidence: establishedReview,
  },

  // Left cortical lobes

  {
    id: 'left-frontal-lobe',
    name: 'Left frontal lobe',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-hemisphere',
    description:
      'The left frontal lobe, associated with motor control, executive functions and aspects of language.',
    evidence: establishedReview,
  },
  {
    id: 'left-parietal-lobe',
    name: 'Left parietal lobe',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-hemisphere',
    description:
      'The left parietal lobe, involved in somatosensory processing and spatial and sensorimotor integration.',
    evidence: establishedReview,
  },
  {
    id: 'left-temporal-lobe',
    name: 'Left temporal lobe',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-hemisphere',
    description:
      'The left temporal lobe, contributing to auditory processing, language and memory.',
    evidence: establishedReview,
  },
  {
    id: 'left-occipital-lobe',
    name: 'Left occipital lobe',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-hemisphere',
    description: 'The left occipital lobe, containing visual cortical areas.',
    evidence: establishedReview,
  },
  {
    id: 'left-insula',
    name: 'Left insula',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-hemisphere',
    description:
      'The left insular cortex, contributing to interoception, salience processing and integration of bodily and cognitive information.',
    evidence: establishedReview,
  },

  // Right cortical lobes

  {
    id: 'right-frontal-lobe',
    name: 'Right frontal lobe',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'right-hemisphere',
    description:
      'The right frontal lobe, involved in motor control, executive functions and behavioral regulation.',
    evidence: establishedReview,
  },
  {
    id: 'right-parietal-lobe',
    name: 'Right parietal lobe',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'right-hemisphere',
    description:
      'The right parietal lobe, contributing to spatial attention and somatosensory integration.',
    evidence: establishedReview,
  },
  {
    id: 'right-temporal-lobe',
    name: 'Right temporal lobe',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'right-hemisphere',
    description:
      'The right temporal lobe, contributing to auditory processing, memory and aspects of social perception.',
    evidence: establishedReview,
  },
  {
    id: 'right-occipital-lobe',
    name: 'Right occipital lobe',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'right-hemisphere',
    description: 'The right occipital lobe, containing visual cortical areas.',
    evidence: establishedReview,
  },
  {
    id: 'right-insula',
    name: 'Right insula',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'right-hemisphere',
    description:
      'The right insular cortex, contributing to interoception, salience processing and autonomic integration.',
    evidence: establishedReview,
  },

  // Frontal cortical structures

  {
    id: 'left-prefrontal-cortex',
    name: 'Left prefrontal cortex',
    kind: 'cortical_area',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-frontal-lobe',
    description:
      'A broad left prefrontal region involved in executive control, working memory and goal-directed behavior.',
    evidence: establishedReview,
  },
  {
    id: 'right-prefrontal-cortex',
    name: 'Right prefrontal cortex',
    kind: 'cortical_area',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'right-frontal-lobe',
    description:
      'A broad right prefrontal region involved in executive control, attention and behavioral regulation.',
    evidence: establishedReview,
  },
  {
    id: 'left-primary-motor-cortex',
    name: 'Left primary motor cortex',
    abbreviation: 'M1',
    kind: 'cortical_area',
    system: 'motor',
    laterality: 'left',
    parentId: 'left-frontal-lobe',
    description:
      'The left primary motor cortex, contributing to voluntary motor execution, predominantly controlling the contralateral body.',
    evidence: establishedReview,
  },
  {
    id: 'right-primary-motor-cortex',
    name: 'Right primary motor cortex',
    abbreviation: 'M1',
    kind: 'cortical_area',
    system: 'motor',
    laterality: 'right',
    parentId: 'right-frontal-lobe',
    description:
      'The right primary motor cortex, contributing to voluntary motor execution, predominantly controlling the contralateral body.',
    evidence: establishedReview,
  },
  {
    id: 'left-premotor-cortex',
    name: 'Left premotor cortex',
    kind: 'cortical_area',
    system: 'motor',
    laterality: 'left',
    parentId: 'left-frontal-lobe',
    description:
      'A lateral frontal motor region involved in movement preparation and sensorimotor transformations.',
    evidence: establishedReview,
  },
  {
    id: 'right-premotor-cortex',
    name: 'Right premotor cortex',
    kind: 'cortical_area',
    system: 'motor',
    laterality: 'right',
    parentId: 'right-frontal-lobe',
    description:
      'A lateral frontal motor region involved in movement preparation and sensorimotor transformations.',
    evidence: establishedReview,
  },
  {
    id: 'left-broca-area',
    name: 'Left Broca area',
    kind: 'cortical_area',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-frontal-lobe',
    description:
      'A language-related region in the left inferior frontal gyrus, with functions extending beyond speech production.',
    evidence: establishedReview,
  },

  // Parietal cortical structures

  {
    id: 'left-primary-somatosensory-cortex',
    name: 'Left primary somatosensory cortex',
    abbreviation: 'S1',
    kind: 'cortical_area',
    system: 'sensory',
    laterality: 'left',
    parentId: 'left-parietal-lobe',
    description:
      'The left primary somatosensory cortex, processing tactile and proprioceptive information from the contralateral body.',
    evidence: establishedReview,
  },
  {
    id: 'right-primary-somatosensory-cortex',
    name: 'Right primary somatosensory cortex',
    abbreviation: 'S1',
    kind: 'cortical_area',
    system: 'sensory',
    laterality: 'right',
    parentId: 'right-parietal-lobe',
    description:
      'The right primary somatosensory cortex, processing tactile and proprioceptive information from the contralateral body.',
    evidence: establishedReview,
  },
  {
    id: 'left-posterior-parietal-cortex',
    name: 'Left posterior parietal cortex',
    kind: 'cortical_area',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-parietal-lobe',
    description:
      'A region involved in multisensory integration, spatial representation and sensorimotor coordination.',
    evidence: establishedReview,
  },
  {
    id: 'right-posterior-parietal-cortex',
    name: 'Right posterior parietal cortex',
    kind: 'cortical_area',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'right-parietal-lobe',
    description:
      'A region involved in multisensory integration, spatial representation and sensorimotor coordination.',
    evidence: establishedReview,
  },

  // Temporal cortical structures

  {
    id: 'left-primary-auditory-cortex',
    name: 'Left primary auditory cortex',
    abbreviation: 'A1',
    kind: 'cortical_area',
    system: 'sensory',
    laterality: 'left',
    parentId: 'left-temporal-lobe',
    description:
      'The left primary auditory cortex, involved in the cortical processing of auditory information.',
    evidence: establishedReview,
  },
  {
    id: 'right-primary-auditory-cortex',
    name: 'Right primary auditory cortex',
    abbreviation: 'A1',
    kind: 'cortical_area',
    system: 'sensory',
    laterality: 'right',
    parentId: 'right-temporal-lobe',
    description:
      'The right primary auditory cortex, involved in the cortical processing of auditory information.',
    evidence: establishedReview,
  },
  {
    id: 'left-hippocampus',
    name: 'Left hippocampus',
    kind: 'subregion',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-temporal-lobe',
    description:
      'A medial temporal structure essential to several forms of memory formation and spatial representation.',
    evidence: establishedReview,
  },
  {
    id: 'right-hippocampus',
    name: 'Right hippocampus',
    kind: 'subregion',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'right-temporal-lobe',
    description:
      'A medial temporal structure essential to several forms of memory formation and spatial representation.',
    evidence: establishedReview,
  },
  {
    id: 'left-amygdala',
    name: 'Left amygdala',
    kind: 'nucleus',
    system: 'central_nervous',
    laterality: 'left',
    parentId: 'left-temporal-lobe',
    description:
      'A medial temporal nuclear complex involved in emotional learning and the processing of biologically relevant stimuli.',
    evidence: establishedReview,
  },
  {
    id: 'right-amygdala',
    name: 'Right amygdala',
    kind: 'nucleus',
    system: 'central_nervous',
    laterality: 'right',
    parentId: 'right-temporal-lobe',
    description:
      'A medial temporal nuclear complex involved in emotional learning and the processing of biologically relevant stimuli.',
    evidence: establishedReview,
  },

  // Occipital cortical structures

  {
    id: 'left-primary-visual-cortex',
    name: 'Left primary visual cortex',
    abbreviation: 'V1',
    kind: 'cortical_area',
    system: 'sensory',
    laterality: 'left',
    parentId: 'left-occipital-lobe',
    description:
      'The left primary visual cortex, receiving visual information through thalamocortical pathways.',
    evidence: establishedReview,
  },
  {
    id: 'right-primary-visual-cortex',
    name: 'Right primary visual cortex',
    abbreviation: 'V1',
    kind: 'cortical_area',
    system: 'sensory',
    laterality: 'right',
    parentId: 'right-occipital-lobe',
    description:
      'The right primary visual cortex, receiving visual information through thalamocortical pathways.',
    evidence: establishedReview,
  },

  // Diencephalon

  {
    id: 'thalamus',
    name: 'Thalamus',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'midline',
    parentId: 'diencephalon',
    description:
      'A set of diencephalic nuclei involved in sensory and motor information routing and broader cortical-subcortical interactions.',
    evidence: establishedReview,
  },
  {
    id: 'hypothalamus',
    name: 'Hypothalamus',
    kind: 'region',
    system: 'autonomic',
    laterality: 'midline',
    parentId: 'diencephalon',
    description:
      'A diencephalic region involved in homeostasis, endocrine regulation and autonomic control.',
    evidence: establishedReview,
  },
  {
    id: 'epithalamus',
    name: 'Epithalamus',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'midline',
    parentId: 'diencephalon',
    description: 'A diencephalic region including the habenular complex and pineal gland.',
    evidence: establishedReview,
  },
  {
    id: 'subthalamus',
    name: 'Subthalamus',
    kind: 'region',
    system: 'motor',
    laterality: 'midline',
    parentId: 'diencephalon',
    description:
      'A diencephalic region containing structures involved in basal ganglia motor circuits.',
    evidence: establishedReview,
  },

  // Basal ganglia

  {
    id: 'basal-ganglia',
    name: 'Basal ganglia',
    kind: 'subsystem',
    system: 'motor',
    laterality: 'bilateral',
    parentId: 'cerebrum',
    description:
      'A group of interconnected subcortical nuclei involved in action selection, movement and learning.',
    evidence: establishedReview,
  },
  {
    id: 'caudate-nucleus',
    name: 'Caudate nucleus',
    kind: 'nucleus',
    system: 'motor',
    laterality: 'bilateral',
    parentId: 'basal-ganglia',
    description: 'A striatal nucleus participating in associative and action-selection circuits.',
    evidence: establishedReview,
  },
  {
    id: 'putamen',
    name: 'Putamen',
    kind: 'nucleus',
    system: 'motor',
    laterality: 'bilateral',
    parentId: 'basal-ganglia',
    description: 'A striatal nucleus participating in sensorimotor and associative circuits.',
    evidence: establishedReview,
  },
  {
    id: 'globus-pallidus',
    name: 'Globus pallidus',
    kind: 'nucleus',
    system: 'motor',
    laterality: 'bilateral',
    parentId: 'basal-ganglia',
    description:
      'A basal ganglia structure involved in the regulation of thalamocortical activity.',
    evidence: establishedReview,
  },
  {
    id: 'substantia-nigra',
    name: 'Substantia nigra',
    kind: 'nucleus',
    system: 'motor',
    laterality: 'bilateral',
    parentId: 'midbrain',
    description:
      'A midbrain structure with important roles in basal ganglia circuits and dopaminergic modulation.',
    evidence: establishedReview,
  },

  // Brainstem

  {
    id: 'pons',
    name: 'Pons',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'midline',
    parentId: 'brainstem',
    description:
      'A brainstem region involved in communication with the cerebellum and in multiple cranial and autonomic functions.',
    evidence: establishedReview,
  },
  {
    id: 'medulla-oblongata',
    name: 'Medulla oblongata',
    kind: 'region',
    system: 'autonomic',
    laterality: 'midline',
    parentId: 'brainstem',
    description:
      'A brainstem region containing nuclei and networks important for vital autonomic functions.',
    evidence: establishedReview,
  },
  {
    id: 'reticular-formation',
    name: 'Reticular formation',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'midline',
    parentId: 'brainstem',
    description:
      'A distributed brainstem network involved in arousal, autonomic regulation and motor functions.',
    evidence: establishedReview,
  },
  {
    id: 'superior-colliculus',
    name: 'Superior colliculus',
    kind: 'nucleus',
    system: 'sensory',
    laterality: 'bilateral',
    parentId: 'midbrain',
    description:
      'A midbrain structure involved in visual orienting and multisensory control of orienting responses.',
    evidence: establishedReview,
  },
  {
    id: 'inferior-colliculus',
    name: 'Inferior colliculus',
    kind: 'nucleus',
    system: 'sensory',
    laterality: 'bilateral',
    parentId: 'midbrain',
    description: 'A midbrain auditory structure participating in ascending auditory pathways.',
    evidence: establishedReview,
  },

  // Cerebellum

  {
    id: 'cerebellum',
    name: 'Cerebellum',
    kind: 'organ',
    system: 'motor',
    laterality: 'bilateral',
    parentId: 'hindbrain',
    description:
      'A hindbrain structure involved in coordination, motor adaptation, timing and several non-motor functions.',
    evidence: establishedReview,
  },
  {
    id: 'cerebellar-cortex',
    name: 'Cerebellar cortex',
    kind: 'region',
    system: 'motor',
    laterality: 'bilateral',
    parentId: 'cerebellum',
    description:
      'The layered cortical tissue of the cerebellum, involved in processing information within cerebellar circuits.',
    evidence: establishedReview,
  },
  {
    id: 'dentate-nucleus',
    name: 'Dentate nucleus',
    kind: 'nucleus',
    system: 'motor',
    laterality: 'bilateral',
    parentId: 'cerebellum',
    description: 'A deep cerebellar nucleus contributing to cerebellar output pathways.',
    evidence: establishedReview,
  },

  // Sensory interfaces and peripheral structures

  {
    id: 'retina',
    name: 'Retina',
    kind: 'region',
    system: 'sensory',
    laterality: 'bilateral',
    parentId: 'sensory-boundaries',
    description:
      'The light-sensitive neural tissue of the eye. Included as a sensory boundary, not as part of the brain.',
    evidence: establishedReview,
  },
  {
    id: 'lateral-geniculate-nucleus',
    name: 'Lateral geniculate nucleus',
    abbreviation: 'LGN',
    kind: 'nucleus',
    system: 'sensory',
    laterality: 'bilateral',
    parentId: 'thalamus',
    description: 'A thalamic relay nucleus in the principal geniculostriate visual pathway.',
    evidence: establishedReview,
  },
  {
    id: 'cochlea',
    name: 'Cochlea',
    kind: 'region',
    system: 'sensory',
    laterality: 'bilateral',
    parentId: 'sensory-boundaries',
    description:
      'The auditory sensory organ of the inner ear. Included as a sensory boundary, not as part of the brain.',
    evidence: establishedReview,
  },
  {
    id: 'medial-geniculate-nucleus',
    name: 'Medial geniculate nucleus',
    abbreviation: 'MGN',
    kind: 'nucleus',
    system: 'sensory',
    laterality: 'bilateral',
    parentId: 'thalamus',
    description: 'A thalamic relay complex participating in auditory pathways to the cortex.',
    evidence: establishedReview,
  },
  {
    id: 'dorsal-root-ganglion',
    name: 'Dorsal root ganglion',
    kind: 'ganglion',
    system: 'sensory',
    laterality: 'bilateral',
    parentId: 'peripheral-nervous-system',
    description:
      'A peripheral sensory ganglion containing cell bodies of many primary somatosensory neurons.',
    evidence: establishedReview,
  },
  {
    id: 'ventral-posterior-nucleus',
    name: 'Ventral posterior nucleus',
    kind: 'nucleus',
    system: 'sensory',
    laterality: 'bilateral',
    parentId: 'thalamus',
    description: 'A thalamic nuclear complex relaying somatosensory information to cortical areas.',
    evidence: establishedReview,
  },
  {
    id: 'hippocampal-formation',
    name: 'Hippocampal formation',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'bilateral',
    parentId: 'cerebrum',
    description:
      'A medial temporal system including the hippocampus and related cortical structures.',
    evidence: establishedReview,
  },
  {
    id: 'entorhinal-cortex',
    name: 'Entorhinal cortex',
    kind: 'region',
    system: 'central_nervous',
    laterality: 'bilateral',
    parentId: 'hippocampal-formation',
    description:
      'A medial temporal cortical region serving as a major interface between the hippocampal formation and neocortex.',
    evidence: establishedReview,
  },
  {
    id: 'subiculum',
    name: 'Subiculum',
    kind: 'subregion',
    system: 'central_nervous',
    laterality: 'bilateral',
    parentId: 'hippocampal-formation',
    description: 'A hippocampal formation subregion involved in hippocampal output pathways.',
    evidence: establishedReview,
  },
  {
    id: 'fornix',
    name: 'Fornix',
    kind: 'tract',
    system: 'central_nervous',
    laterality: 'bilateral',
    parentId: 'hippocampal-formation',
    description:
      'A major white matter pathway connecting the hippocampal formation with subcortical targets.',
    evidence: establishedReview,
  },
  {
    id: 'autonomic-nervous-system',
    name: 'Autonomic nervous system',
    kind: 'subsystem',
    system: 'autonomic',
    laterality: 'bilateral',
    parentId: 'peripheral-nervous-system',
    description:
      'The peripheral and central networks regulating involuntary physiological functions.',
    evidence: establishedReview,
  },
];

export type RegionId = (typeof brainStructures)[number]['id'];

export type BrainStructureDefinition = BrainStructure;

export const regions: Readonly<Record<string, BrainStructure>> = Object.freeze(
  Object.fromEntries(brainStructures.map((structure) => [structure.id, structure])),
);

export const brainStructureIds: readonly RegionId[] = brainStructures.map(
  (structure) => structure.id,
);

export const functionalSystems = {
  visual: {
    name: 'Visual system',
    modalities: ['visual'],
    regions: [
      'retina',
      'lateral_geniculate_nucleus',
      'primary_visual_cortex',
      'visual_association_cortex',
      'superior_colliculus',
    ],
    summary: 'Visual transduction, relay, cortical processing and orienting.',
  },
  auditory: {
    name: 'Auditory system',
    modalities: ['auditory'],
    regions: [
      'cochlea',
      'inferior_colliculus',
      'medial_geniculate_nucleus',
      'primary_auditory_cortex',
      'superior_temporal_gyrus',
    ],
    summary: 'Auditory transduction, ascending processing and cortical perception.',
  },
  somatosensory: {
    name: 'Somatosensory system',
    modalities: ['somatosensory'],
    regions: [
      'dorsal_root_ganglion',
      'spinal_cord',
      'ventral_posterior_nucleus',
      'primary_somatosensory_cortex',
      'posterior_parietal_cortex',
    ],
    summary: 'Somatic sensation and higher-order body/spatial integration.',
  },
  motor: {
    name: 'Motor system',
    modalities: ['motor'],
    regions: [
      'posterior_parietal_cortex',
      'premotor_cortex',
      'supplementary_motor_area',
      'primary_motor_cortex',
      'spinal_cord',
      'basal_ganglia',
      'cerebellum',
    ],
    summary: 'Planning, selection, coordination and execution of movement.',
  },
  memory: {
    name: 'Memory system',
    modalities: ['memory'],
    regions: [
      'hippocampal_formation',
      'hippocampus',
      'dentate_gyrus',
      'subiculum',
      'entorhinal_cortex',
      'parahippocampal_cortex',
      'prefrontal_cortex',
    ],
    summary: 'Distributed memory operations; not localized to one structure.',
  },
  limbic: {
    name: 'Limbic-related network',
    modalities: ['affect', 'motivation', 'memory'],
    regions: [
      'amygdala',
      'hippocampus',
      'cingulate_cortex',
      'hypothalamus',
      'nucleus_accumbens',
      'ventral_tegmental_area',
    ],
    summary: 'A practical network grouping; the term limbic system has multiple definitions.',
  },
  executive: {
    name: 'Executive control network (curated subset)',
    modalities: ['cognition'],
    regions: [
      'dorsolateral_prefrontal_cortex',
      'ventromedial_prefrontal_cortex',
      'orbitofrontal_cortex',
      'cingulate_cortex',
      'posterior_parietal_cortex',
    ],
    summary: 'Planning, working memory, valuation and cognitive control.',
  },
} as const;

export type FunctionalSystemId = keyof typeof functionalSystems;

export const corticalAreas = {
  primaryMotor: {
    name: 'Primary motor cortex',
    regionId: 'primary_motor_cortex',
    brodmann: ['4'],
    lobe: 'frontal',
  },
  primarySomatosensory: {
    name: 'Primary somatosensory cortex',
    regionId: 'primary_somatosensory_cortex',
    brodmann: ['3', '1', '2'],
    lobe: 'parietal',
  },
  primaryVisual: {
    name: 'Primary visual cortex',
    regionId: 'primary_visual_cortex',
    brodmann: ['17'],
    lobe: 'occipital',
  },
  primaryAuditory: {
    name: 'Primary auditory cortex',
    regionId: 'primary_auditory_cortex',
    brodmann: ['41', '42'],
    lobe: 'temporal',
  },
  brocaRelated: {
    name: 'Broca-related region',
    regionId: 'brocas_area',
    brodmann: ['44', '45'],
    lobe: 'frontal',
  },
} as const;

export type CorticalAreaId = keyof typeof corticalAreas;

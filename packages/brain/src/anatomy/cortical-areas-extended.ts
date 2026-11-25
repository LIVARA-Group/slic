import type { CorticalArea } from './cortical-areas.js';

export const extendedCorticalAreas = [
  {
    id: 'dorsolateral-prefrontal-cortex-field',
    name: 'Dorsolateral prefrontal cortex',
    regionId: 'dorsolateral-prefrontal-cortex',
    brodmannAreas: [9, 46],
    description:
      'Cortical field(s) of Dorsolateral prefrontal cortex. Hemisphere-specific split pending.',
  },
  {
    id: 'ventromedial-prefrontal-cortex-field',
    name: 'Ventromedial prefrontal cortex',
    regionId: 'ventromedial-prefrontal-cortex',
    brodmannAreas: [10, 11, 25],
    description:
      'Cortical field(s) of Ventromedial prefrontal cortex. Hemisphere-specific split pending.',
  },
  {
    id: 'orbitofrontal-cortex-field',
    name: 'Orbitofrontal cortex',
    regionId: 'orbitofrontal-cortex',
    brodmannAreas: [11, 13, 47],
    description: 'Cortical field(s) of Orbitofrontal cortex. Hemisphere-specific split pending.',
  },
  {
    id: 'frontopolar-cortex-field',
    name: 'Frontopolar cortex',
    regionId: 'frontopolar-cortex',
    brodmannAreas: [10],
    description: 'Cortical field(s) of Frontopolar cortex. Hemisphere-specific split pending.',
  },
  {
    id: 'supplementary-motor-area-field',
    name: 'Supplementary motor area',
    regionId: 'supplementary-motor-area',
    brodmannAreas: [6],
    description:
      'Cortical field(s) of Supplementary motor area. Hemisphere-specific split pending.',
  },
  {
    id: 'frontal-eye-fields-field',
    name: 'Frontal eye fields',
    regionId: 'frontal-eye-fields',
    brodmannAreas: [8],
    description: 'Cortical field(s) of Frontal eye fields. Hemisphere-specific split pending.',
  },
  {
    id: 'somatosensory-association-cortex-field',
    name: 'Somatosensory association cortex',
    regionId: 'somatosensory-association-cortex',
    brodmannAreas: [5, 7],
    description:
      'Cortical field(s) of Somatosensory association cortex. Hemisphere-specific split pending.',
  },
  {
    id: 'inferior-parietal-lobule-field',
    name: 'Inferior parietal lobule',
    regionId: 'inferior-parietal-lobule',
    brodmannAreas: [39, 40],
    description:
      'Cortical field(s) of Inferior parietal lobule. Hemisphere-specific split pending.',
  },
  {
    id: 'wernicke-area-field',
    name: "Wernicke's area",
    regionId: 'wernicke-area',
    brodmannAreas: [22],
    description: "Cortical field(s) of Wernicke's area. Hemisphere-specific split pending.",
  },
  {
    id: 'inferior-temporal-cortex-field',
    name: 'Inferior temporal cortex',
    regionId: 'inferior-temporal-cortex',
    brodmannAreas: [20, 21],
    description:
      'Cortical field(s) of Inferior temporal cortex. Hemisphere-specific split pending.',
  },
  {
    id: 'fusiform-gyrus-field',
    name: 'Fusiform gyrus',
    regionId: 'fusiform-gyrus',
    brodmannAreas: [37],
    description: 'Cortical field(s) of Fusiform gyrus. Hemisphere-specific split pending.',
  },
  {
    id: 'anterior-temporal-lobe-field',
    name: 'Anterior temporal lobe',
    regionId: 'anterior-temporal-lobe',
    brodmannAreas: [38],
    description: 'Cortical field(s) of Anterior temporal lobe. Hemisphere-specific split pending.',
  },
  {
    id: 'visual-area-v2-field',
    name: 'Visual area V2',
    regionId: 'visual-area-v2',
    brodmannAreas: [18],
    description: 'Cortical field(s) of Visual area V2. Hemisphere-specific split pending.',
  },
  {
    id: 'visual-area-v4-field',
    name: 'Visual area V4',
    regionId: 'visual-area-v4',
    brodmannAreas: [19],
    description: 'Cortical field(s) of Visual area V4. Hemisphere-specific split pending.',
  },
  {
    id: 'visual-area-v5-mt-field',
    name: 'Visual area V5/MT',
    regionId: 'visual-area-v5-mt',
    brodmannAreas: [19, 37],
    description: 'Cortical field(s) of Visual area V5/MT. Hemisphere-specific split pending.',
  },
  {
    id: 'anterior-cingulate-cortex-field',
    name: 'Anterior cingulate cortex',
    regionId: 'anterior-cingulate-cortex',
    brodmannAreas: [24, 32, 33],
    description:
      'Cortical field(s) of Anterior cingulate cortex. Hemisphere-specific split pending.',
  },
  {
    id: 'posterior-cingulate-cortex-field',
    name: 'Posterior cingulate cortex',
    regionId: 'posterior-cingulate-cortex',
    brodmannAreas: [23, 31],
    description:
      'Cortical field(s) of Posterior cingulate cortex. Hemisphere-specific split pending.',
  },
  {
    id: 'parahippocampal-cortex-field',
    name: 'Parahippocampal cortex',
    regionId: 'parahippocampal-cortex',
    brodmannAreas: [35, 36],
    description: 'Cortical field(s) of Parahippocampal cortex. Hemisphere-specific split pending.',
  },
] as const satisfies readonly CorticalArea[];

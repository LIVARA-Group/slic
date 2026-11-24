export const pathways = {
  visualGeniculostriate: {
    name: "Geniculostriate visual pathway",
    modality: "visual",
    steps: ["retina", "lateral_geniculate_nucleus", "primary_visual_cortex"],
    description: "A simplified representation of the major retinal-to-V1 route.",
  },
  visualTectal: {
    name: "Retinotectal pathway",
    modality: "visual",
    steps: ["retina", "superior_colliculus"],
    description: "A simplified route involved in visual orienting; intermediate details are omitted.",
  },
  auditoryAscending: {
    name: "Ascending auditory pathway (partial)",
    modality: "auditory",
    steps: ["cochlea", "inferior_colliculus", "medial_geniculate_nucleus", "primary_auditory_cortex"],
    description: "Partial pathway; cochlear nuclei and superior olivary complex are not represented in this baseline.",
  },
  somatosensoryAscending: {
    name: "Somatosensory ascending pathway (partial)",
    modality: "somatosensory",
    steps: ["dorsal_root_ganglion", "ventral_posterior_nucleus", "primary_somatosensory_cortex"],
    description: "Partial pathway; spinal cord and brainstem relays are omitted.",
  },
  corticospinal: {
    name: "Corticospinal pathway (partial)",
    modality: "motor",
    steps: ["primary_motor_cortex", "spinal_cord"],
    description: "Partial descending pathway; internal capsule, cerebral peduncle, pyramidal decussation and spinal targets are omitted.",
  },
  hippocampalFornical: {
    name: "Hippocampal-fornical output",
    modality: "memory",
    steps: ["hippocampus", "fornix", "hypothalamus"],
    description: "Simplified; the fornix has multiple targets, including septal and mammillary regions.",
  },
} as const;

export type PathwayId = keyof typeof pathways;
export type Pathway = (typeof pathways)[PathwayId];

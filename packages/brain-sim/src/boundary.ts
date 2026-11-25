import type { RegionId } from '@repo/brain';

export type SensoryModality = 'visual' | 'auditory' | 'somatosensory' | 'other';
export type BehaviorCategory = 'movement' | 'speech' | 'autonomic' | 'other';

/** Receptors that act as inputs of the brain, with their modality. */
export const sensors = {
  retina: 'visual',
  cochlea: 'auditory',
  'somatic-receptors': 'somatosensory',
  'dorsal-root-ganglion': 'somatosensory',
  'olfactory-epithelium': 'other',
  'taste-receptors': 'other',
  'vestibular-apparatus': 'other',
} as const satisfies Partial<Record<RegionId, SensoryModality>>;

/** Effectors that act as outputs of the brain, with the behavior they produce. */
export const effectors = {
  'skeletal-muscles': 'movement',
  'eye-muscles': 'movement',
  'speech-muscles': 'speech',
  'visceral-effectors': 'autonomic',
} as const satisfies Partial<Record<RegionId, BehaviorCategory>>;

export type SensorId = keyof typeof sensors;
export type EffectorId = keyof typeof effectors;

export const isSensor = (id: string): id is SensorId => id in sensors;
export const isEffector = (id: string): id is EffectorId => id in effectors;

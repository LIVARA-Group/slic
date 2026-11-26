import type { GeneratedDataset } from '../../core/dataset/dataset.js';
import {
  generatePersonalDataset,
  type PersonalDatasetData,
  type PersonalDatasetOptions,
} from '../../generators/personal/personal-dataset.js';

export interface PreparePersonalDatasetRequest {
  family: 'DS-P';
  seed: number;
  options: Omit<PersonalDatasetOptions, 'seed'>;
}

export type PreparedDataset = GeneratedDataset<PersonalDatasetData>;

export function prepareDataset(request: PreparePersonalDatasetRequest): PreparedDataset {
  return generatePersonalDataset({
    seed: request.seed,
    ...request.options,
  });
}

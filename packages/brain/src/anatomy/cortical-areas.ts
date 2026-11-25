import { extendedCorticalAreas } from './cortical-areas-extended.js';
import type { RegionId } from './regions.js';

export interface CorticalArea {
  readonly id: string;
  readonly name: string;
  readonly regionId: RegionId;
  readonly brodmannAreas: readonly number[];
  readonly description: string;
}

export const coreCorticalAreas = [
  {
    id: 'primary-motor',
    name: 'Primary motor cortex',
    regionId: 'left-primary-motor-cortex',
    brodmannAreas: [4],
    description: 'Primary motor cortical field. The corresponding area exists in both hemispheres.',
  },
  {
    id: 'primary-somatosensory',
    name: 'Primary somatosensory cortex',
    regionId: 'left-primary-somatosensory-cortex',
    brodmannAreas: [3, 1, 2],
    description: 'Primary somatosensory cortical fields.',
  },
  {
    id: 'primary-visual',
    name: 'Primary visual cortex',
    regionId: 'left-primary-visual-cortex',
    brodmannAreas: [17],
    description: 'Primary visual cortical field.',
  },
  {
    id: 'primary-auditory',
    name: 'Primary auditory cortex',
    regionId: 'left-primary-auditory-cortex',
    brodmannAreas: [41, 42],
    description: 'Primary auditory cortical fields.',
  },
  {
    id: 'broca-area',
    name: 'Broca-related language region',
    regionId: 'left-broca-area',
    brodmannAreas: [44, 45],
    description:
      'A language-related region commonly associated with portions of Brodmann areas 44 and 45.',
  },
] as const satisfies readonly CorticalArea[];

export const corticalAreas = [
  ...coreCorticalAreas,
  ...extendedCorticalAreas,
] as const satisfies readonly CorticalArea[];

export function getCorticalArea(id: string): CorticalArea | undefined {
  return corticalAreas.find((area) => area.id === id);
}

export function getCorticalAreasByBrodmann(areaNumber: number): readonly CorticalArea[] {
  return corticalAreas.filter((area) => area.brodmannAreas.some((number) => number === areaNumber));
}

export function getCorticalAreasForRegion(regionId: RegionId): readonly CorticalArea[] {
  return corticalAreas.filter((area) => area.regionId === regionId);
}

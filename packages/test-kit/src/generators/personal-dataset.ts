import { SeededRandom } from '../random/seeded-random.js';

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface PersonalEntity {
  id: string;
  type: string;
  name: string;
  createdAt: string;
}

export interface PersonalRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
}

export interface PersonalDataset {
  seed: number;
  notes: PersonalNote[];
  entities: PersonalEntity[];
  relations: PersonalRelation[];
}

export interface PersonalDatasetOptions {
  seed: number;
  noteCount: number;
  entityCount: number;
  relationCount: number;
}

const ENTITY_TYPES = ['person', 'place', 'concept', 'event', 'organization'] as const;

const RELATION_TYPES = ['related_to', 'references', 'depends_on', 'part_of', 'created_by'] as const;

const BASE_TIMESTAMP = Date.UTC(2026, 0, 1);

function validateCount(name: string, value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative safe integer`);
  }
}

function createTimestamp(random: SeededRandom): string {
  const offset = random.integer(0, 365 * 24 * 60 * 60 * 1000);

  return new Date(BASE_TIMESTAMP + offset).toISOString();
}

export function generatePersonalDataset(options: PersonalDatasetOptions): PersonalDataset {
  const { seed, noteCount, entityCount, relationCount } = options;

  validateCount('noteCount', noteCount);
  validateCount('entityCount', entityCount);
  validateCount('relationCount', relationCount);

  if (relationCount > 0 && entityCount < 2) {
    throw new RangeError('At least two entities are required for relations');
  }

  const random = new SeededRandom(seed);

  const notes = Array.from({ length: noteCount }, (_, index) => ({
    id: `note_${String(index + 1).padStart(6, '0')}`,
    title: `Note ${index + 1}`,
    content: `Generated content ${random.integer(1, 1_000_000)}`,
    createdAt: createTimestamp(random),
  }));

  const entities = Array.from({ length: entityCount }, (_, index) => ({
    id: `entity_${String(index + 1).padStart(6, '0')}`,
    type: random.pick(ENTITY_TYPES),
    name: `Entity ${index + 1}`,
    createdAt: createTimestamp(random),
  }));

  const relations = Array.from({ length: relationCount }, (_, index) => {
    const sourceIndex = random.integer(0, entityCount - 1);
    let targetIndex = random.integer(0, entityCount - 1);

    while (targetIndex === sourceIndex) {
      targetIndex = random.integer(0, entityCount - 1);
    }

    const source = entities[sourceIndex];
    const target = entities[targetIndex];

    if (!source || !target) {
      throw new RangeError('Failed to resolve relation endpoints');
    }

    return {
      id: `relation_${String(index + 1).padStart(6, '0')}`,
      sourceId: source.id,
      targetId: target.id,
      type: random.pick(RELATION_TYPES),
    };
  });

  return {
    seed,
    notes,
    entities,
    relations,
  };
}

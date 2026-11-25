import { brainStructures, type RegionId } from '../anatomy/regions.js';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  readonly code: string;
  readonly severity: ValidationSeverity;
  readonly message: string;
  readonly entityId?: string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
  readonly errors: readonly ValidationIssue[];
  readonly warnings: readonly ValidationIssue[];
}

export function validateAnatomy(): ValidationResult {
  const issues: ValidationIssue[] = [];

  const ids = new Set<string>();

  for (const structure of brainStructures) {
    if (ids.has(structure.id)) {
      issues.push({
        code: 'DUPLICATE_STRUCTURE_ID',
        severity: 'error',
        entityId: structure.id,
        message: `Duplicate structure ID "${structure.id}".`,
      });
    }

    ids.add(structure.id);
  }

  for (const structure of brainStructures) {
    if (structure.parentId === null) {
      continue;
    }

    if (structure.parentId === structure.id) {
      issues.push({
        code: 'SELF_PARENT_REFERENCE',
        severity: 'error',
        entityId: structure.id,
        message: `Structure "${structure.id}" cannot be its own parent.`,
      });

      continue;
    }

    if (!ids.has(structure.parentId)) {
      issues.push({
        code: 'MISSING_PARENT',
        severity: 'error',
        entityId: structure.id,
        message: `Parent "${structure.parentId}" of "${structure.id}" does not exist.`,
      });
    }
  }

  const parentById = new Map<string, string | null>(
    brainStructures.map((structure) => [structure.id, structure.parentId] as const),
  );

  for (const structure of brainStructures) {
    const visited = new Set<string>();

    let currentId: string | null = structure.id;

    while (currentId !== null) {
      if (visited.has(currentId)) {
        issues.push({
          code: 'HIERARCHY_CYCLE',
          severity: 'error',
          entityId: structure.id,
          message: `A hierarchy cycle was detected from "${structure.id}".`,
        });

        break;
      }

      visited.add(currentId);

      currentId = parentById.get(currentId) ?? null;
    }
  }

  return createValidationResult(issues);
}

export function isKnownRegionId(id: string): id is RegionId {
  return brainStructures.some((structure) => structure.id === id);
}

export function createValidationResult(issues: readonly ValidationIssue[]): ValidationResult {
  const errors = issues.filter((issue) => issue.severity === 'error');

  const warnings = issues.filter((issue) => issue.severity === 'warning');

  return {
    valid: errors.length === 0,
    issues,
    errors,
    warnings,
  };
}

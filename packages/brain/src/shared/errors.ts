export type BrainErrorCode =
  | 'ENTITY_NOT_FOUND'
  | 'INVALID_DEFINITION'
  | 'INVALID_REFERENCE'
  | 'INVALID_GRAPH'
  | 'INVALID_ARGUMENT';

export class BrainError extends Error {
  constructor(
    message: string,
    public readonly code: BrainErrorCode,
  ) {
    super(message);

    this.name = 'BrainError';
  }
}

export class BrainEntityNotFoundError extends BrainError {
  constructor(entityType: string, entityId: string) {
    super(`${entityType} with ID "${entityId}" was not found.`, 'ENTITY_NOT_FOUND');

    this.name = 'BrainEntityNotFoundError';
  }
}

export class BrainValidationError extends BrainError {
  constructor(
    message: string,
    public readonly issues: readonly string[] = [],
  ) {
    super(message, 'INVALID_DEFINITION');

    this.name = 'BrainValidationError';
  }
}

import { describe, expect, it } from 'vitest';

import { validateAnatomy, validateConnectome } from '../src/validation/index.js';

describe('Brain model validation', () => {
  it('validates the anatomical hierarchy', () => {
    const result = validateAnatomy();

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('validates connectome references and pathways', () => {
    const result = validateConnectome();

    console.log('Connectome validation errors:', result.errors);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

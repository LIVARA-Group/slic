import { describe, expect, it } from 'vitest';
import { statusResponseSchema } from './status.js';

describe('statusResponseSchema', () => {
  it('accepts a valid payload', () => {
    const parsed = statusResponseSchema.parse({
      name: 'api',
      version: '1.0.0',
      environment: 'production',
      uptimeSeconds: 12.5,
      timestamp: new Date().toISOString(),
    });
    expect(parsed.name).toBe('api');
  });

  it('rejects an unknown environment', () => {
    const result = statusResponseSchema.safeParse({
      name: 'api',
      version: '1',
      environment: 'staging',
      uptimeSeconds: 1,
      timestamp: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });
});

import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(['verbose', 'debug', 'log', 'warn', 'error', 'fatal']).default('log'),
  /** Comma-separated list of allowed browser origins. Empty = same-origin only (no CORS). */
  CORS_ORIGIN: z.string().default(''),
  /** Injected at image build time (git sha / tag). */
  APP_VERSION: z.string().default('dev'),
  DATABASE_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/** Used by ConfigModule: fail fast at start-up with a readable message when env is invalid. */
export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

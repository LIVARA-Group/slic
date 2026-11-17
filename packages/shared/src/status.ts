import { z } from 'zod';

/** Contract of `GET /api/v1/status`, shared by the API (producer) and the web app (consumer). */
export const statusResponseSchema = z.object({
  name: z.string(),
  version: z.string(),
  environment: z.enum(['development', 'test', 'production']),
  uptimeSeconds: z.number().nonnegative(),
  timestamp: z.iso.datetime(),
});

export type StatusResponse = z.infer<typeof statusResponseSchema>;

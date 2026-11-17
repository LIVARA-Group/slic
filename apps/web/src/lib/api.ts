import { queryOptions } from '@tanstack/react-query';
import { statusResponseSchema } from '@repo/shared';
import type { z } from 'zod';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Fetches `/api<path>` and validates the response with a shared Zod schema. */
export async function apiFetch<S extends z.ZodType>(
  path: string,
  schema: S,
  init?: RequestInit,
): Promise<z.output<S>> {
  const res = await fetch(`/api${path}`, { headers: { Accept: 'application/json' }, ...init });
  if (!res.ok)
    throw new ApiError(`Request to ${path} failed with status ${res.status}`, res.status);
  return schema.parse(await res.json());
}

export const statusQuery = queryOptions({
  queryKey: ['status'],
  queryFn: ({ signal }) => apiFetch('/v1/status', statusResponseSchema, { signal }),
  refetchInterval: 15_000,
});

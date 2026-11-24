import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ApiError, apiFetch } from './api';

const schema = z.object({ ok: z.boolean() });

afterEach(() => vi.unstubAllGlobals());

describe('apiFetch', () => {
  it('returns validated data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }))));
    await expect(apiFetch('/x', schema)).resolves.toEqual({ ok: true });
  });

  it('throws ApiError on non-2xx', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('no', { status: 503 })));
    await expect(apiFetch('/x', schema)).rejects.toBeInstanceOf(ApiError);
  });

  it('rejects payloads that violate the schema', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: 'yes' }))));
    await expect(apiFetch('/x', schema)).rejects.toThrow(/boolean/);
  });
});

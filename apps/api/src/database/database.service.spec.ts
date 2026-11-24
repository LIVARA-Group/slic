import type { Database } from '@repo/database';
import type { Pool } from 'pg';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseService } from './database.service.js';

vi.mock('@repo/database', () => ({
  createDatabase: vi.fn(),
}));

describe('DatabaseService', () => {
  const database = {
    execute: vi.fn().mockResolvedValue([]),
  } as unknown as Database;

  const pool = {
    end: vi.fn().mockResolvedValue(undefined),
  } as unknown as Pool;

  const connection = {
    db: database,
    pool,
  };

  let service: DatabaseService;

  beforeEach(() => {
    vi.clearAllMocks();

    service = new DatabaseService(connection);
  });

  it('should expose the Drizzle database instance', () => {
    expect(service.database).toBe(database);
  });

  it('should check database connection on module initialization', async () => {
    await service.onModuleInit();

    expect(database.execute).toHaveBeenCalledOnce();
  });

  it('should close the connection pool on application shutdown', async () => {
    await service.onApplicationShutdown();

    expect(pool.end).toHaveBeenCalledOnce();
  });
});

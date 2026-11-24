import { createDatabase } from '@repo/database';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseService } from './database.service.js';

describe('DatabaseService', () => {
  const connection = createDatabase('postgres://test:test@localhost:5432/test');

  const queryError = new Error('Query intercepted');
  const execute = vi.spyOn(connection.db, 'execute').mockImplementation(() => {
    throw queryError;
  });
  const end = vi.spyOn(connection.pool, 'end').mockResolvedValue(undefined);

  let service: DatabaseService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DatabaseService(connection);
  });

  it('should expose the Drizzle database instance', () => {
    expect(service.database).toBe(connection.db);
  });

  it('should execute a database connection check on module initialization', async () => {
    await expect(service.onModuleInit()).rejects.toThrow(queryError);
    expect(execute).toHaveBeenCalledOnce();
  });

  it('should close the connection pool on application shutdown', async () => {
    await service.onApplicationShutdown();

    expect(end).toHaveBeenCalledOnce();
  });
});

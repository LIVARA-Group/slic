import { Inject, Injectable, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import type { Database } from '@repo/database';
import { sql } from 'drizzle-orm';
import type { Pool } from 'pg';
import { DATABASE } from './database.constants.js';

interface DatabaseConnection {
  db: Database;
  pool: Pool;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  readonly database: Database;

  constructor(
    @Inject(DATABASE)
    private readonly connection: DatabaseConnection,
  ) {
    this.database = connection.db;
  }

  async onModuleInit(): Promise<void> {
    await this.database.execute(sql`SELECT 1`);
  }

  async onApplicationShutdown(): Promise<void> {
    await this.connection.pool.end();
  }
}

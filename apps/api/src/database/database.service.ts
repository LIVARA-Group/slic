import { Injectable, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { createDatabase, type Database } from '@repo/database';
import type { Env } from '../config/env.js';

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  private readonly connection;

  readonly db: Database;

  constructor(config: ConfigService<Env, true>) {
    const connectionString = config.get('DATABASE_URL', { infer: true });

    if (!connectionString) {
      throw new Error('DATABASE_URL is required');
    }

    this.connection = createDatabase(connectionString);
    this.db = this.connection.db;
  }

  async onModuleInit() {
    await this.db.execute(sql`SELECT 1`);
  }

  async onApplicationShutdown() {
    await this.connection.pool.end();
  }
}

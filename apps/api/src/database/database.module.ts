import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDatabase } from '@repo/database';
import type { Env } from '../config/env.js';
import { DATABASE } from './database.constants.js';
import { DatabaseService } from './database.service.js';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const connectionString = config.get('DATABASE_URL', { infer: true });

        if (!connectionString) {
          throw new Error('DATABASE_URL is required');
        }

        return createDatabase(connectionString);
      },
    },
    DatabaseService,
  ],
  exports: [DATABASE, DatabaseService],
})
export class DatabaseModule {}

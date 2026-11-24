import { Module } from '@nestjs/common';
import { DATABASE } from './database.constants.js';
import { DatabaseService } from './database.service.js';

@Module({
  providers: [
    DatabaseService,
    {
      provide: DATABASE,
      useFactory: (database: DatabaseService) => database.db,
      inject: [DatabaseService],
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}

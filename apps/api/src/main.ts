import { ConsoleLogger, type LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import type { Env } from './config/env.js';

const LEVELS: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  const isProd = config.get('NODE_ENV', { infer: true }) === 'production';
  const level = config.get('LOG_LEVEL', { infer: true });
  app.useLogger(
    new ConsoleLogger({
      json: isProd,
      colors: !isProd,
      logLevels: LEVELS.slice(LEVELS.indexOf(level)),
    }),
  );

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const origins = config
    .get('CORS_ORIGIN', { infer: true })
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  if (origins.length > 0) app.enableCors({ origin: origins, credentials: true });

  await app.listen(config.get('PORT', { infer: true }), '0.0.0.0');
}

await bootstrap();

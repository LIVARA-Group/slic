import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { StatusResponse } from '@repo/shared';
import type { Env } from '../config/env.js';

@Injectable()
export class StatusService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  getStatus(): StatusResponse {
    return {
      name: 'api',
      version: this.config.get('APP_VERSION', { infer: true }),
      environment: this.config.get('NODE_ENV', { infer: true }),
      uptimeSeconds: Math.round(process.uptime() * 100) / 100,
      timestamp: new Date().toISOString(),
    };
  }
}

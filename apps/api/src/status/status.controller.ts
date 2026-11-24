import { Controller, Get } from '@nestjs/common';
import type { StatusResponse } from '@repo/shared';
// biome-ignore lint/style/useImportType: NestJS requires the runtime class for dependency injection.
import { StatusService } from './status.service.js';

@Controller('v1/status')
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @Get()
  get(): StatusResponse {
    return this.status.getStatus();
  }
}

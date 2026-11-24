import { Controller, Get } from '@nestjs/common';
import type { StatusResponse } from '@repo/shared';
import type { StatusService } from './status.service.js';

@Controller('v1/status')
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @Get()
  get(): StatusResponse {
    return this.status.getStatus();
  }
}

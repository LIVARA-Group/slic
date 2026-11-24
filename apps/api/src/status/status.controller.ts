import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service.js';

import type { StatusResponse } from '@repo/shared';

@Controller('v1/status')
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @Get()
  get(): StatusResponse {
    return this.status.getStatus();
  }
}

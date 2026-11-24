import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { statusResponseSchema } from '@repo/shared';
import { StatusService } from './status.service.js';

describe('StatusService', () => {
  it('returns a payload that satisfies the shared contract', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        StatusService,
        {
          provide: ConfigService,
          useValue: { get: (key: string) => ({ APP_VERSION: '1.2.3', NODE_ENV: 'test' })[key] },
        },
      ],
    }).compile();

    const result = moduleRef.get(StatusService).getStatus();
    expect(statusResponseSchema.parse(result).version).toBe('1.2.3');
  });
});

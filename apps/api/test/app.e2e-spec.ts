import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { statusResponseSchema } from '@repo/shared';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /api/health/live -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/api/health/live').expect(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/health/ready -> 200', async () => {
    await request(app.getHttpServer()).get('/api/health/ready').expect(200);
  });

  it('GET /api/v1/status matches the shared contract', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/status').expect(200);
    expect(statusResponseSchema.safeParse(res.body).success).toBe(true);
  });

  it('unknown route -> 404', async () => {
    await request(app.getHttpServer()).get('/api/nope').expect(404);
  });
});

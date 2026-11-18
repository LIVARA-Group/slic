import { defineConfig, devices } from '@playwright/test';

const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  reporter: ci ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: [
    {
      command: 'pnpm --filter @repo/api dev',
      url: 'http://127.0.0.1:3000/api/health/live',
      reuseExistingServer: !ci,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter @repo/web run dev --host 127.0.0.1',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !ci,
      timeout: 120_000,
    },
  ],
});

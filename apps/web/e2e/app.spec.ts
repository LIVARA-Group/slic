import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home page renders and has no WCAG 2.1 A/AA violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Your monorepo is running' })).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('status page displays the live API status', async ({ page }) => {
  await page.goto('/status');
  await expect(page.getByRole('heading', { name: 'API status' })).toBeVisible();
  await expect(page.locator('.facts')).toBeVisible();
  await expect(page.locator('.facts')).toContainText('Service');
});

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle('FastTrackML (modern)');
  });

  test('active runs link redirects correctly', async ({ page }) => {
    await page.getByText('Active Runs').click({ force: true });

    // Check if there is a textbox with the value 'runs.active == True' (do not use toHaveSelector or toHaveText)
    await page.getByRole('code', { name: 'runs.active == True' });
  });

  test('failing test for testing purposes', async ({ page }) => {
    await expect(page).toHaveTitle('FastTrackML (modern) - Failing test');
  });
});

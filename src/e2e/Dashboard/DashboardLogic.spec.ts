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

    await page.getByRole('code', { name: 'runs.active == True' });
  });

  test('archived runs link redirects correctly', async ({ page }) => {
    await page.getByText('Archived Runs').click({ force: true });

    await page.getByRole('code', { name: 'runs.active == False' });
  });

  test("last week's runs link redirects correctly", async ({ page }) => {
    await page.getByText("Last Week's Runs").click({ force: true });

    // The text varies depending on the current date:
    // Example: datetime(2024, 6, 3) <= run.created_at < datetime(2024, 6, 10)
    await page.getByRole('code', {
      name: /datetime\(\d+, \d+, \d+\) <= run\.created_at < datetime\(\d+, \d+, \d+\)/,
    });
  });
});

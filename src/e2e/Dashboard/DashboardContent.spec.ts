import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      console.log('PAGE LOG:', msg.text());
    });

    await page.goto(BASE_URL);
    await page.screenshot({ path: 'before-waitForLoadState.png' });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'after-waitForLoadState.png' });
  });

  // Test that the total number of runs is two. This assumes that the
  // test database has been seeded with two runs by running `k6 run k6_load.js`
  test('has two runs', async ({ page }) => {
    // Check for the total runs element
    const textContent = await page.textContent(
      'p.ProjectStatistics__totalRuns',
    );
    expect(textContent).toBe('Total runs: 2');
  });
});

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
    const debugScreenshotPath = 'debug-screenshot.png';
    const debugHtmlPath = 'debug-content.html';

    // Capture initial screenshot and HTML to see initial state
    await page.screenshot({ path: debugScreenshotPath });

    // Wait for the Spinner to appear
    await page.waitForSelector('.Spinner', {
      state: 'visible',
      timeout: 10000,
    });

    // Capture screenshot and HTML while loading
    await page.screenshot({
      path: debugScreenshotPath.replace('.png', '-loading.png'),
    });

    // Wait for the Spinner to disappear
    await page.waitForSelector('.Spinner', { state: 'hidden', timeout: 10000 });

    // Capture screenshot and HTML after loading
    await page.screenshot({
      path: debugScreenshotPath.replace('.png', '-loaded.png'),
    });

    // Wait for the ProjectStatistics component to appear
    await page.waitForSelector('p.ProjectStatistics__totalRuns', {
      timeout: 10000,
    });

    // Check for the total runs element
    const textContent = await page.textContent(
      'p.ProjectStatistics__totalRuns',
    );
    console.log('Text content:', textContent);
    expect(textContent).toBe('Total runs: 2');
  });
});

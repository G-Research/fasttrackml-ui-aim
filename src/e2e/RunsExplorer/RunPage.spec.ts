import { expect, test } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/aim';
const RUNS_PAGE = `${BASE_URL}/runs`;

test.describe('Individual Run Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the individual run page
    await page.goto(RUNS_PAGE);
    await page.waitForLoadState('networkidle');
    await page.click(
      '.ExperimentBar__headerContainer__appBarTitleBox__buttonSelectToggler',
    );

    const button = page.locator('button', { hasText: /^experiment-/ });
    await button.click();
    await page.waitForSelector('.Table__cell.undefined.experiment');
    await page.mouse.click(0, 0);
    await page.waitForSelector('.RunsTable');

    const firstRunNameLink = page
      .locator('.Table__cell.undefined.run .RunNameColumn__runName a')
      .first();

    await firstRunNameLink.click();
    await page.waitForURL(/\/aim\/runs\/.+/);
  });

  test('run params search box is working', async ({ page }) => {
    await page.fill('input[name="search"]', 'param1');

    await page.waitForSelector('div[role="row"]');

    const row = await page.$eval('div[role="row"]', (row) => row.textContent);

    expect(row).not.toBeNull();
    expect(row).toMatch(/param1"(\d+\.\d+)"/);

    const rows = await page.$$eval('div[role="row"]', (rows) =>
      rows.map((row) => row.textContent),
    );
    expect(rows[0]).toContain('param1');
    expect(rows.length).toBe(2); // 1 entry plus the header
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `failed-${testInfo.title}.png` });
    }
  });
});

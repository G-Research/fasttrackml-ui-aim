import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/aim/runs';

test.describe('Runs Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('displays no results message when no experiments are selected', async ({
    page,
  }) => {
    const runsTable = await page.locator('.RunsTable');
    expect(await runsTable.locator('text=No results').count()).toBe(1);
  });

  test('has two runs if generated experiment is selected', async ({ page }) => {
    // Add the generated experiment to the selection and wait for the table to appear
    await page.click(
      '.ExperimentBar__headerContainer__appBarTitleBox__buttonSelectToggler',
    );

    const button = page.locator('button', { hasText: /^experiment-/ });
    await button.click();

    await page.waitForSelector('.Table__cell.undefined.experiment');

    const rows = page.locator(
      '.Table__cell.undefined.experiment .ExperimentNameBox__experimentName',
    );

    expect(await rows.count()).toBe(2);

    for (let i = 0; i < 2; i++) {
      const runName = await rows.nth(i).innerText();
      expect(runName).toMatch(/^experiment-/);
    }
  });
});

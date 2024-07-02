import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/aim';
const RUNS_PAGE = `${BASE_URL}/runs`;

test.describe('Runs Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(RUNS_PAGE);
    await page.waitForLoadState('networkidle');
  });

  test('navigates correctly from dashboard', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.click('text=Runs');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(RUNS_PAGE);
  });

  test('displays no results message when no experiments are selected', async ({
    page,
  }) => {
    const runsTable = page.locator('.RunsTable');
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

  test('clicking on the experiment name navigates to the experiment page', async ({
    page,
  }) => {
    await page.click(
      '.ExperimentBar__headerContainer__appBarTitleBox__buttonSelectToggler',
    );

    const button = page.locator('button', { hasText: /^experiment-/ });
    await button.click();

    await page.waitForSelector('.Table__cell.undefined.experiment');

    // Click on a random part of the screen to close the popover
    await page.mouse.click(0, 0);

    const rows = page.locator(
      '.Table__cell.undefined.experiment .ExperimentNameBox__experimentName',
    );

    await rows
      .locator('a', { hasText: /^experiment-/ })
      .first()
      .click();

    await page.waitForURL(/\/aim\/experiments\/\d+\/overview/);
    expect(page.url()).toMatch(/\/aim\/experiments\/\d+\/overview/);
  });

  test("clicking on the first run name navigates to that run's page", async ({
    page,
  }) => {
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
    expect(page.url()).toMatch(/\/aim\/runs\/.+/);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `failed-${testInfo.title}.png` });
    }
  });
});

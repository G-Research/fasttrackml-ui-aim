import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  // Test that the total number of runs is two. This assumes that the
  // test database has been seeded with two runs by running `k6 run k6_load.js`
  test('has two runs', async ({ page }) => {
    const textContent = await page.textContent(
      'p.ProjectStatistics__totalRuns',
    );
    expect(textContent).toBe('Total runs: 2');
  });

  test('has two experiments', async ({ page }) => {
    const textContent = await page.textContent('h3.ExperimentsCard__title');
    expect(textContent).toBe('Experiments (2)');
  });

  test('Default experiment exists and has no runs', async ({ page }) => {
    const table = await page.$('.BaseTable__body');
    const rows = await table?.$$('.BaseTable__row');
    expect(rows).not.toBeNull();

    const firstRow = rows?.[0];
    const experimentName = await firstRow?.$eval(
      '.ExperimentNameBox__experimentName a',
      (el) => el.textContent,
    );
    expect(experimentName).toBe('Default');

    const runCount = await firstRow?.$eval('p', (el) => el.textContent);
    expect(runCount).toBe('0');
  });

  test('generated experiment exists and has two runs', async ({ page }) => {
    const table = await page.$('.BaseTable__body');
    const rows = await table?.$$('.BaseTable__row');
    expect(rows).not.toBeNull();

    const secondRow = rows?.[1];
    const experimentName = await secondRow?.$eval(
      '.ExperimentNameBox__experimentName a',
      (el) => el.textContent,
    );
    expect(experimentName).toContain('experiment-');

    const runCount = await secondRow?.$eval('p', (el) => el.textContent);
    expect(runCount).toBe('2');
  });

  test('experiment search bar filters table experiments', async ({ page }) => {
    const searchInput = await page.$('.SearchBar input#search');
    await searchInput?.fill('experiment-');
    const value = await searchInput?.inputValue();
    expect(value).toBe('experiment-');

    const table = await page.$('.BaseTable__body');
    const rows = await table?.$$('.BaseTable__row');
    expect(rows?.length).toBe(1);

    const firstRow = rows?.[0];
    const experimentName = await firstRow?.$eval(
      '.ExperimentNameBox__experimentName a',
      (el) => el.textContent,
    );
    expect(experimentName).toContain('experiment-');
  });

  test("contributions heatmap has runs on the generated experiment's day", async ({
    page,
  }) => {
    // Get the current date in format MMM DD, YYYY based on the generated experiment's timestamp
    const rows = await page.$$('.BaseTable__row');
    const secondRow = rows?.[1];
    const experimentName = await secondRow?.$eval(
      '.ExperimentNameBox__experimentName a',
      (el) => el.textContent,
    );

    const timestamp = experimentName?.split('-')[1] ?? '';
    const currentDate = new Date(parseInt(timestamp)).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      },
    );

    // Cells are colored on a scale from 0 to 4, and we only have one active day in the test data
    const heatmap = await page.$('.CalendarHeatmap');
    const currentDayCell = await heatmap?.$('.CalendarHeatmap__cell--scale-4');
    expect(currentDayCell).not.toBeNull();

    const tooltip = await currentDayCell?.getAttribute('title');
    expect(tooltip).toContain(currentDate);
  });

  test("clicking on the heatmap cell queries that day's runs", async ({
    page,
  }) => {
    // Get the current timestamp from the generated experiment to construct the expected query
    const rows = await page.$$('.BaseTable__row');
    const secondRow = rows?.[1];

    const experimentName = await secondRow?.$eval(
      '.ExperimentNameBox__experimentName a',
      (el) => el.textContent,
    );
    const timestamp = experimentName?.split('-')[1].trim() ?? '';

    const date = new Date(parseInt(timestamp));
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // getUTCMonth() is zero-based
    const day = date.getUTCDate();

    const expectedText = `datetime(${year},${month},${day})<=run.created_at<datetime(${year},${month},${
      day + 1
    })`;

    // Locate and click the current day cell in the heatmap
    const heatmap = await page.$('.CalendarHeatmap');
    const currentDayCell = await heatmap?.$('.CalendarHeatmap__cell--scale-4');
    await currentDayCell?.click();

    await page.waitForLoadState('networkidle');

    const textBox = await page.locator('.view-lines.monaco-mouse-cursor-text');

    const textContent = await textBox.evaluate((el) => el.innerText);

    // Remove tabs and newlines that might be present in the text content
    const trimmedTextContent = textContent.replace(/\s/g, '');

    expect(trimmedTextContent).toContain(expectedText);
  });
});

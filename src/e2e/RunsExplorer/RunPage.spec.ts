import { expect, test } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/aim';
const RUNS_PAGE = `${BASE_URL}/runs`;

test.describe('Individual Run Page', () => {
  // Navigate to the run page before each test as we don't know the hash in the link
  test.beforeEach(async ({ page }) => {
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

  test('view in metrics explorer link queries the right hash', async ({
    page,
  }) => {
    // Wait for page content to load first
    await page.waitForSelector('.runHashListItem__hashWrapper .Text');
    const hash = await page.$eval(
      '.runHashListItem__hashWrapper .Text',
      (element) => element.textContent?.trim(),
    );

    await page.click('a:has-text("View in Metrics Explorer")', { force: true });

    await page.waitForSelector('.view-lines.monaco-mouse-cursor-text');
    const textBox = page.locator('.view-lines.monaco-mouse-cursor-text');

    const textContent = await textBox.evaluate((el) => el.innerText);

    // Remove tabs and newlines that might be present in the text content
    const trimmedTextContent = textContent.replace(/\s/g, '');

    expect(trimmedTextContent).toContain(hash);
  });

  test('settings page name and description can be edited', async ({ page }) => {
    await page.click(
      '.RunDetail__runDetailContainer__appBarContainer__appBarBox__actionContainer button',
    );
    await page.waitForSelector('.RunDetailSettingsTab');

    const nameInput = page.locator(
      '.NameAndDescriptionCard__content__nameBox__nameInput input',
    );
    await nameInput.fill('New Run Name');

    const descriptionInput = page
      .locator(
        '.NameAndDescriptionCard__content__descriptionBox__descriptionInput textarea',
      )
      .first(); // There are two textareas, we want the first one
    await descriptionInput.fill('New Run Description');

    await page.click('.NameAndDescriptionCard__saveBtn', { force: true });
  });

  test('run selector is working', async ({ page }) => {
    const runNameElement = page.locator(
      '.RunDetail__runDetailContainer__appBarContainer__appBarTitleBox__runName',
    );

    const originalRunName = await runNameElement.innerText();

    await page.click(
      '.RunDetail__runDetailContainer__appBarContainer__appBarTitleBox__buttonSelectToggler',
    );

    // Wait for the runs list to appear
    await page.waitForSelector(
      'div.RunSelectPopoverWrapper__selectPopoverContent__contentContainer__runsListContainer__runsList',
    );

    const run = page
      .locator(
        'a.RunSelectPopoverWrapper__selectPopoverContent__contentContainer__runsListContainer__runsList__runBox',
      )
      .last();

    await run.click();

    // Click outside the popover to close it
    await page.mouse.click(0, 0);

    const newRunName = await runNameElement.innerText();

    expect(newRunName).not.toBe(originalRunName);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `failed-${testInfo.title}.png` });
    }
  });
});

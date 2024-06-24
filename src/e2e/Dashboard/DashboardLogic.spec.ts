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
    await page.waitForLoadState('networkidle');

    const expectedText = 'run.active==True';
    const textBox = page.locator('.view-lines.monaco-mouse-cursor-text');
    const textContent = await textBox.evaluate((el) => el.innerText);
    const trimmedTextContent = textContent.replace(/\s/g, '');

    expect(trimmedTextContent).toContain(expectedText);
  });

  test('archived runs link redirects correctly', async ({ page }) => {
    await page.getByText('Archived Runs').click({ force: true });
    await page.waitForLoadState('networkidle');

    const expectedText = 'run.archived==True';
    const textBox = page.locator('.view-lines.monaco-mouse-cursor-text');
    const textContent = await textBox.evaluate((el) => el.innerText);
    const trimmedTextContent = textContent.replace(/\s/g, '');

    expect(trimmedTextContent).toContain(expectedText);
  });

  test("last week's runs link redirects correctly", async ({ page }) => {
    await page.getByText("Last Week's Runs").click({ force: true });
    await page.waitForLoadState('networkidle');

    // The text varies depending on the current date:
    // Example: datetime(2024, 6, 3) <= run.created_at < datetime(2024, 6, 10)
    const queryRegex =
      /datetime\(\d+,\d+,\d+\)<=run\.created_at<datetime\(\d+,\d+,\d+\)/;
    const textBox = page.locator('.view-lines.monaco-mouse-cursor-text');
    const textContent = await textBox.evaluate((el) => el.innerText);
    const trimmedTextContent = textContent.replace(/\s/g, '');

    expect(queryRegex.test(trimmedTextContent)).toBeTruthy();
  });
});

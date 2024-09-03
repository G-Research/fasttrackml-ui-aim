import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/aim';
const IMAGES_PAGE = `${BASE_URL}/images`;

test.describe('Images Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(IMAGES_PAGE);
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `failed-${testInfo.title}.png` });
    }
  });
});

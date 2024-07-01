import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/aim/runs';

test.describe('Runs Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

});

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/aim';
const IMAGES_PAGE = `${BASE_URL}/images`;

test.describe('Images Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(IMAGES_PAGE);
    await page.waitForLoadState('networkidle');
  });

  test('navigates correctly from dashboard', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.click('text=Images');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(IMAGES_PAGE);
  });

  test('Check if image caption is present when searching', async ({ page }) => {
    // Select the latest experiment
    const experimentsIcon = page.locator('.icon-arrow-down');
    await experimentsIcon.click();

    const experiment = page.locator(
      '.ExperimentSelectionPopover__contentContainer__experimentsListContainer__experimentList > :last-child',
    );
    await experiment.click();

    // Close the experiment selection popover
    await page.mouse.click(0, 0);

    // Select the available image name and search
    const imagesIcon = page.locator('.icon-plus');
    await imagesIcon.click();
    const option = page.locator('.SelectForm__option');
    await option.click();
    const searchIcon = page.locator('.icon-search');
    await searchIcon.click();

    await page.waitForSelector('.Table');
    const mediaSet = page.locator('.MediaSet');
    const imageBoxWithCaption = mediaSet.locator('.ImageBox .Text', {
      hasText: 'example image caption',
    });

    expect(await imageBoxWithCaption.count()).toBeGreaterThan(0);
  });

  test('Check if image info displays correctly when hovering over image', async ({
    page,
  }) => {
    // Select the latest experiment
    const experimentsIcon = page.locator('.icon-arrow-down');
    await experimentsIcon.click();

    const experiment = page.locator(
      '.ExperimentSelectionPopover__contentContainer__experimentsListContainer__experimentList > :last-child',
    );
    await experiment.click();

    // Close the experiment selection popover
    await page.mouse.click(0, 0);

    // Select the available image name and search
    const imagesIcon = page.locator('.icon-plus');
    await imagesIcon.click();
    const option = page.locator('.SelectForm__option');
    await option.click();
    const searchIcon = page.locator('.icon-search');
    await searchIcon.click();

    // Pick the first matching image and hover over it
    await page.waitForSelector('.Table');
    const mediaSet = page.locator('.MediaSet');
    const imageBox = mediaSet.locator('.ImageBox').first();
    await imageBox.hover();

    const imageInfo = page.locator('.PopoverContent__imageSetBox');
    expect(await imageInfo.isVisible()).toBe(true);

    const imageInfoText = await imageInfo.innerText();
    expect(imageInfoText).toContain('example image caption');
    expect(imageInfoText).toContain('example image name');
    expect(imageInfoText).toContain('Step: 4');
    expect(imageInfoText).toContain('Index: 0');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `failed-${testInfo.title}.png` });
    }
  });
});

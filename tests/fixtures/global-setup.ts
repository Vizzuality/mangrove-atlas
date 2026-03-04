import { chromium, FullConfig } from '@playwright/test';

/**
 * Dismisses the welcome dialog by setting localStorage before tests run.
 * Saves the browser storage state for reuse across all tests.
 */
async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL);
  await page.evaluate(() => {
    localStorage.setItem('welcomeIntroMessage', 'true');
    localStorage.setItem('guideLocalStorage', 'true');
  });
  await page.context().storageState({ path: storageState as string });

  await browser.close();
}

export default globalSetup;

import { Page } from '@playwright/test';

export const useSidebar = (page: Page) => ({
  clickWordwide: async () => await page.getByTestId('worldwide-button').click({ delay: 300 }),
  clickSearch: async () => await page.getByTestId('search-button').click({ delay: 300 }),
});

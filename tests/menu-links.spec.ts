import { test } from '@playwright/test';

const links = [
  {
    name: 'About',
    link: 'https://www.mangrovealliance.org/about-us/',
  },
  {
    name: 'Mangroves',
    link: 'https://www.mangrovealliance.org/mangrove-forests/',
  },
  {
    name: 'Initiatives',
    link: 'https://www.mangrovealliance.org/initiatives/',
  },
  {
    name: 'News',
    link: 'https://www.mangrovealliance.org/news/',
  },
  {
    name: 'Resources',
    link: 'https://www.mangrovealliance.org/tools-and-resources/',
  },
  {
    name: 'Contact',
    link: 'https://www.mangrovealliance.org/contact/',
  },
];

test('test menu links', async ({ page }) => {
  await page.goto('/');

  const menuButton = page.getByTestId('menu-button');
  await menuButton.click();

  const menuContent = page.getByTestId('menu-content');
  await menuContent.isVisible();

  await menuContent.getByRole('button', { name: 'About this tool' }).click();
  await menuContent.getByRole('heading', { name: 'About Global Mangrove Watch' }).isVisible();
  await menuContent.getByRole('button', { name: 'Close' }).click();

  await menuButton.click();
  await menuContent.getByRole('button', { name: 'News' }).click();
  await menuContent.getByRole('button', { name: 'Close' }).nth(1).click();

  await menuButton.click();
  await menuContent.getByRole('button', { name: 'Global Mangrove Alliance' }).click();
  const pageOpenPromise = page.waitForEvent('popup');

  for (const link of links) {
    await menuContent.getByRole('link', { name: link.name }).click();
    const promise = await pageOpenPromise;
    await promise.goto(link.link);
  }
});

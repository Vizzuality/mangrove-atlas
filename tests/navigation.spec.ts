import { expect, test } from '@playwright/test';

test('test menu links', async ({ page }) => {
  await page.goto('/');

  const menuButton = page.getByTestId('menu-button');
  await menuButton.click();
  const menuContent = page.getByTestId('menu-content');
  await menuContent.isVisible();
  await menuContent.getByRole('button', { name: 'About this tool' }).click();
  await menuContent.getByRole('button', { name: 'Close' }).click();
});

test('test blog links', async ({ page }) => {
  await page.goto('/');

  const newsButton = page.getByTestId('news-button');
  await newsButton.click();
  const newsBlogContent = page.getByTestId('news-blog-content');
  await newsBlogContent.isVisible();
  const postsList = page.getByTestId('posts-list');
  await postsList.isVisible();
  await postsList.first().click();
  const backToNewsBtn = page.getByTestId('back-to-news-button');
  await backToNewsBtn.click();
  await postsList.isVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('test help guide', async ({ page }) => {
  await page.goto('/');
  const helpGuideButton = page.getByTestId('guide-button');
  await helpGuideButton.click();
  const helpers = page.getByTestId('helper-button');
  await expect(helpers).toHaveCount(15);
});

import { expect, test } from '@playwright/test';
import { fi } from 'date-fns/locale';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('test menu links', async ({ page }) => {
  const menuButton = page.getByTestId('menu-button');
  await menuButton.click();
  const menuContent = page.getByTestId('menu-content');
  await menuContent.isVisible();
  await menuContent.getByRole('button', { name: 'About this tool' }).click();
  await menuContent.getByRole('button', { name: 'Close' }).click();
});

test.describe('Blog navigation', () => {
  test('Open blog dialog', async ({ page }) => {
    const newsButton = page.getByTestId('news-button');
    await newsButton.click();
    const newsBlogContent = page.getByTestId('news-blog-content');
    await newsBlogContent.isVisible();
  });
  test('Open first post', async ({ page }) => {
    // Click on the news button
    const newsButton = page.getByTestId('news-button');
    await newsButton.click();

    // Wait for posts list to be visible
    const postsList = page.getByTestId('posts-list');
    await postsList.waitFor();

    // Get the first post and its title
    const firstPost = postsList.locator('h5').first();
    const postTitle = await firstPost.textContent();

    // Click on the first post
    await firstPost.click();

    // Wait for post info to be visible and check title against the one shown previously
    const postInfo = page.getByTestId('post-info');
    await expect(postInfo).toBeVisible();
    const postHeading = page.getByTestId('post-heading');
    await expect(postHeading).toHaveText(new RegExp(postTitle));

    // Click back button to go back to the posts list
    const backToNewsBtn = page.getByTestId('back-to-news-button');
    await backToNewsBtn.click();
    await postsList.isVisible();
    await page.getByRole('button', { name: 'Close' }).click();
  });
});

test('test help guide', async ({ page }) => {
  // Click on the guide button
  const helpGuideButton = page.getByTestId('guide-button');
  await helpGuideButton.click();

  // Locate all helper buttons
  const helpers = page.getByTestId('helper-button');

  // Count the number of helper buttons
  const helperCount = await helpers.count();

  // Assert the number of helpers
  expect(helperCount).toBe(24); // According to Widgets guide documentation (guided tour texts)
});

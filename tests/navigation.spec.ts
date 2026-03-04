import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('test menu links', async ({ page }) => {
  const menuButton = page.getByTestId('menu-button');
  await menuButton.click();
  const menuContent = page.getByTestId('menu-content');
  await expect(menuContent).toBeVisible();
  await menuContent.getByRole('button', { name: 'About this tool' }).click();
  await menuContent.getByRole('button', { name: 'Close' }).click();
});

test.describe('Blog navigation', () => {
  test('Open blog dialog', async ({ page }) => {
    const newsButton = page.getByTestId('news-button');
    await newsButton.click();
    const postsList = page.getByTestId('posts-list');
    await expect(postsList).toBeVisible();
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
    await expect(postsList).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
  });
});

test('test help guide', async ({ page }) => {
  // Click on the guide button to open the help popover
  const helpGuideButton = page.getByTestId('guide-button');
  await helpGuideButton.click();

  // Toggle Navigation help switch to activate the guide
  await page.getByTestId('guide-switch').click();

  // Wait for helper buttons to appear in the DOM (they may be hidden due to absolute positioning)
  const helpers = page.getByTestId('helper-button');
  await helpers.first().waitFor({ state: 'attached' });

  // Assert at least one helper exists
  const helperCount = await helpers.count();
  expect(helperCount).toBeGreaterThan(0);
});

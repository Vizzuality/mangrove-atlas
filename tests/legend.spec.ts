import { expect, test } from './fixtures/test';

test('test legend order', async ({ page, browserName }) => {
  test.fixme(browserName === 'firefox', 'Firefox: Recoil/hydration instability');
  await page.goto('/');
  // Legend starts open by default when layers are active (mangrove_habitat_extent is active on load)
  const legendContent = page.getByTestId('legend-content');
  await expect(legendContent).toBeVisible();
  const netChangeLayerSwitcher = page.getByTestId('mangrove_net_change');
  await netChangeLayerSwitcher.click();
  await expect(netChangeLayerSwitcher).toHaveAttribute('data-state', 'checked');

  const mangroveAlertsLayerSwitcher = page.getByTestId('mangrove_alerts');
  await mangroveAlertsLayerSwitcher.click();
  await expect(mangroveAlertsLayerSwitcher).toHaveAttribute('data-state', 'checked');

  // const source = page.getByTestId('legend-item-mangrove_habitat_extent').first();
  // const target = page.getByTestId('legend-item-mangrove_alerts').first();

  // await source.dragTo(target);

  // await source.dragTo(target, {
  //   sourcePosition: { x: 34, y: 7 },
  //   targetPosition: { x: 10, y: 20 },
  // });
});

// The drag activator lives on the "Drag to reorder" handle rather than the item
// wrapper (nesting it around the item's other controls is a nested-interactive
// violation), so the handle has to be what dnd-kit's KeyboardSensor responds to.
test('a legend item can be reordered from its drag handle with the keyboard', async ({
  page,
  browserName,
}) => {
  test.fixme(browserName === 'firefox', 'Firefox: Recoil/hydration instability');
  await page.goto('/');

  const legendContent = page.getByTestId('legend-content');
  await expect(legendContent).toBeVisible();

  const netChangeLayerSwitcher = page.getByTestId('mangrove_net_change');
  await netChangeLayerSwitcher.click();
  await expect(netChangeLayerSwitcher).toHaveAttribute('data-state', 'checked');

  const items = legendContent.locator('[data-testid^="legend-item-"]');
  await expect(items).toHaveCount(2);
  const order = () => items.evaluateAll((els) => els.map((el) => el.dataset.testid));
  const before = await order();

  // dnd-kit drives the keyboard drag off animation frames, so each key has to
  // land before the next one is meaningful. Its own live region is the signal.
  const announcement = () =>
    page.evaluate(() =>
      Array.from(document.querySelectorAll('[role="status"]'))
        .map((el) => el.textContent ?? '')
        .join(' ')
    );

  await legendContent.getByRole('button', { name: 'Drag to reorder' }).first().focus();
  await page.keyboard.press('Space');
  await expect.poll(announcement).toContain('Draggable item');
  await page.keyboard.press('ArrowDown');
  await expect.poll(announcement).toContain(before[1].replace('legend-item-', ''));
  await page.keyboard.press('Space');

  await expect.poll(order).toEqual([before[1], before[0]]);
});

import { expect, test } from '@playwright/test';

test('test legend order', async ({ page }) => {
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

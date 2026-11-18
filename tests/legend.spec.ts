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

// GMW-1194 — every layer on the map has a legend row, placed by its contextual type.
const layersParam = (ids: string[]) =>
  `layers=${encodeURIComponent(
    JSON.stringify(ids.map((id) => ({ id, opacity: '1', visibility: 'visible' })))
  )}`;

const legendOrder = (page: import('@playwright/test').Page) =>
  page
    .getByTestId('legend-content')
    .locator('[data-testid^="legend-item-"]')
    .evaluateAll((els) => els.map((el) => el.dataset.testid?.replace('legend-item-', '')));

const urlLayerIds = (page: import('@playwright/test').Page) => {
  const raw = new URL(page.url()).searchParams.get('layers');
  return raw ? (JSON.parse(raw) as { id: string }[]).map((l) => l.id) : [];
};

test.describe('contextual layers in the legend', () => {
  test.beforeEach(({ browserName }) => {
    test.fixme(browserName === 'firefox', 'Firefox: hydration instability');
  });

  test('hi-res extent from the map tip goes directly below habitat extent', async ({ page }) => {
    await page.goto(`/?${layersParam(['mangrove_net_change', 'mangrove_habitat_extent'])}`);
    await expect(page.getByTestId('legend-content')).toBeVisible();

    const mapTipSwitch = page.locator('button#hi-res-extent');
    await mapTipSwitch.click();
    await expect(mapTipSwitch).toHaveAttribute('data-state', 'checked');

    await expect
      .poll(() => legendOrder(page))
      .toEqual(['mangrove_net_change', 'mangrove_habitat_extent', 'hi-res-extent']);
  });

  test('removing hi-res extent from the legend turns off the map tip', async ({ page }) => {
    await page.goto(`/?${layersParam(['mangrove_habitat_extent', 'hi-res-extent'])}`);
    const row = page.getByTestId('legend-item-hi-res-extent');
    await expect(row).toBeVisible();

    await row.getByRole('button', { name: 'Remove layer' }).click();

    await expect(row).toHaveCount(0);
    await expect(page.locator('button#hi-res-extent')).toHaveAttribute('data-state', 'unchecked');
  });

  test('Planet has a fixed row at the bottom with no drag handle', async ({ page }) => {
    await page.goto(
      `/?${layersParam(['planet_medres_visual_monthly', 'mangrove_habitat_extent'])}`
    );
    const row = page.getByTestId('legend-item-planet_medres_visual_monthly');
    await expect(row).toBeVisible();
    await expect(row.getByText('Always drawn at the bottom of the map')).toBeVisible();
    await expect(row.getByRole('button', { name: 'Drag to reorder' })).toHaveCount(0);

    // Planet is first in the URL but its row is pinned to the bottom.
    await expect
      .poll(() => legendOrder(page))
      .toEqual(['mangrove_habitat_extent', 'planet_medres_visual_monthly']);
  });

  test('reordering the legend keeps layers without a row in the URL', async ({ page }) => {
    await page.goto(
      // National dashboard layers have no row outside their countries.
      `/?${layersParam(['mangrove_net_change', 'mangrove_habitat_extent', 'mangrove_national_dashboard_layer_KEN'])}`
    );
    const legendContent = page.getByTestId('legend-content');
    await expect(legendContent).toBeVisible();

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
    await expect.poll(announcement).toContain('mangrove_habitat_extent');
    await page.keyboard.press('Space');

    await expect
      .poll(() => legendOrder(page))
      .toEqual(['mangrove_habitat_extent', 'mangrove_net_change']);
    expect(urlLayerIds(page)).toContain('mangrove_national_dashboard_layer_KEN');
  });
});

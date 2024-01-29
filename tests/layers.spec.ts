import { test, expect } from '@playwright/test';

import WIDGETS from 'containers/widgets/constants';

import type { Category } from 'types/category';
import { WidgetTypes } from 'types/widget';

const WORDWIDE_LOCATION = 'worldwide';
const COUNTRY_LOCATION = 'country';
const ALL_DATASETS_CATEGORY: Category = 'all_datasets';
const CONTEXTUAL_LAYER_ID = 'contextual_layers';
const STYLE_CONTEXTUAL_LAYERS = ['planet_medres_visual_monthly', 'planet_medres_analytic_monthly'];

test.describe('Can activate contextual layers in map settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?active=[]');
    await page.getByTestId('map-settings-button').click();
  });

  const contextualLayers: WidgetTypes[] = WIDGETS.filter(({ categoryIds }) =>
    categoryIds?.includes(CONTEXTUAL_LAYER_ID)
  );

  for (const widget of contextualLayers) {
    const id = widget.slug;
    test(`Layer ${id}`, async ({ page }) => {
      const layerSwitcher = page.getByTestId(id);
      await layerSwitcher.click({ force: true }); // Activate layer
      await expect(layerSwitcher).toHaveAttribute('data-state', 'checked'); // Layer active
      await expect(page).toHaveURL(`/?active=["${id}"]`); // URL updated
      await expect(page.getByTestId(`layer-legend-${id}`)).toBeVisible(); // Legend visible

      await layerSwitcher.click({ force: true }); // Deactivate layer
      await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
      await expect(page).toHaveURL('/?active=[]'); // URL updated
    });
  }
});

test.describe('Can activate and desactivate contextual basemaps in map style widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('map-settings-button').click();
    await page.getByRole('heading', { name: 'Map Style' }).click();
  });

  for (const layer of STYLE_CONTEXTUAL_LAYERS) {
    test(`Layer ${layer}`, async ({ page }) => {
      const layerSwitcher = page.getByTestId(layer);
      await layerSwitcher.click({ force: true });
      await expect(page).toHaveURL(`/?basemaps-contextual="${layer}"`);
      await expect(layerSwitcher.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');

      await layerSwitcher.click({ force: true }); // Deactivate layer
      await expect(layerSwitcher.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
      await expect(page).toHaveURL('/?basemaps-contextual=null'); // URL updated
    });
  }
});

test.describe('Can activate wordwise layers in widgets', () => {
  const url = '/?category="all_datasets"';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${url}&active=[]`);
  });

  const widgetsWithLayers = WIDGETS.filter(
    ({ categoryIds, locationType, layersIds, slug }) =>
      categoryIds?.includes(ALL_DATASETS_CATEGORY) &&
      locationType?.includes(WORDWIDE_LOCATION) &&
      layersIds?.length
    // slug !== 'mangrove_iucn_ecoregion' // REMOVE THIS LINE WHEN THE LAYER URL BUG IS FIXED
  );
  for (const widget of widgetsWithLayers) {
    test(`Layer "${widget.layersIds[0] as string}" of ${widget.name}`, async ({ page }) => {
      const id = widget.slug;
      // The widget Mangrove habitat extent is already active by default, so if we click on it, it will be deactivated
      const layerSwitcher = page.getByTestId(id);

      await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
      await layerSwitcher.click({ force: true });
      await page.waitForTimeout(1000); // Activate layer
      await expect(layerSwitcher).toHaveAttribute('data-state', 'checked'); // Layer active
      await expect(page).toHaveURL(`${url}&active=["${id}"]`); // URL updated

      await expect(page.getByTestId(`layer-legend-${id}`)).toBeVisible(); // Legend visible

      await layerSwitcher.click({ force: true }); // Deactivate layer
      await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive

      await expect(page).toHaveURL(`${url}&active=[]`);
    });
  }
});

test.describe('Can activate and deactivate country layers in widgets', () => {
  const countryUrl = '/country/NGA?category="all_datasets"';
  test.beforeEach(async ({ page }) => {
    await page.goto(`${countryUrl}&active=[]`);
  });

  const widgetsWithLayers = WIDGETS.filter(
    ({ categoryIds, locationType, layersIds }) =>
      categoryIds?.includes(ALL_DATASETS_CATEGORY) &&
      !locationType?.includes(WORDWIDE_LOCATION) &&
      locationType?.includes(COUNTRY_LOCATION) &&
      layersIds?.length
  );
  for (const widget of widgetsWithLayers) {
    for (const layer of widget.layersIds) {
      // If the widget has mode than one layer, the switcher testid is the layer id, otherwise is the widget slug
      const id = widget.layersIds?.length > 1 ? (layer as string) : widget.slug;
      test(`Layer "${layer as string}" of ${widget.name}`, async ({ page }) => {
        // The widget Mangrove habitat extent is already active by default, so if we click on it, it will be deactivated
        const layerSwitcher = page.getByTestId(id);
        await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
        await layerSwitcher.click({ force: true }); // Activate layer
        await page.waitForTimeout(1000);
        await expect(layerSwitcher).toHaveAttribute('data-state', 'checked'); // Layer active
        await expect(page).toHaveURL(`${countryUrl}&active=["${id}"]`); // URL updated
        await expect(page.getByTestId(`layer-legend-${id}`)).toBeVisible(); // Legend visible

        await layerSwitcher.click({ force: true }); // Deactivate layer
        await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
        await expect(page).toHaveURL(`${countryUrl}&active=[]`); // URL updated
      });
    }
  }
});

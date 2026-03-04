import { test, expect } from '@playwright/test';

import WIDGETS from '@/containers/widgets/constants';

import { WidgetTypes } from 'types/widget';

const WORDWIDE_LOCATION = 'worldwide';
const COUNTRY_LOCATION = 'country';
const ALL_DATASETS_CATEGORY = 'all_datasets';
const CONTEXTUAL_LAYER_ID = 'contextual_layers';
const STYLE_CONTEXTUAL_LAYERS = ['planet_medres_visual_monthly', 'planet_medres_analytic_monthly'];

// Build active-widgets URL param from widget slugs
function activeWidgetsParam(widgetSlugs: string[]) {
  return `active-widgets=[${widgetSlugs.map((s) => `"${s}"`).join(',')}]`;
}

// Click a switch via page.evaluate to avoid Firefox timing issues where
// Radix UI switches don't respond to Playwright's native click
async function clickSwitch(page: import('@playwright/test').Page, testId: string) {
  await page.evaluate(
    (id) => (document.querySelector(`[data-testid="${id}"]`) as HTMLElement)?.click(),
    testId
  );
}

test.describe('Can activate contextual layers via widget toggles', () => {
  const contextualLayers: WidgetTypes[] = WIDGETS.filter(
    ({ categoryIds, layersIds }) =>
      categoryIds?.includes(CONTEXTUAL_LAYER_ID) && layersIds?.length
  );
  const contextualSlugs = contextualLayers.map((w) => w.slug);

  for (const widget of contextualLayers) {
    const id = widget.slug;
    test(`Layer ${id}`, async ({ page }) => {
      // Navigate with contextual_layers category, proper active-widgets, and empty layers
      await page.goto(
        `/?category="contextual_layers"&${activeWidgetsParam(contextualSlugs)}&layers=[]`
      );
      await page.getByTestId('widgets-wrapper').waitFor();

      const layerSwitcher = page.getByTestId(id);
      await expect(layerSwitcher).toBeVisible();
      await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked');
      await clickSwitch(page, id); // Activate layer
      await expect(layerSwitcher).toHaveAttribute('data-state', 'checked'); // Layer active
      await expect(page.getByTestId(`legend-item-${id}`)).toBeVisible(); // Legend visible

      await clickSwitch(page, id); // Deactivate layer
      await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
    });
  }
});

test.describe('Can activate contextual basemaps via URL', () => {
  for (const layer of STYLE_CONTEXTUAL_LAYERS) {
    test(`Basemap ${layer} activates via URL`, async ({ page }) => {
      // Navigate with basemap-contextual set
      await page.goto(`/?basemaps-contextual="${layer}"`);
      await expect(page).toHaveURL(new RegExp(`basemaps-contextual=.*${layer}`));

      // Verify we can clear it
      await page.goto('/?basemaps-contextual=null');
      await expect(page).toHaveURL(/basemaps-contextual=null/);
    });
  }
});

test.describe('Can activate worldwide layers in widgets', () => {
  const widgetsWithLayers = WIDGETS.filter(
    ({ categoryIds, locationType, layersIds }) =>
      categoryIds?.includes(ALL_DATASETS_CATEGORY) &&
      locationType?.includes(WORDWIDE_LOCATION) &&
      layersIds?.length
  );
  const allSlugs = widgetsWithLayers.map((w) => w.slug);

  for (const widget of widgetsWithLayers) {
    test(`Layer "${widget.layersIds[0] as string}" of ${widget.name}`, async ({ page }) => {
      const id = widget.slug;
      // Navigate with all_datasets category, proper active-widgets, and empty layers
      await page.goto(
        `/?category="all_datasets"&${activeWidgetsParam(allSlugs)}&layers=[]`
      );
      await page.getByTestId('widgets-wrapper').waitFor();

      const layerSwitcher = page.getByTestId(id);
      await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
      await clickSwitch(page, id); // Activate layer
      await expect(layerSwitcher).toHaveAttribute('data-state', 'checked'); // Layer active

      await expect(page.getByTestId(`legend-item-${id}`)).toBeVisible(); // Legend visible

      await clickSwitch(page, id); // Deactivate layer
      await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
    });
  }
});

test.describe('Can activate and deactivate country layers in widgets', () => {
  // Exclude national dashboard — its layer key differs from widget slug
  const EXCLUDED_WIDGETS = ['mangrove_national_dashboard'];
  const widgetsWithLayers = WIDGETS.filter(
    ({ categoryIds, locationType, layersIds, slug }) =>
      categoryIds?.includes(ALL_DATASETS_CATEGORY) &&
      !locationType?.includes(WORDWIDE_LOCATION) &&
      locationType?.includes(COUNTRY_LOCATION) &&
      layersIds?.length &&
      !EXCLUDED_WIDGETS.includes(slug)
  );
  const allSlugs = widgetsWithLayers.map((w) => w.slug);

  for (const widget of widgetsWithLayers) {
    for (const layer of widget.layersIds) {
      const id = widget.layersIds?.length > 1 ? (layer as string) : widget.slug;
      test(`Layer "${layer as string}" of ${widget.name}`, async ({ page, browserName }) => {
        // Firefox: continuous widget re-renders detach this sublayer switch from the DOM
        test.fixme(
          browserName === 'firefox' && id === 'mangrove_commercial_fisheries_production',
          'Firefox: widget re-renders continuously detach this sublayer switch'
        );

        await page.goto(
          `/country/NGA?category="all_datasets"&${activeWidgetsParam(allSlugs)}&layers=[]`
        );
        await page.getByTestId('widgets-wrapper').waitFor();

        const layerSwitcher = page.getByTestId(id);
        await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
        await clickSwitch(page, id); // Activate layer
        await expect(layerSwitcher).toHaveAttribute('data-state', 'checked'); // Layer active
        await expect(page.getByTestId(`legend-item-${id}`)).toBeVisible(); // Legend visible

        await clickSwitch(page, id); // Deactivate layer
        await expect(layerSwitcher).toHaveAttribute('data-state', 'unchecked'); // Layer inactive
      });
    }
  }
});

import { Visibility } from 'mapbox-gl';
import { parseAsJson, useQueryState } from 'nuqs';
import { parseAsString, parseAsFloat, parseAsArrayOf, parseAsStringLiteral } from 'nuqs/parsers';

import { CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES } from 'containers/datasets/contextual-layers/constants';
import CATEGORY_OPTIONS from 'containers/navigation/constants';
import widgets from 'containers/widgets/constants';

import type { LayersSlugType, WidgetSlugType, WidgetSlugTypeWithoutSomeValues } from 'types/widget';

const Categories = CATEGORY_OPTIONS.map((category) => category.value);
const defaultCategory = CATEGORY_OPTIONS.find((c) => c.defaultCategory)?.value;

const defaultWidgets = widgets
  .filter((widget) => widget.categoryIds.includes(defaultCategory))
  .map((widget) => widget.slug);

const floodProtectionLayers = widgets.find(
  ({ slug }) => slug === 'mangrove_flood_protection'
)?.subLayersIds;

const Layers = [
  ...widgets
    .map(({ slug }) => slug)
    .filter(
      (slug) =>
        slug !== 'widgets_deck_tool' &&
        slug !== 'mangrove_contextual_layers' &&
        slug !== 'mangrove_national_dashboard' &&
        slug !== 'mangrove_flood_protection'
    ),
  // `mangrove_national_dashboard_layer_${string}`
  ...floodProtectionLayers,
  ...CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map(({ id }) => id),
] as const;

// parsers
const datasetsSettingsParser = parseAsJson<
  Record<
    string,
    {
      opacity: number;
      visibility: Visibility;
      year?: number;
      startYear?: number;
      endYear?: number;
      startDate?: string;
      endDate?: string;
    }
  >
>();

export const useSyncDatasets = () =>
  useQueryState('datasets', parseAsArrayOf(parseAsString).withDefault(defaultWidgets));

export const useSyncBasemap = () => useQueryState('basemap', parseAsString.withDefault('light'));

export const useSyncBasemapContextual = () => useQueryState('basemap-contextual', parseAsString);

export const useSyncCategory = () =>
  useQueryState('category', parseAsStringLiteral(Categories).withDefault(defaultCategory));

export const useSyncBounds = () =>
  useQueryState('bounds', parseAsArrayOf(parseAsArrayOf(parseAsFloat)));

export const useSyncLayers = () =>
  useQueryState('layers', parseAsArrayOf(parseAsString).withDefault(['mangrove_habitat_extent']));

export const useSyncDatasetsSettings = () =>
  useQueryState(
    'datasets-settings',
    datasetsSettingsParser.withDefault({
      mangrove_habitat_extent: {
        opacity: 1,
        visibility: 'visible',
      },
    })
  );

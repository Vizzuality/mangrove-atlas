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
  .map((widget) => widget.slug) satisfies WidgetSlugType[];

const datasetsSettingsParser = parseAsJson<Record<string, Record<string, unknown>>>();

const Widgets = [
  ...widgets.map(({ slug }) => slug),
  ...CONTEXTUAL_LAYERS_PLANET_SERIES_ATTRIBUTES.map(({ id }) => id),
] as const;

const layersParser = parseAsStringLiteral(Widgets);

export const useSyncDatasets = () =>
  useQueryState('datasets', parseAsArrayOf(parseAsString).withDefault(defaultWidgets));

export const useSyncBasemap = () => useQueryState('basemap', parseAsString.withDefault('light'));

export const useSyncBasemapContextual = () => useQueryState('basemap-contextual', parseAsString);

export const useSyncCategory = () =>
  useQueryState('category', parseAsStringLiteral(Categories).withDefault(defaultCategory));

export const useSyncBounds = () =>
  useQueryState('bounds', parseAsArrayOf(parseAsArrayOf(parseAsFloat)));

export const useSyncLayers = () =>
  useQueryState(
    'layers',
    parseAsArrayOf(layersParser).withDefault(['planet_medres_analytic_monthly'])
  );

// Assuming parseAsJson is correctly typed to parse a JSON string into a specific object structure.

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

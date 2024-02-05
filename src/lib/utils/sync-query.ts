import { parseAsJson, useQueryState } from 'nuqs';
import { parseAsString, parseAsFloat, parseAsArrayOf, parseAsStringLiteral } from 'nuqs/parsers';

import CATEGORY_OPTIONS from 'containers/navigation/constants';
import widgets from 'containers/widgets/constants';

import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const Categories = CATEGORY_OPTIONS.map((category) => category.value);
const defaultCategory = CATEGORY_OPTIONS.find((c) => c.defaultCategory)?.value;

const defaultWidgets = widgets
  .filter((widget) => widget.categoryIds.includes(defaultCategory))
  .map((widget) => widget.slug) satisfies WidgetSlugType[];

const datasetsSettingsParser = parseAsJson<{
  [key: string]: Record<string, unknown>;
}>();

const Widgets = [
  ...widgets.map(({ slug }) => slug),
  ...(['planet_medres_analytic_monthly'] as ContextualBasemapsId[]),
];

const layersParser = parseAsStringLiteral(
  Widgets satisfies (ContextualBasemapsId | WidgetSlugType)[]
);

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

export const useSyncDatasetsSettings = () =>
  useQueryState(
    'datasets-settings',
    parseAsArrayOf(datasetsSettingsParser).withDefault([
      {
        mangrove_habitat_extent: {
          opacity: 1,
          visibility: 'visible',
        },
      },
    ])
  );

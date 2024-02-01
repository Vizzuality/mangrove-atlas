import { parseAsInteger, useQueryState } from 'nuqs';
import {
  parseAsString,
  parseAsFloat,
  parseAsArrayOf,
  parseAsStringLiteral,
  createParser,
} from 'nuqs/parsers';

import CATEGORY_OPTIONS from 'containers/navigation/constants';
import widgets from 'containers/widgets/constants';

import { WidgetSlugType } from 'types/widget';

const Categories = CATEGORY_OPTIONS.map((category) => category.value);
const defaultCategory = CATEGORY_OPTIONS.find((c) => c.defaultCategory)?.value;

const defaultWidgets = widgets
  .filter((widget) => widget.categoryIds.includes(defaultCategory))
  .map((widget) => widget.slug) satisfies WidgetSlugType[];

// createParser({
//   parse(query) {
//     if (query.length !== 6) {
//       return null; // always return null for invalid inputs
//     }
//     return {
//       // When composing other parsers, they may return null too.
//       r: parseAsHex.parse(query.slice(0, 2)) ?? 0x00,
//       g: parseAsHex.parse(query.slice(2, 4)) ?? 0x00,
//       b: parseAsHex.parse(query.slice(4)) ?? 0x00,
//     };
//   },
//   serialize({ r, g, b }) {
//     return parseAsHex.serialize(r) + parseAsHex.serialize(g) + parseAsHex.serialize(b);
//   },
// });

const LayerSettings = {
  name: parseAsString,
  source: parseAsString,
  source_layer: parseAsString,
  date: parseAsString,
  location: parseAsString,
  layerIndex: parseAsInteger,
};

const layerSchema = {
  id: parseAsString,
  opacity: parseAsString,
  // visibility: parseAsStringLiteral({
  //   none: 'none',
  //   visible: 'visible',
  // }),
  settings: LayerSettings,
};

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
  useQueryState('datasets-settings', parseAsArrayOf(parseAsArrayOf(parseAsString)));

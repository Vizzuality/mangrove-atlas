import { useQueryState } from 'nuqs';
import { parseAsString, parseAsArrayOf } from 'nuqs/parsers';

import widgets from 'containers/widgets/constants';

import type { Category } from 'types/category';
import { WidgetSlugType } from 'types/widget';

// by default we want to show all widgets in the distribution and change category
const defaultCategory: Category = 'distribution_and_change';

const defaultWidgets = widgets
  .filter((widget) => widget.categoryIds.includes(defaultCategory))
  .map((widget) => widget.slug) satisfies WidgetSlugType[];

export const useSyncDatasets = () =>
  useQueryState('datasets', parseAsArrayOf(parseAsString).withDefault(defaultWidgets));

export const useSyncBasemap = () => useQueryState('basemap', parseAsString.withDefault('light'));

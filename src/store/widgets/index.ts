import { atom } from 'jotai';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

import widgets from '@/containers/widgets/constants';

import type { Category } from 'types/category';
import type { WidgetSlugType } from 'types/widget';

// by default we want to show all widgets in the distribution and change category
const defaultCategory: Category = 'distribution_and_change';
const defaultWidgets = widgets
  .filter((widget) => widget.categoryIds?.includes(defaultCategory))
  .map((widget) => widget.slug) satisfies WidgetSlugType[];

export function useSyncActiveWidgets() {
  return useQueryState('active-widgets', parseAsArrayOf(parseAsString).withDefault(defaultWidgets));
}

export const widgetsCollapsedAtom = atom(
  widgets.reduce((previousObject, currentObject) => {
    return Object.assign(previousObject, {
      ...previousObject,
      [currentObject.slug]: false,
      mangrove_drawing_tool: false,
      mangrove_drawing_upload_tool: false,
    });
  }, {})
);

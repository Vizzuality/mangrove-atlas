import { array, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import widgets from 'containers/widgets/constants';
import type { Category } from 'types/category';
import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

// by default we want to show all widgets in the distribution and change category
const defaultCategory: Category = 'distribution_and_change';
const defaultWidgets = widgets
  .filter((widget) => widget.categoryIds?.includes(defaultCategory))
  .map((widget) => widget.slug) satisfies WidgetSlugType[];

export const activeWidgetsAtom = atom<(WidgetSlugType | ContextualBasemapsId | 'custom-area')[]>({
  key: 'active-widgets',
  default: defaultWidgets,
  effects: [
    urlSyncEffect({
      refine: array(string()),
      history: 'replace',
    }),
  ],
});

export const widgetsCollapsedAtom = atom({
  key: 'widgets-collapsed',
  default: widgets.reduce((previousObject, currentObject) => {
    return Object.assign(previousObject, {
      ...previousObject,
      [currentObject.slug]: false,
      mangrove_drawing_tool: false,
      mangrove_drawing_upload_tool: false,
    });
  }, {}),
});

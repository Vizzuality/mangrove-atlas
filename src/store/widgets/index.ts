import { array, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import widgets from 'containers/widgets/constants';

import { WidgetSlugType } from 'types/widget';

export const activeWidgetsAtom = atom<WidgetSlugType[]>({
  key: 'active',
  default: ['mangrove_habitat_extent'],
  effects: [
    urlSyncEffect({
      refine: array(string()),
      history: 'push',
    }),
  ],
});

export const widgetYearAtom = atom<number>({
  key: 'year',
  default: null,
});

export const widgetsCollapsedAtom = atom({
  key: 'widgets-collapsed',
  default: widgets
    .filter(({ slug }) => slug !== 'mangrove_drawing_tool')
    .reduce((previousObject, currentObject) => {
      return Object.assign(previousObject, {
        [currentObject.slug]: false,
      });
    }, {}),
});

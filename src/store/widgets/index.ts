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

export const widgetsCollapsedAtom = atom({
  key: 'widgets-collapsed',
  default: widgets.reduce((previousObject, currentObject) => {
    return Object.assign(previousObject, {
      ...previousObject,
      [currentObject.slug]: false,
      mangrove_drawing_tool: false,
    });
  }, {}),
});

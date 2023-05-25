import { array, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import widgets from 'containers/widgets/constants';

export const activeWidgetsAtom = atom({
  key: 'active',
  default: ['mangrove_habitat_extent'],
  effects: [
    urlSyncEffect({
      refine: array(string()),
      history: 'push',
    }),
  ],
});

export const widgetYearAtom = atom({
  key: 'year',
  default: null,
});

export const widgetsCollapsedAtom = atom({
  key: 'widgets-collapsed',
  default: widgets.map((widget) => ({
    [widget.slug]: false,
  })),
});

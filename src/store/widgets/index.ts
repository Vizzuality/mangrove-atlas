import { array, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

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
  default: 2019,
});

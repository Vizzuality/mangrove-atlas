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

export const netChangeStartYearAtom = atom({
  key: 'net-change-start-year',
  default: null,
});

export const netChangeEndYearAtom = atom({
  key: 'net-change-end-year',
  default: null,
});

export const useWidgetSettings = atom({
  key: 'widgets-settings',
  default: {
    mangrove_habitat_extent: {
      year: null,
      unit: null,
    },
  },
});

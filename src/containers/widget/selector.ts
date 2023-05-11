import { activeWidgetsAtom } from 'store/widget';

import { selectorFamily } from 'recoil';

import type { WidgetSlugType } from 'types/widget';

export const getWidgetActive = selectorFamily({
  key: 'is-widget-active',
  get:
    (widgetId: WidgetSlugType) =>
    ({ get }) => {
      return get(activeWidgetsAtom).includes(widgetId);
    },
});

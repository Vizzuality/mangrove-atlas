import { useMemo } from 'react';

import { activeCategoryAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import type { WidgetTypes } from 'types/widget';

import widgets from './constants';

export function useWidgets(): WidgetTypes[] {
  const categorySelected = useRecoilValue(activeCategoryAtom);
  return useMemo(
    () => widgets.filter(({ categoryIds }) => categoryIds.includes(categorySelected)),
    [categorySelected]
  );
}

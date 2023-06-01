import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { activeCategoryAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import type { WidgetTypes } from 'types/widget';

import widgets from './constants';

export function useWidgets(): WidgetTypes[] {
  const categorySelected = useRecoilValue(activeCategoryAtom);
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const currentLocation = locationType || 'worldwide';

  return useMemo(
    () =>
      widgets.filter(
        ({ categoryIds, locationType }) =>
          categoryIds.includes(categorySelected) && locationType.includes(currentLocation)
      ),
    [categorySelected, currentLocation]
  );
}

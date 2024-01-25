import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { analysisAtom } from 'store/analysis';
import { mapSettingsAtom } from 'store/map-settings';
import { activeCategoryAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import { WIDGETS_BY_CATEGORY } from 'containers/widgets/constants';

import type { Category } from 'types/category';
import type { WidgetSlugType, WidgetTypes } from 'types/widget';

import widgets, { ANALYSIS_WIDGETS_SLUGS, MAP_SETTINGS_SLUGS } from './constants';

export function useWidgets(): WidgetTypes[] {
  const categorySelected = useRecoilValue(activeCategoryAtom);

  const isMapSettingsVisible = useRecoilValue(mapSettingsAtom);
  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const currentLocation = locationType || 'worldwide';

  return useMemo(() => {
    if (isAnalysisRunning) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }

    if (isMapSettingsVisible) {
      return widgets.filter(({ slug }) => MAP_SETTINGS_SLUGS.includes(slug));
    }

    return widgets.filter(
      ({ categoryIds, locationType }) =>
        categoryIds?.includes(categorySelected) && locationType.includes(currentLocation)
    );
  }, [categorySelected, currentLocation, isAnalysisRunning, isMapSettingsVisible]);
}

export function useWidgetsIdsByLocation(): WidgetSlugType[] {
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const currentLocation = locationType || 'worldwide';

  return useMemo(
    () =>
      widgets
        .filter(({ locationType }) => locationType.includes(currentLocation))
        .map(({ slug }) => slug),
    [currentLocation]
  );
}

export function useWidgetsIdsByCategory(widgets): Category {
  const widgetsKey = widgets.slice().sort().join(',');

  for (const cat of WIDGETS_BY_CATEGORY) {
    const [category, slugsCategory] = Object.entries(cat)[0];
    const slugsCategoryKey = slugsCategory.slice().sort().join(',');

    if (widgetsKey === slugsCategoryKey) {
      return category as Category;
    }
  }

  return 'all_datasets';
}

import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { analysisAtom } from 'store/analysis';
import { mapSettingsAtom } from 'store/map-settings';
import { activeCategoryAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import { WIDGETS_BY_CATEGORY } from 'containers/widgets/constants';

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

export function useWidgetsIdsByCategory(widgets) {
  // Ensure input widgets are unique to avoid duplicate checks
  const widgetsSet: Set<string> = new Set(widgets.filter((w) => w !== 'widgets_deck_tool'));

  for (const cat of WIDGETS_BY_CATEGORY) {
    const [category, slugsCategory] = Object.entries(cat)[0];
    // Convert each category's widget array to a set for efficient lookup
    const slugsCategorySet = new Set(slugsCategory);
    // Check if every element in the category set is in the widgets set
    const isCategoryFullyInWidgets = [...slugsCategorySet].every((slug) => widgetsSet.has(slug));

    // Also, ensure that the input widgets set does not contain more items than the current category
    // This is done by checking if every element in the widgets set is in the category set
    const areWidgetsOnlyFromCategory = [...widgetsSet].every((widget) =>
      slugsCategorySet.has(widget)
    );

    // Check for an exact match in terms of content and count
    if (isCategoryFullyInWidgets && areWidgetsOnlyFromCategory) {
      return category;
    }
  }

  return 'all_datasets';
}

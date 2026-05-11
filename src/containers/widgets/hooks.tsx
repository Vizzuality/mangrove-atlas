import { useMemo } from 'react';

import { analysisAtom } from '@/store/analysis';
import { mapSettingsAtom } from '@/store/map-settings';
import { useSyncActiveCategory } from '@/store/sidebar';

import { useAtomValue } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import type { WidgetSlugType, WidgetTypes } from 'types/widget';

import widgets, { ANALYSIS_WIDGETS_SLUGS, MAP_SETTINGS_SLUGS } from './constants';

export function useWidgets(): WidgetTypes[] {
  const [categorySelected] = useSyncActiveCategory();

  const isMapSettingsVisible = useAtomValue(mapSettingsAtom);
  const { enabled: isAnalysisRunning } = useAtomValue(analysisAtom);
  const { type: locationType } = useSyncLocation();
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
  const { type: locationType } = useSyncLocation();
  const currentLocation = locationType || 'worldwide';

  return useMemo(
    () =>
      widgets
        .filter(({ locationType }) => locationType.includes(currentLocation))
        .map(({ slug }) => slug),
    [currentLocation]
  );
}

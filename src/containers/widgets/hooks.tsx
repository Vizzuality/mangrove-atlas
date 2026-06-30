import { useMemo } from 'react';

import { analysisAtom } from '@/store/analysis';
import { mapSettingsAtom } from '@/store/map-settings';
import { isOfflineAtom } from '@/store/offline';
import { useSyncActiveCategory } from '@/store/sidebar';

import { useAtomValue } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import type { WidgetSlugType, WidgetTypes } from 'types/widget';

import widgets, {
  ANALYSIS_WIDGETS_SLUGS,
  MAP_SETTINGS_SLUGS,
  OFFLINE_ENABLED_WIDGETS_SLUGS,
} from './constants';

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
  const isOffline = useAtomValue(isOfflineAtom);

  return useMemo(
    () =>
      widgets
        .filter(({ locationType }) => locationType.includes(currentLocation))
        // Offline: only the offline-supported widgets are enabled; the rest
        // surface as disabled (the consumer greys them via `enabledWidgets`).
        .filter(({ slug }) => !isOffline || OFFLINE_ENABLED_WIDGETS_SLUGS.includes(slug))
        .map(({ slug }) => slug),
    [currentLocation, isOffline]
  );
}

/** True when a widget should render disabled because we're offline and it's not
 * one of the offline-supported widgets (extent, alerts). */
export function useIsWidgetDisabledOffline(slug: WidgetSlugType): boolean {
  const isOffline = useAtomValue(isOfflineAtom);
  return isOffline && !OFFLINE_ENABLED_WIDGETS_SLUGS.includes(slug);
}

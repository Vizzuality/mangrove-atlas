import { useEffect, useMemo } from 'react';

import { analysisAtom } from '@/store/analysis';
import { useSyncActiveLayers } from '@/store/layers';
import { mapSettingsAtom } from '@/store/map-settings';
import { isOfflineAtom } from '@/store/offline';
import { useSyncActiveCategory } from '@/store/sidebar';
import { useSyncActiveWidgets } from '@/store/widgets';

import { useAtomValue } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import type { Visibility } from '@/types/layers';
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
 * one of the offline-supported widgets (extent, net change, alerts). */
export function useIsWidgetDisabledOffline(slug: WidgetSlugType): boolean {
  const isOffline = useAtomValue(isOfflineAtom);
  return isOffline && !OFFLINE_ENABLED_WIDGETS_SLUGS.includes(slug);
}

/**
 * When offline, force the offline-supported widgets (extent, net change, alerts)
 * to be active and their map layers visible, so the usable widgets surface on top
 * with their layers already drawn — without the user hand-toggling each one. Only
 * touches widgets valid for the current location; never removes the user's other
 * selections, so returning online leaves their setup intact.
 */
export function useActivateOfflineWidgets(): void {
  const isOffline = useAtomValue(isOfflineAtom);
  const [, setActiveWidgets] = useSyncActiveWidgets();
  const [, setActiveLayers] = useSyncActiveLayers();
  const { type: locationType } = useSyncLocation();
  const currentLocation = locationType || 'worldwide';

  useEffect(() => {
    if (!isOffline) return;

    const slugs = OFFLINE_ENABLED_WIDGETS_SLUGS.filter((slug) =>
      widgets.find((w) => w.slug === slug)?.locationType.includes(currentLocation)
    );
    if (!slugs.length) return;

    // Prepend the offline widgets (deduped) so they sit on top of the sidebar.
    setActiveWidgets((current) => {
      const base = current ?? [];
      const others = base.filter((s) => !slugs.includes(s as WidgetSlugType));
      return [...slugs, ...others];
    });

    // Add any offline layer not already active, visible, on top of the stack.
    setActiveLayers((current) => {
      const base = current ?? [];
      const missing = slugs
        .filter((slug) => !base.some((l) => l.id === slug))
        .map((slug) => ({ id: slug, opacity: '1', visibility: 'visible' as Visibility }));
      return missing.length ? [...missing, ...base] : base;
    });
  }, [isOffline, currentLocation, setActiveWidgets, setActiveLayers]);
}

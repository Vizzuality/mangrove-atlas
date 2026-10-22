import { useCallback } from 'react';

import { getMapBounds } from '@/lib/map-fly';

import { useSyncActiveLayers } from '@/store/layers';
import { tmpCameraAtom, useSyncBasemap, useSyncURLBounds } from '@/store/map';
import { useSyncActiveWidgets } from '@/store/widgets';

import { useSetAtom } from 'jotai';

import type { UserSettings } from 'services/auth';

// URL keys that make up a map "view". If any is present on load, the URL wins over
// the user's saved default.
export const VIEW_QUERY_KEYS = ['basemap', 'active-widgets', 'layers', 'bounds'] as const;

/**
 * Reads the current map view as `UserSettings`, and writes a saved view (or the
 * platform default) back into the URL state + camera.
 */
export function useDefaultView() {
  const [basemap, setBasemap] = useSyncBasemap();
  const [widgets, setWidgets] = useSyncActiveWidgets();
  const [layers, setLayers] = useSyncActiveLayers();
  const [URLBounds, setURLBounds] = useSyncURLBounds();
  const setTmpCamera = useSetAtom(tmpCameraAtom);

  const getCurrentView = useCallback((): Omit<UserSettings, 'saved_at'> => {
    const bounds = getMapBounds() ?? (URLBounds as UserSettings['bounds']) ?? undefined;
    return {
      basemap: basemap as UserSettings['basemap'],
      widgets,
      layers: layers.map(({ id, opacity }) => ({ id, opacity: Number(opacity) })),
      ...(bounds && { bounds }),
    };
  }, [basemap, widgets, layers, URLBounds]);

  const applyView = useCallback(
    (settings: UserSettings) => {
      void setBasemap(settings.basemap);
      void setWidgets(settings.widgets);
      void setLayers(
        settings.layers.map(({ id, opacity }) => ({
          id: id as (typeof layers)[number]['id'],
          opacity: String(opacity),
          visibility: 'visible',
        }))
      );
      if (settings.bounds) {
        const [[w, s], [e, n]] = settings.bounds;
        setTmpCamera({ bbox: [w, s, e, n] });
      }
    },
    [setBasemap, setWidgets, setLayers, setTmpCamera]
  );

  // Clearing the keys falls back to each parser's `withDefault` value.
  const resetView = useCallback(() => {
    void setBasemap(null);
    void setWidgets(null);
    void setLayers(null);
    void setURLBounds(null);
    setTmpCamera({ worldwide: true });
  }, [setBasemap, setWidgets, setLayers, setURLBounds, setTmpCamera]);

  return { getCurrentView, applyView, resetView };
}

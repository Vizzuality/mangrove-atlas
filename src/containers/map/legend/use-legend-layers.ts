import { useCallback, useEffect, useMemo } from 'react';

import { trackEvent } from '@/lib/analytics/ga';

import { useSyncActiveLayers } from '@/store/layers';

import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';
import { LocationTypes } from '@/containers/datasets/locations/types';
import { NATIONAL_DASHBOARD_LOCATIONS } from '@/containers/layers/constants';
import { widgets } from '@/containers/widgets/constants';

import type { Layer } from 'types/layers';
import type { WidgetTypes } from 'types/widget';

const NATIONAL_DASHBOARD_PREFIX = 'mangrove_national_dashboard_layer_';

const filterLayersByLocationType = (
  widgetsConfig: WidgetTypes[],
  currentLocationType: string
): string[] => {
  const filteredIds: string[] = [];
  widgetsConfig.forEach((widget) => {
    if (widget.locationType?.includes(currentLocationType)) {
      if (widget.layersIds) filteredIds.push(...widget.layersIds);
      if (widget.contextualLayersIds) filteredIds.push(...widget.contextualLayersIds);
      if (widget.subLayersIds) filteredIds.push(...widget.subLayersIds);
    }
  });
  return filteredIds;
};

export const useLegendLayers = () => {
  const [activeLayers, setActiveLayers] = useSyncActiveLayers();

  const { type, id: locationId } = useSyncLocation();
  const locationType = (type ?? 'worldwide') as LocationTypes;

  const { data: locationData } = useLocation(locationId, locationType);
  const iso = locationData?.iso;
  const nationalLayerIdPrefix = iso ? `${NATIONAL_DASHBOARD_PREFIX}${iso}` : null;

  useEffect(() => {
    if (!iso) return;
    setActiveLayers((prev) => {
      const current = prev ?? [];
      const next = current.filter(
        (layer) =>
          !layer.id.startsWith(NATIONAL_DASHBOARD_PREFIX) ||
          layer.id.startsWith(`${NATIONAL_DASHBOARD_PREFIX}${iso}_`) ||
          layer.id === `${NATIONAL_DASHBOARD_PREFIX}${iso}`
      );
      return next.length === current.length ? prev : next;
    });
  }, [iso, setActiveLayers]);

  const filteredLayersIds = useMemo(
    () => filterLayersByLocationType(widgets, locationType),
    [locationType]
  );

  const filteredLayers = useMemo(() => {
    const matched = (activeLayers ?? []).filter((layer) => {
      const isStandardLayer = filteredLayersIds.includes(layer.id);
      const isCurrentNationalLayer =
        !!nationalLayerIdPrefix &&
        (layer.id === nationalLayerIdPrefix || layer.id.startsWith(`${nationalLayerIdPrefix}_`));
      return isStandardLayer || isCurrentNationalLayer;
    }) as Layer[];

    const firstNationalIdx = matched.findIndex((layer) =>
      layer.id.startsWith(NATIONAL_DASHBOARD_PREFIX)
    );
    return matched.filter(
      (layer, idx) => !layer.id.startsWith(NATIONAL_DASHBOARD_PREFIX) || idx === firstNationalIdx
    );
  }, [activeLayers, filteredLayersIds, nationalLayerIdPrefix]);

  const activeLayerNoPlanet = useMemo(
    () =>
      filteredLayers?.filter(
        (layer) => !layer.id.includes('planet') && !layer.id.includes('custom-area')
      ),
    [filteredLayers]
  );

  const legendLayers = useMemo(() => {
    const isNationalDashboardLocation =
      locationId != null && NATIONAL_DASHBOARD_LOCATIONS.includes(locationId);
    if (isNationalDashboardLocation) return activeLayerNoPlanet;
    return activeLayerNoPlanet?.filter((layer) => !layer.id.startsWith(NATIONAL_DASHBOARD_PREFIX));
  }, [activeLayerNoPlanet, locationId]);

  const handleChangeOrder = useCallback(
    (order: string[]) => {
      const reorderedLayers = order
        .map((layerId) => activeLayers?.find((layer) => layer.id === layerId))
        .filter(Boolean) as Layer[];

      const activePlanetLayers = activeLayers?.filter((layer) => layer.id.includes('planet')) ?? [];

      trackEvent('Layers order', {
        category: 'Layers',
        action: 'Drag and drop',
        label: `change layers order`,
      });

      setActiveLayers([...reorderedLayers, ...activePlanetLayers]);
    },
    [activeLayers, setActiveLayers]
  );

  return { legendLayers, handleChangeOrder };
};

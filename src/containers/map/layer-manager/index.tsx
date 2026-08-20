import { useCallback, useMemo } from 'react';

import { Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';
import { interactiveLayerIdsAtom } from '@/store/map';

import { useAtom } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import { BASEMAPS, LAYERS } from '@/containers/datasets';
import { NATIONAL_DASHBOARD_LOCATIONS } from '@/containers/layers/constants';

import type { LayerProps } from 'types/layers';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const CountryBoundariesLayer = LAYERS['country-boundaries'];

const LayerManagerContainer = ({
  layerIds,
  registerInteractions = true,
  includeInactive = false,
}: {
  /** Restrict rendering to these active layers. Defaults to all of them. */
  layerIds?: string[];
  /**
   * Secondary maps (the per-layer cards in the print report) must not touch the
   * shared `interactiveLayerIdsAtom` — unmounting one would strip ids the main
   * map still needs.
   */
  registerInteractions?: boolean;
  /**
   * Render every id in `layerIds` even without an active-layers entry. The
   * print report uses it for contextual-layer cards, whose layer may not have
   * been switched on in the app. Only meaningful together with `layerIds`.
   */
  includeInactive?: boolean;
} = {}) => {
  const [layers] = useSyncActiveLayers();
  const [, setInteractiveLayerIds] = useAtom(interactiveLayerIdsAtom);

  const activeLayersIds = useMemo(() => {
    const ids = layers?.map((l) => l?.id);
    if (!layerIds) return ids;
    const active = ids?.filter((id) => layerIds.some((layerId) => id?.includes(layerId))) ?? [];
    if (!includeInactive) return active;
    const missing = layerIds.filter((layerId) => !active.some((id) => id?.includes(layerId)));
    return [...active, ...missing];
  }, [layers, layerIds, includeInactive]);

  const ACTIVE_LAYERS = useMemo(() => {
    const filteredLayers = activeLayersIds?.filter(
      (layer: WidgetSlugType | ContextualBasemapsId | 'custom-area') => {
        return Object.keys(LAYERS).some((k) => layer?.includes(k));
      }
    );

    return filteredLayers;
  }, [activeLayersIds]);

  const { id } = useSyncLocation();

  // layers that act as basemap (planet imagery) must always be at the bottom
  const basemap_layers = ACTIVE_LAYERS?.filter((layer) => layer?.includes('planet'));
  const no_planet_layers = ACTIVE_LAYERS?.filter((layer) => !layer?.includes('planet'));

  const filterNationalDashboardLayers = !NATIONAL_DASHBOARD_LOCATIONS?.includes(id)
    ? no_planet_layers?.filter((l) => !l?.includes('national_dashboard'))
    : no_planet_layers;

  const LAYERS_FILTERED = [...(filterNationalDashboardLayers || []), ...(basemap_layers || [])];

  const handleAdd = useCallback(
    (styleIds: LayerProps['id'][]) => {
      if (!registerInteractions) return;
      setInteractiveLayerIds((prevInteractiveIds) => [...prevInteractiveIds, ...styleIds]);
    },
    [registerInteractions, setInteractiveLayerIds]
  );

  const handleRemove = useCallback(
    (styleIds: LayerProps['id'][]) => {
      if (!registerInteractions) return;
      setInteractiveLayerIds((prevInteractiveIds) => [
        ...prevInteractiveIds.filter((id) => !styleIds?.includes(id)),
      ]);
    },
    [registerInteractions, setInteractiveLayerIds]
  );

  return (
    <>
      <CountryBoundariesLayer
        id="country-boundaries-layer"
        beforeId="water"
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      {LAYERS_FILTERED.map((layer, i) => {
        const beforeId = i === 0 ? 'custom-layers' : `${LAYERS_FILTERED[i - 1]}-bg`;

        return (
          <Layer
            id={`${layer}-bg`}
            key={`${layer}-bg`}
            type="background"
            layout={{ visibility: 'none' }}
            beforeId={beforeId}
          />
        );
      })}

      {LAYERS_FILTERED.map((layer, i) => {
        const beforeId = i === 0 ? 'custom-layers' : `${LAYERS_FILTERED[i - 1]}-bg`;

        return (
          <Layer
            id={`${layer}-bg`}
            key={`${layer}-bg`}
            type="background"
            layout={{ visibility: 'none' }}
            beforeId={beforeId}
          />
        );
      })}

      {LAYERS_FILTERED.map((layer, i) => {
        const layerId = Object.keys(LAYERS).find((k) => layer?.includes(k));

        const LayerComponent = LAYERS[layerId] || BASEMAPS[layerId];
        const beforeId = i === 0 ? 'custom-layers' : `${LAYERS_FILTERED[i - 1]}-bg`;
        return (
          <LayerComponent
            id={layer}
            key={layer}
            beforeId={beforeId}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        );
      })}
    </>
  );
};

export default LayerManagerContainer;

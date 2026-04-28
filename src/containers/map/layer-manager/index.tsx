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

const LayerManagerContainer = () => {
  const [layers] = useSyncActiveLayers();
  const [, setInteractiveLayerIds] = useAtom(interactiveLayerIdsAtom);

  const activeLayersIds = useMemo(() => layers?.map((l) => l?.id), [layers]);

  const ACTIVE_LAYERS = useMemo(() => {
    const filteredLayers = activeLayersIds?.filter(
      (layer: WidgetSlugType | ContextualBasemapsId | 'custom-area') => {
        return Object.keys(LAYERS).some((k) => layer?.includes(k));
      }
    );

    return filteredLayers;
  }, [activeLayersIds]);

  const { id } = useSyncLocation();

  // layers that act as basemap (such planet imagery or high resolution extent) must be always at the bottom
  const basemap_layers = ACTIVE_LAYERS?.filter(
    (layer) => layer?.includes('planet') || layer === 'hi-res-extent'
  );
  const no_planet_layers = ACTIVE_LAYERS?.filter(
    (layer) => !layer?.includes('planet') && layer !== 'hi-res-extent'
  );

  const filterNationalDashboardLayers = !NATIONAL_DASHBOARD_LOCATIONS?.includes(id)
    ? no_planet_layers?.filter((l) => !l?.includes('national_dashboard'))
    : no_planet_layers;

  const LAYERS_FILTERED = [...(filterNationalDashboardLayers || []), ...(basemap_layers || [])];

  const handleAdd = useCallback(
    (styleIds: LayerProps['id'][]) => {
      setInteractiveLayerIds((prevInteractiveIds) => [...prevInteractiveIds, ...styleIds]);
    },
    [setInteractiveLayerIds]
  );

  const handleRemove = useCallback(
    (styleIds: LayerProps['id'][]) => {
      setInteractiveLayerIds((prevInteractiveIds) => [
        ...prevInteractiveIds.filter((id) => !styleIds?.includes(id)),
      ]);
    },
    [setInteractiveLayerIds]
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

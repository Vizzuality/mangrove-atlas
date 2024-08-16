import { useMemo, useCallback } from 'react';

import { Layer } from 'react-map-gl';

import { useRouter } from 'next/router';

import { activeLayersAtom } from 'store/layers';
import { interactiveLayerIdsAtom } from 'store/map';

import { useRecoilState } from 'recoil';

import { LAYERS, BASEMAPS } from 'containers/datasets';
import { LocationTypes } from 'containers/datasets/locations/types';
import { NATIONAL_DASHBOARD_LOCATIONS } from 'containers/layers/constants';
import { widgets } from 'containers/widgets/constants';

import type { LayerProps } from 'types/layers';
import type { WidgetTypes } from 'types/widget';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const CountryBoundariesLayer = LAYERS['country-boundaries'];

const LayerManagerContainer = () => {
  const [layers] = useRecoilState(activeLayersAtom);

  const [, setInteractiveLayerIds] = useRecoilState(interactiveLayerIdsAtom);

  const activeLayersIds = layers?.map((l) => l.id);

  const ACTIVE_LAYERS = useMemo(() => {
    const filteredLayers = activeLayersIds?.filter(
      (layer: WidgetSlugType | ContextualBasemapsId | 'custom-area') => {
        return Object.keys(LAYERS).some((k) => layer?.includes(k));
      }
    );

    return filteredLayers;
  }, [activeLayersIds]);

  const {
    query: { params },
  } = useRouter();
  const id = params?.[1];

  const locationType = (params?.[0] || 'worldwide') as LocationTypes;
  function filterLayersByLocationType(widgets: WidgetTypes[], locationType: string): string[] {
    const filteredLayers: string[] = [];

    widgets.forEach((widget) => {
      if (widget.locationType?.includes(locationType)) {
        if (widget.layersIds) {
          filteredLayers.push(...widget.layersIds);
        }
        if (widget.contextualLayersIds) {
          filteredLayers.push(...widget.contextualLayersIds);
        }
        if (widget.subLayersIds) {
          filteredLayers.push(...widget.subLayersIds);
        }
      }
    });

    return filteredLayers;
  }

  const filteredLayers = filterLayersByLocationType(widgets, locationType);

  // layers that act as basemap (such planet imagery or high resolution extent) must be always at the bottom
  const basemap_layers = ACTIVE_LAYERS?.filter(
    (layer) => layer?.includes('planet') || layer === 'hi-res-extent'
  );
  const no_planet_layers = ACTIVE_LAYERS?.filter(
    (layer) =>
      !layer?.includes('planet') && layer !== 'hi-res-extent' && filteredLayers?.includes(layer)
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

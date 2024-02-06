import { useMemo, useCallback } from 'react';

import { Layer } from 'react-map-gl';

import { useSyncLayers, useSyncDatasetsSettings } from 'lib/utils/sync-query';

import { interactiveLayerIdsAtom } from 'store/map';

import { useRecoilState } from 'recoil';

import { LAYERS, BASEMAPS } from 'containers/datasets';

import type { LayerProps } from 'types/layers';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const CountryBoundariesLayer = LAYERS['country-boundaries'];

const LayerManagerContainer = () => {
  const [layers] = useSyncLayers();
  const [datasetsSettings] = useSyncDatasetsSettings();

  const [, setInteractiveLayerIds] = useRecoilState(interactiveLayerIdsAtom);

  const LAYERS_FILTERED = useMemo(() => {
    const filteredLayers = layers.filter(
      (layer: WidgetSlugType | ContextualBasemapsId | 'custom-area') => {
        return Object.keys(LAYERS).some((k) => layer.includes(k));
      }
    );

    return filteredLayers;
  }, [layers]);

  const handleAdd = useCallback(
    (styleIds: LayerProps['id'][]) => {
      setInteractiveLayerIds((prevInteractiveIds) => [...prevInteractiveIds, ...styleIds]);
    },
    [setInteractiveLayerIds]
  );

  const handleRemove = useCallback(
    (styleIds: LayerProps['id'][]) => {
      setInteractiveLayerIds((prevInteractiveIds) => [
        ...prevInteractiveIds.filter((id) => !styleIds.includes(id)),
      ]);
    },
    [setInteractiveLayerIds]
  );

  return (
    <>
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
        const layerId = Object.keys(LAYERS).find((k) => layer.includes(k));
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

      {
        <CountryBoundariesLayer
          id="country-boundaries-layer"
          beforeId="Country"
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      }
    </>
  );
};

export default LayerManagerContainer;

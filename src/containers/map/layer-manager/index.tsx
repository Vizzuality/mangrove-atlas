import { useMemo, useCallback } from 'react';

import { Layer } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';
import { interactiveLayerIdsAtom } from 'store/map';
import { basemapContextualAtom } from 'store/map-settings';

import { useRecoilState, useRecoilValue } from 'recoil';

import { LAYERS, BASEMAPS } from 'containers/datasets';

import type { LayerProps } from 'types/layers';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const RestorationLayer = LAYERS['mangrove_restoration'];
const CountryBoundariesLayer = LAYERS['country-boundaries'];
const RestorationSitesLayer = LAYERS['mangrove_restoration_sites'];
const IucnEcoregionLayer = LAYERS['mangrove_iucn_ecoregion'];

const EXCLUDED_DATA_LAYERS: WidgetSlugType[] = [
  'mangrove_restoration_sites',
  'mangrove_restoration',
  'mangrove_iucn_ecoregion',
] satisfies WidgetSlugType[];

const LayerManagerContainer = () => {
  const layers = useRecoilValue(activeLayersAtom);
  const layersIds = layers.map((l) => l.id);

  const basemap = useRecoilValue(basemapContextualAtom);
  const [, setInteractiveLayerIds] = useRecoilState(interactiveLayerIdsAtom);

  const activeLayersIds = layers.map((l) => l.id);

  const LAYERS_FILTERED = useMemo(() => {
    const filteredLayers = activeLayersIds.filter(
      (layer: WidgetSlugType & ContextualBasemapsId & 'custom-area') =>
        !EXCLUDED_DATA_LAYERS.includes(layer) && !!LAYERS[layer]
    );

    if (!!basemap) {
      filteredLayers.push(basemap);
    }

    return filteredLayers;
  }, [activeLayersIds, basemap]);

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
        const LayerComponent = LAYERS[layer] || BASEMAPS[layer];
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

      {layersIds.includes('mangrove_restoration_sites') && (
        <RestorationSitesLayer id="mangrove-restoration-sites-layer" />
      )}

      {layersIds.includes('mangrove_restoration') && (
        <RestorationLayer
          id="mangrove_restoration"
          beforeId="country-boundaries-layer"
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      )}

      {layersIds.includes('mangrove_iucn_ecoregion') && (
        <IucnEcoregionLayer
          id="mangrove-iucn-ecoregion"
          beforeId="country-boundaries-layer"
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      )}
    </>
  );
};

export default LayerManagerContainer;

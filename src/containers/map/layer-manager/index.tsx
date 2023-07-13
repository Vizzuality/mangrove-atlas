import { useMemo, useCallback } from 'react';

import { Layer } from 'react-map-gl';

import { interactiveLayerIdsAtom, layersSettingsAtom } from 'store/map';
import { basemapContextualAtom } from 'store/map-settings';
import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState, useRecoilValue } from 'recoil';

import { LAYERS, BASEMAPS } from 'containers/datasets';
import { LAYERS_ORDER } from 'containers/layers/constants';

import type { LayerProps } from 'types/layers';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const RestorationLayer = LAYERS['mangrove_restoration'];
const ProtectedAreasLayer = LAYERS['protected-areas'];
const CountryBoundariesLayer = LAYERS['country-boundaries'];
const RestorationSitesLayer = LAYERS['mangrove_restoration_sites'];

const EXCLUDED_DATA_LAYERS: WidgetSlugType[] = [
  // 'mangrove_habitat_extent',
  'mangrove_restoration_sites',
  'mangrove_restoration',
] satisfies WidgetSlugType[];

const LayerManagerContainer = () => {
  const layers = useRecoilValue(activeWidgetsAtom);
  const layersSettings = useRecoilValue(layersSettingsAtom);
  const layersOrdered = LAYERS_ORDER.filter((el) => {
    return layers.some((f) => {
      return f === el;
    });
  }) satisfies (WidgetSlugType | ContextualBasemapsId | 'custom-area')[];

  const nationaDashboardLayers = layers.filter((l) => l.includes('mangrove_national_dashboard'));

  const basemap = useRecoilValue(basemapContextualAtom);
  const [, setInteractiveLayerIds] = useRecoilState(interactiveLayerIdsAtom);
  const LAYERS_FILTERED = useMemo(() => {
    const filteredLayers = layersOrdered.filter(
      (layer: WidgetSlugType & ContextualBasemapsId & 'custom-area') =>
        !EXCLUDED_DATA_LAYERS.includes(layer) && !!LAYERS[layer]
    );

    if (!!basemap) {
      filteredLayers.push(basemap);
    }

    if (layers.includes('mangrove_habitat_extent')) {
      filteredLayers.push('mangrove_habitat_extent');
    }

    if (layers.includes('mangrove_restoration')) {
      filteredLayers.push('mangrove_restoration');
    }

    return filteredLayers satisfies (WidgetSlugType | ContextualBasemapsId | 'custom-area')[];
  }, [layers, basemap]);

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
  const LAYERS_WITH_NATIONAL_DASHBOARD_LAYERS = [...nationaDashboardLayers, ...LAYERS_FILTERED];
  return (
    <>
      {LAYERS_WITH_NATIONAL_DASHBOARD_LAYERS.map((layer, i) => {
        const beforeId =
          i === 0 ? 'custom-layers' : `${LAYERS_WITH_NATIONAL_DASHBOARD_LAYERS[i - 1]}-bg`;

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

      {LAYERS_WITH_NATIONAL_DASHBOARD_LAYERS.map((layer, i) => {
        const LayerComponent = LAYERS[layer] || BASEMAPS[layer];
        const beforeId =
          i === 0 ? 'custom-layers' : `${LAYERS_WITH_NATIONAL_DASHBOARD_LAYERS[i - 1]}-bg`;
        return (
          <LayerComponent
            id={layer}
            key={layer}
            layersSettings={layersSettings?.[layer]}
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

      {<ProtectedAreasLayer id="protected-areas-layer" beforeId="Country" />}

      {layers.includes('mangrove_restoration_sites') && (
        <RestorationSitesLayer id="mangrove-restoration-sites-layer" />
      )}

      {layers.includes('mangrove_restoration') && (
        <RestorationLayer
          id="mangrove-restoration"
          beforeId="country-boundaries-layer"
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      )}
    </>
  );
};

export default LayerManagerContainer;

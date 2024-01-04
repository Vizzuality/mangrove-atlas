import { useMemo, useCallback } from 'react';

import { Layer } from 'react-map-gl';

import { activeLayersAtom } from 'store/layers';
import { interactiveLayerIdsAtom, layersSettingsAtom } from 'store/map';
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
  const layersSettings = useRecoilValue(layersSettingsAtom);

  const nationaDashboardLayers = layersIds.filter((l) => l === 'mangrove_national_dashboard');
  console.log(nationaDashboardLayers, layersSettings, 'nationaDashboardLayers');
  const basemap = useRecoilValue(basemapContextualAtom);
  const [, setInteractiveLayerIds] = useRecoilState(interactiveLayerIdsAtom);
  const nationalDashboardLayerIds = layers
    .filter((l) => l?.id === 'mangrove_national_dashboard')
    .map((l) => l.id);

  const activeLayersIds = layers.map((l) => l.id);

  const allLayersOrdered = [...nationalDashboardLayerIds, ...activeLayersIds];

  const LAYERS_FILTERED = useMemo(() => {
    const filteredLayers = allLayersOrdered.filter(
      (layer: WidgetSlugType & ContextualBasemapsId & 'custom-area') =>
        !EXCLUDED_DATA_LAYERS.includes(layer) && !!LAYERS[layer]
    );

    if (!!basemap) {
      filteredLayers.push(basemap);
    }

    return filteredLayers;
  }, [allLayersOrdered, basemap]);

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
  console.log(
    LAYERS_WITH_NATIONAL_DASHBOARD_LAYERS,
    layersSettings,
    'LAYERS_WITH_NATIONAL_DASHBOARD_LAYERS'
  );
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

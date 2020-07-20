import { createSelector } from 'reselect';
import { activeLayers } from 'modules/layers/selectors';
import template from 'lodash/template';
import { rasterLayers } from './rasters.json';
import StyleManager from './style-manager';
import Layers, { scopeFeature } from './constants';
import { coverageFilter, netChangeFilter } from './filters';

const {
  sources: bhSources,
  layers: bhLayers,
  layersMap
} = Layers;
const styleManager = new StyleManager();

const mapStyles = state => state.mapStyles;
const filters = createSelector([mapStyles], styles => styles.filters);
const basemap = state => state.map.basemap;
const locationId = state => state.locations.current.id;
const activeLayersIds = createSelector(
  [activeLayers], _activeLayers => _activeLayers.map(activeLayer => activeLayer.id)
);

function sortLayers(layers) {
  const order = {
    'selected-wdpa-polygons copy 1': 10,
    'alerts-style': 100
  };

  return layers.sort((a, b) => {
    const aOrder = order[a.id] || 0;
    const bOrder = order[b.id] || 0;

    return aOrder - bOrder;
  });
}

export const layerStyles = createSelector(
  [mapStyles, activeLayersIds], (_mapStyles, _activeLayersIds) => {
    if (!_mapStyles.layers || !_mapStyles.layers.mapStyle) {
      return [];
    }

    const { layers: layersStyles } = _mapStyles.layers.mapStyle;
    const extendedLayers = [...layersStyles, ...rasterLayers];
    return extendedLayers.filter(
      style => _activeLayersIds.includes(style.id)
        || (
          style.metadata
          && style.metadata.mangroveGroup
          && _activeLayersIds.includes(style.metadata.mangroveGroup)
        )
    );
  }
);

export const mapStyle = createSelector(
  [basemap, layerStyles, filters, activeLayersIds, locationId],
  (_basemap, _layerStyles, _filters, _activeLayersIds, _locationId) => {
    const layersWithFilters = _layerStyles.map((layerStyle) => {
      const newLayerStyle = { ...layerStyle };
      let widgetFilter;
      switch (layerStyle.id) {
        case 'coverage-1996-2016':
          widgetFilter = _filters.find(f => f.id === 'coverage-1996-2016');
          if (widgetFilter) {
            newLayerStyle.filter = coverageFilter(widgetFilter);
          }
          break;
        case 'net-change-1996-2016':
          widgetFilter = _filters.find(f => f.id === 'net-change-1996-2016');
          if (widgetFilter) {
            newLayerStyle.filter = netChangeFilter(widgetFilter);
          }
          break;
        default:
        case 'cons-hotspots':
          widgetFilter = _filters.find(f => f.id === 'cons-hotspots');
          if (widgetFilter && scopeFeature.get(widgetFilter.scope)) {
            newLayerStyle.paint['fill-color'][1][1] = scopeFeature.get(widgetFilter.scope);
          }
          break;
      }

      return newLayerStyle;
    });

    styleManager.basemap = _basemap;
    styleManager.layers = layersWithFilters;

    const composedMapStyle = {
      ...styleManager.mapStyle,
      layers: sortLayers(styleManager.mapStyle.layers)
    };

    /**
     * We are patching here but the object should already be complete by now
     * Selectors are for filtering, not composing
     */
    const visibleRasterLayers = _activeLayersIds.reduce((acc, layerId) => {
      const layerMap = layersMap[layerId];
      const layerFilter = _filters.find(f => f.id === layerId);

      if (layerFilter && layerMap) {
        if (layerFilter && layerFilter.id === 'net') {
          return [
            ...acc,
            ...layerMap
              .filter(
                layerMapItem => layerFilter.years.includes(parseInt(layerMapItem.year, 10))
              ).map(layerMapItem => layerMapItem.layerId)
          ];
        }
        return [
          ...acc,
          ...layerMap
            .filter(
              layerMapItem => parseInt(layerMapItem.year, 10) === parseInt(layerFilter.year, 10)
            ).map(layerMapItem => layerMapItem.layerId)
        ];
      }

      if (layerMap) {
        return [
          ...acc,
          ...layerMap.map(layerMapItem => layerMapItem.layerId)
        ];
      }
      return acc;
    }, []);

    const bhLayersUpdated = bhLayers.map(layer => ({
      ...layer,
      layout: {
        ...layer.layout,
        visibility: visibleRasterLayers.includes(layer.id) ? 'visible' : 'none'
      }
    }));
    const url = template(bhSources.alerts.data, {
      interpolate: /{{([\s\S]+?)}}/g,
    });
    if (_locationId && (_locationId !== 'worldwide')) {
      bhSources.alerts.data = url({ locationId: `&location_id=${_locationId}` });
    } else {
      bhSources.alerts.data = url({ locationId: '' });
    }
    composedMapStyle.sources = { ...composedMapStyle.sources, ...bhSources };
    composedMapStyle.layers = [...composedMapStyle.layers, ...bhLayersUpdated];

    return composedMapStyle;
  }
);

export default { mapStyle };

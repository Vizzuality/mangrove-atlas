import { createSelector } from 'reselect';
import { activeLayers } from 'modules/layers/selectors';
import { rasterLayers } from './rasters';
import StyleManager from './style-manager';
import biomassHeightblueCarbon, { scopeFeature } from './constants';
import { coverageFilter, netChangeFilter } from './filters';

const {
  sources: bhSources,
  layers: bhLayers,
  layersMap
} = biomassHeightblueCarbon;
const styleManager = new StyleManager();

const mapStyles = state => state.mapStyles;
const filters = createSelector([mapStyles], styles => styles.filters);
const basemap = state => state.map.basemap;
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
  [basemap, layerStyles, filters, activeLayersIds],
  (_basemap, _layerStyles, _filters, _activeLayersIds) => {
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
        return [
          ...acc,
          ...layerMap
            .filter(
              layerMapItem => (layerFilter && layerFilter.range)
              ? (parseInt(layerFilter.range.startYear, 10) === parseInt(layerMapItem.year, 10)
              || parseInt(layerFilter.range.endYear, 10) === parseInt(layerMapItem.year, 10))
              : parseInt(layerMapItem.year, 10) === parseInt(layerFilter.year, 10)
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

    composedMapStyle.sources = { ...composedMapStyle.sources, ...bhSources };
    composedMapStyle.layers = [...composedMapStyle.layers, ...bhLayersUpdated];

    return composedMapStyle;
  }
);

export default { mapStyle };

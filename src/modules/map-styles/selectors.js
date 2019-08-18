import { createSelector } from 'reselect';
import { activeLayers } from 'modules/layers/selectors';
import StyleManager from './style-manager';

const styleManager = new StyleManager();

const mapStyles = state => state.mapStyles;
const basemap = state => state.map.basemap;

export const layerStyles = createSelector(
  [mapStyles, activeLayers],
  (_mapStyles, _activeLayers) => {
    if (!_mapStyles.layers || !_mapStyles.layers.mapStyle) return [];
    const { layers: layersStyles } = _mapStyles.layers.mapStyle;
    const result = [];
    _activeLayers.forEach((activeLayer) => {
      layersStyles
        .filter(style => style.metadata['mapbox:group'] === activeLayer.mapboxGroup)
        .forEach(s => result.push(s));
    });
    return result;
  }
);

export const mapStyle = createSelector(
  [basemap, layerStyles],
  (_basemap, _layerStyles) => {
    styleManager.basemap = _basemap;
    styleManager.layers = _layerStyles;
    return styleManager.mapStyle;
  }
);

export default { mapStyle };

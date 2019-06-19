import { createSelector } from 'reselect';
import StyleManager from './style-manager';

const styleManager = new StyleManager();
const basemap = state => state.map.basemap;

export const mapStyle = createSelector(
  [basemap],
  (_basemap) => {
    styleManager.basemap = _basemap;
    return styleManager.mapStyle;
  }
);

export default { mapStyle };

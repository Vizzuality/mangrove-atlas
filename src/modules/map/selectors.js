import { createSelector } from 'reselect';
import { activeWidgets } from 'modules/widgets/selectors';
import StyleManager from './style-manager';

const styleManager = new StyleManager();

const basemap = state => state.map.basemap;

export const mapStyle = createSelector(
  [basemap, activeWidgets],
  (_basemap, _activeWidgets) => {
    styleManager.basemap = _basemap;
    styleManager.layers = _activeWidgets.map(widget => widget.layerId);
    return styleManager.mapStyle;
  }
);

export default { mapStyle };

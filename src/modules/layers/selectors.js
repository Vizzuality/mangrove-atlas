import { createSelector } from 'reselect';

const layers = state => state.layers.list;
const currentWidgets = state => state.dashboard.widgets;

export const getActiveLayers = createSelector(
  [layers, currentWidgets], (_layers, _widgets) => {
    const activeLayers = _widgets.filter(w => w.isDisplayedOnMap)
      .reduce((acc, w) => [
        ...acc,
        ...(w.config.layers || [])
      ], []);

    // todo: Implement parameter interpolation for layer queries
    const noConfLayers = Object.values(_layers)
      .reduce((acc, l) => [...acc, ...l], [])
      .filter(l => !l.layerConfig.params_config);

    return noConfLayers.filter(l => activeLayers.includes(l.id));
  }
);

export default getActiveLayers;

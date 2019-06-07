import { createSelector } from "reselect";

const layers = state => state.layers.list;

export const getActiveLayers = createSelector(
  [layers], _layers => Object.values(_layers)
    .reduce((acc, l) => [...acc, ...l], [])
    .filter(l => !l.layerConfig.params_config)
);

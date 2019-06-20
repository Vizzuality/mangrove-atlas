import { createSelector } from 'reselect';

const layers = state => state.layers.list;

export const activeLayers = createSelector(
  [layers],
  _layers => _layers.filter(layer => layer.isActive)
);

export default activeLayers;

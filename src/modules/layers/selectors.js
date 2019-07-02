import { createSelector } from 'reselect';
import orderBy from 'lodash/orderBy';

const layers = state => state.layers.list;

export const activeLayers = createSelector(
  [layers],
  _layers => orderBy(_layers.filter(layer => layer.isActive), l => l.weight)
);

/**
 * Legend should show the against of active layers
 */
export const activeLayersForLegend = createSelector(
  [layers],
  _layers => orderBy(_layers.filter(layer => layer.isActive), l => -l.weight)
);

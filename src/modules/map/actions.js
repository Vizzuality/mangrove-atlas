import { createAction } from 'vizzuality-redux-tools';

export const setMap = createAction('MAP/setMap');
export const setMapBounds = createAction('MAP/setMapBounds');
export const setMapStyle = createAction('MAP/setMapStyle');
export const setMapLabels = createAction('MAP/setMapLabels');
export const setMapRoads = createAction('MAP/setMapRoads');
export const setMapViewport = createAction('MAP/setMapViewport');

export default {
  setMap,
  setMapBounds,
  setMapStyle,
  setMapLabels,
  setMapRoads,
  setMapViewport
};

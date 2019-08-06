import { createAction } from 'vizzuality-redux-tools';

export const resetViewport = createAction('MAP/RESET_VIEWPORT');
export const setViewport = createAction('MAP/SET_VIEWPORT');
export const setBasemap = createAction('MAP/SET_BASEMAP');
export const setMapView = createAction('MAP/SET_MAP_VIEW');

import { createAction } from 'vizzuality-redux-tools';

export const resetViewport = createAction('MAP/RESET_VIEWPORT');
export const setViewport = createAction('MAP/SET_VIEWPORT');
export const setBasemap = createAction('MAP/SET_BASEMAP');
export const setBounds = createAction('MAP/SET_BOUNDS');
export const setViewportFixed = createAction('MAP/SET_VIEWPORT_FIXED');
export const setPopup = createAction('MAP/SET_POPUP');
export const removePopup = createAction('MAP/REMOVE_POPUP');

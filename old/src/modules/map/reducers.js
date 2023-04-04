import * as actions from './actions';
import initialState from './initial-state';

const { viewport, bounds } = initialState;

const {
  resetViewport,
  setViewport,
  setBasemap,
  setBounds,
  setViewportFixed,
  setPopup,
  removePopup,
} = actions;

export default {
  [resetViewport]: (state, { payload }) => ({
    ...state,
    viewport: {
      ...state.viewport,
      longitude: viewport.longitude,
      latitude: viewport.latitude,
      zoom: payload?.zoom || viewport.zoom,
    },
    bounds,
  }),
  [setViewport]: (state, { payload }) => ({
    ...state,
    viewport: payload,
  }),
  [setBasemap]: (state, { payload }) => ({
    ...state,
    basemap: payload,
  }),
  [setBounds]: (state, { payload }) => ({
    ...state,
    bounds: payload,
  }),
  [setViewportFixed]: (state, { payload }) => ({
    ...state,
    isViewportFixed: payload.value,
  }),
  [setPopup]: (state, { payload }) => ({
    ...state,
    popup: payload,
  }),
  [removePopup]: (state) => ({
    ...state,
    popup: null,
  }),
};

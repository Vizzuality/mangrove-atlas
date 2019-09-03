import * as actions from './actions';
import initialState from './initial-state';

const { viewport, bounds } = initialState;

export default {
  [actions.resetViewport]: state => ({
    ...state,
    viewport: {
      ...state.viewport,
      longitude: viewport.longitude,
      latitude: viewport.latitude,
      zoom: viewport.zoom
    },
    bounds
  }),
  [actions.setViewport]: (state, { payload }) => ({
    ...state,
    viewport: payload
  }),
  [actions.setBasemap]: (state, { payload }) => ({
    ...state,
    basemap: payload
  }),
  [actions.setBounds]: (state, { payload }) => ({
    ...state,
    bounds: payload
  }),
  [actions.setViewportFixed]: (state, { payload }) => ({
    ...state,
    isViewportFixed: payload.value
  })
};

import * as actions from './actions';
import initialState from './initial-state';

const { viewport } = initialState;

export default {
  [actions.resetViewport]: state => ({
    ...state,
    viewport: {
      ...state.viewport,
      longitude: viewport.longitude,
      latitude: viewport.latitude,
      zoom: viewport.zoom
    }
  }),
  [actions.setViewport]: (state, { payload }) => ({
    ...state,
    viewport: payload
  }),
  [actions.setBasemap]: (state, { payload }) => ({
    ...state,
    basemap: payload
  }),
  [actions.setMobileView]: (state, { payload }) => ({
    ...state,
    display: payload
  })
};

import * as actions from './actions';
import initialState from './initial-state';

export default {
  [actions.resetViewport]: state => ({
    ...state,
    viewport: {
      ...state.viewport,
      ...initialState.viewport
    }
  }),
  [actions.setViewport]: (state, { payload }) => ({
    ...state,
    viewport: payload
  }),
  [actions.setBasemap]: (state, { payload }) => ({
    ...state,
    basemap: payload
  })
};

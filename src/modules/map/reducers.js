import * as actions from './actions';

export default {
  [actions.setViewport]: (state, { payload }) => ({
    ...state,
    viewport: payload
  }),
  [actions.setBasemap]: (state, { payload }) => ({
    ...state,
    basemap: payload
  })
};

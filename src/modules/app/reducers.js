import setView from './actions';

export default {
  [setView]: (state, { payload }) => ({
    ...state,
    mobile: {
      mapView: payload
    }
  })
};

import { setMobileView } from './actions';

export default {
  [setMobileView]: (state, { payload }) => ({
    ...state,
    mobile: {
      ...state.mobile,
      mapView: payload
    }
  })
};

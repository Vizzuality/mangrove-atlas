import { setMobileView, setPrintMode } from './actions';

export default {
  [setMobileView]: (state, { payload }) => ({
    ...state,
    mobile: {
      ...state.mobile,
      mapView: payload
    }
  }),
    [setPrintMode]: (state, { payload }) => ({
      ...state,
      printMode: payload
  })
};

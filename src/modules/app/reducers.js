import { setMobileView, setPrintMode, setInitial } from './actions';

export default {
  [setMobileView]: (state, { payload }) => ({
    ...state,
    mobile: {
      ...state.mobile,
      mapView: payload,
    },
  }),
  [setPrintMode]: (state, { payload }) => ({
    ...state,
    printMode: payload,
  }),
  [setInitial]: (state, { payload }) => ({
    ...state,
    initial: payload,
  }),
};

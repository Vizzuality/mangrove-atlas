import { setScreen, setView } from './actions';

export default {
  [setScreen]: (state, { payload }) => ({
    ...state,
    isMobile: payload
  }),
  [setView]: (state, { payload }) => ({
    ...state,
    mobile: {
      map: payload
    }
  })
};

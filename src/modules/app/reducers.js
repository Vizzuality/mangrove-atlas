import setScreen from './actions';

export default {
  [setScreen]: (state, { payload }) => ({
    ...state,
    isMobile: payload,
  })
};

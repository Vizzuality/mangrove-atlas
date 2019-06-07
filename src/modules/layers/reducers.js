import * as actions from './actions';

const {
  setList,
  setLoading,
  setError,
} = actions;

export default {
  [setList]: (state, { payload }) => ({
    ...state, list: payload
  }),
  [setLoading]: (state, { payload }) => ({
    ...state, isLoading: Boolean(payload)
  }),
  [setError]: (state, { payload }) => ({
    ...state, error: payload
  })
};

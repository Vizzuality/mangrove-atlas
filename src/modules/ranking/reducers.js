import {
  fetchRequested,
  fetchSucceeded,
  fetchFailed,
} from './actions';

export default {
  [fetchRequested]: state => ({
    ...state,
    isLoading: true,
    error: null
  }),
  [fetchSucceeded]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    data: payload.data,
    meta: payload.meta
  }),
  [fetchFailed]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    error: payload
  })
};

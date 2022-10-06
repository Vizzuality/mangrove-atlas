import {
  fetchRequested, fetchSucceeded, fetchFailed,
  setCurrent, openSearchPanel, closeSearchPanel
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
    list: payload.data,
    metadata: payload.meta
  }),
  [fetchFailed]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    error: payload
  }),
  [setCurrent]: (state, { payload }) => ({
    ...state,
    current: payload
  }),
  [openSearchPanel]: state => ({ ...state, isOpened: true }),
  [closeSearchPanel]: state => ({ ...state, isOpened: false }),
};

import { fetchRequested, fetchSucceeded, fetchFailed, setCurrentLanguage } from './actions';

export default {
  [fetchRequested]: state => ({
    ...state,
    isLoading: true,
    error: null
  }),
  [fetchSucceeded]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    list: payload
  }),
  [fetchFailed]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    error: payload
  }),
  [setCurrentLanguage]: (state, { payload }) => ({
    ...state,
    current: payload,
  })
};
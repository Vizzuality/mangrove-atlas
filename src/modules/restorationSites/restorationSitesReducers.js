import {
  fetchRequested,
  fetchSucceeded,
  fetchFailed,
} from './restorationSitesActions';

export default {
  [fetchRequested]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [fetchSucceeded]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    data: payload,
  }),
  [fetchFailed]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    error: payload,
  }),
};

import { fetchRequested, fetchSucceeded, fetchFailed, addFilter, removeFilter } from './actions';

export default {
  [fetchRequested]: state => ({
    ...state,
    layers: {
      isLoading: true,
      error: null
    }
  }),
  [fetchSucceeded]: (state, { payload }) => ({
    ...state,
    layers: {
      ...state.layers,
      isLoading: false,
      mapStyle: payload
    }
  }),
  [fetchFailed]: (state, { payload }) => ({
    ...state,
    layers: {
      ...state.layers,
      isLoading: false,
      error: payload
    }
  }),
  [addFilter]: (state, { payload: { filter } }) => ({
    ...state,
    filters: [
      ...state.filters.filter(fltr => fltr.id !== filter.id),
      filter
    ]
  }),
  [removeFilter]: (state, { payload: { id } }) => ({
    ...state,
    filters: state.filters.filter(fltr => fltr.id !== id)
  })
};

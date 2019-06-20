import { fetchRequested, fetchSucceeded, fetchFailed, toggleActive } from './actions';

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
  [toggleActive]: (state, { payload }) => ({
    ...state,
    list: state.list.map((item) => {
      if (item.id !== payload.id) return item;
      return ({ ...item, isActive: payload.isActive });
    })
  })
};

import { fetchRequested,
  fetchSucceeded,
  fetchFailed,
  toggleActive,
  toggleCollapse } from './actions';

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
  [toggleCollapse]: (state, { payload }) => ({
    ...state,
    isCollapsed: payload,
  }),
  [toggleActive]: (state, { payload }) => ({
    ...state,
    list: state.list.map((item) => {
      if (item.id !== payload.id) return item;
      return ({ ...item, isActive: !item.isActive });
    })
  })
};

import {
  fetchRequested,
  fetchSucceeded,
  fetchFailed,
  collapseAll,
  expandAll,
  toggleCollapse,
  toggleActive,
  toggleActiveByLayerId,
  openInfoPanel,
  closeInfoPanel,
  setUi,
  resetUi
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
    list: payload
  }),
  [fetchFailed]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    error: payload
  }),
  [collapseAll]: state => ({
    ...state,
    isCollapsed: true,
    list: state.list.map(item => ({ ...item, isCollapsed: true }))
  }),
  [expandAll]: state => ({
    ...state,
    isCollapsed: false,
    list: state.list.map(item => ({ ...item, isCollapsed: false }))
  }),
  [toggleCollapse]: (state, { payload: { id } }) => {
    const list = state.list.map((item) => {
      if (item.slug !== id) return item;
      return ({ ...item, isCollapsed: !item.isCollapsed });
    });

    const noCollapsed = list.find(item => item.isCollapsed === false);

    return {
      ...state,
      list,
      isCollapsed: !noCollapsed
    };
  },
  [toggleActive]: (state, { payload }) => ({
    ...state,
    list: state.list.map((item) => {
      if (item.slug !== payload.id) return item;
      return ({ ...item, isActive: payload.isActive });
    })
  }),
  [toggleActiveByLayerId]: (state, { payload }) => ({
    ...state,
    list: state.list.map((item) => {
      if (!item.layersIds.includes(payload.layerId)) return item;
      return ({ ...item, isActive: payload.isActive });
    })
  }),
  [openInfoPanel]: (state, { payload }) => ({
    ...state,
    isOpened: true,
    type: payload
  }),
  [closeInfoPanel]: state => ({ ...state, isOpened: false }),
  [setUi]: (state, { payload }) => ({
    ...state,
    ui: {
      ...state.ui,
      [payload.id]: payload.value
    }
  }),
  [resetUi]: state => ({ ...state, ui: {} })
};

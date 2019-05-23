import {
  setWidgetsCollapsed,
  setSearchActive,
  setDashboardCollapsed
} from './actions';

const reducerMap = {
  [setWidgetsCollapsed]: (state, { payload }) => ({ ...state, areWidgetsCollapsed: Boolean(payload)}),
  [setSearchActive]: (state, { payload }) => ({ ...state, isSearchActive: Boolean(payload)}),
  [setDashboardCollapsed]: (state, { payload }) => ({ ...state, isDashboardCollapsed: Boolean(payload)}),
};

export default reducerMap;

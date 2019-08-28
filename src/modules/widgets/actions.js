import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('WIDGETS/FETCH_REQUESTED');
export const fetchSucceeded = createAction('WIDGETS/FETCH_SUCCEDED');
export const fetchFailed = createAction('WIDGETS/FETCH_FAILED');
export const setCurrent = createAction('WIDGETS/SET_CURRENT');
export const fetchWidgets = createAction('WIDGETS/FETCH_ALL');

export const toggleCollapse = createAction('WIDGET/TOGGLE_COLLAPSE');
export const collapseAll = createAction('WIDGETS/COLLAPSE_ALL');
export const expandAll = createAction('WIDGETS/EXPAND_ALL');

export const toggleActive = createAction('WIDGET/TOGGLE_ACTIVE');
export const toggleActiveByLayerId = createAction('WIDGET/TOGGLE_ACTIVE_BY_LAYER_ID');

export const openInfoPanel = createAction('WIDGETS/OPEN_PANEL');
export const closeInfoPanel = createAction('WIDGETS/CLOSE_PANEL');

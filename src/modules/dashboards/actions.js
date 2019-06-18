import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('DASHBOARDS/FETCH_REQUESTED');
export const fetchSucceeded = createAction('DASHBOARDS/FETCH_SUCCEDED');
export const fetchFailed = createAction('DASHBOARDS/FETCH_FAILED');
export const fetchDashboards = createAction('DASHBOARDS/GET_ALL');

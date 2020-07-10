import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('ALERTS/FETCH_REQUESTED');
export const fetchSucceeded = createAction('ALERTS/FETCH_SUCCEDED');
export const fetchFailed = createAction('ALERTS/FETCH_FAILED');
export const fetchAlerts = createAction('ALERTS/FETCH_ALL');

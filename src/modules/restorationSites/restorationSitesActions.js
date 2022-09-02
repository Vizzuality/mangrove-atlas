import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('RESTORATION_SITES/FETCH_REQUESTED');
export const fetchSucceeded = createAction('RESTORATION_SITES/FETCH_SUCCEDED');
export const fetchFailed = createAction('RESTORATION_SITES/FETCH_FAILED');
export const fetchRestorationSites = createAction('RESTORATION_SITES/FETCH_ALL');

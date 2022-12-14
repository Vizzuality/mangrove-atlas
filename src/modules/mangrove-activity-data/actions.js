import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('MANGROVE_ACTIVITY_DATA/FETCH_REQUESTED');
export const fetchSucceeded = createAction('MANGROVE_ACTIVITY_DATA/FETCH_SUCCEDED');
export const fetchFailed = createAction('MANGROVE_ACTIVITY_DATA/FETCH_FAILED');
export const fetchMangroveActivityData = createAction('MANGROVE_ACTIVITY_DATA/FETCH_ALL');

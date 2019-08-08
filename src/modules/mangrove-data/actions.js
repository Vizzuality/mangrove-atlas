import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('MANGROVE_DATA/FETCH_REQUESTED');
export const fetchSucceeded = createAction('MANGROVE_DATA/FETCH_SUCCEDED');
export const fetchFailed = createAction('MANGROVE_DATA/FETCH_FAILED');
export const fetchMangroveData = createAction('MANGROVE_DATA/FETCH_ALL');
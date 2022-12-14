import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('MANGROVE_NET_CHANGE_DATA/FETCH_REQUESTED');
export const fetchSucceeded = createAction('MANGROVE_NET_CHANGE_DATA/FETCH_SUCCEDED');
export const fetchFailed = createAction('MANGROVE_NET_CHANGE_DATA/FETCH_FAILED');
export const fetchMangroveNetChangeData = createAction('MANGROVE_NET_CHANGE_DATA/FETCH_ALL');

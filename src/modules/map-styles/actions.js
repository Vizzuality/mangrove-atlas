import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('MAP_STYLES/FETCH_REQUESTED');
export const fetchSucceeded = createAction('MAP_STYLES/FETCH_SUCCEDED');
export const fetchFailed = createAction('MAP_STYLES/FETCH_FAILED');
export const fetchMapStyles = createAction('MAP_STYLES/FETCH_ALL');

export const addFilter = createAction('MAP_STYLES/SET_FILTER');
export const removeFilter = createAction('MAP_STYLES/REMOVE_FILTER');

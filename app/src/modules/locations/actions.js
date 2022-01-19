import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('LOCATIONS/FETCH_REQUESTED');
export const fetchSucceeded = createAction('LOCATIONS/FETCH_SUCCEDED');
export const fetchFailed = createAction('LOCATIONS/FETCH_FAILED');
export const fetchLocations = createAction('LOCATIONS/FETCH_ALL');

export const setCurrent = createAction('LOCATIONS/SET_CURRENT');
export const openSearchPanel = createAction('LOCATIONS/OPEN_PANEL');
export const closeSearchPanel = createAction('LOCATIONS/CLOSE_PANEL');

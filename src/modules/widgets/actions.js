import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('WIDGETS/FETCH_REQUESTED');
export const fetchSucceeded = createAction('WIDGETS/FETCH_SUCCEDED');
export const fetchFailed = createAction('WIDGETS/FETCH_FAILED');
export const setCurrent = createAction('WIDGETS/SET_CURRENT');
export const fetchWidgets = createAction('WIDGETS/FETCH_ALL');

export const triggerMapAction = createAction('WIDGETS/triggerMapAction');

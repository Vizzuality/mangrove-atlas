import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('LANGUAGES/FETCH_REQUESTED');
export const fetchSucceeded = createAction('LANGUAGES/FETCH_SUCCEDED');
export const fetchFailed = createAction('LANGUAGES/FETCH_FAILED');
export const fetchLanguages = createAction('LANGUAGES/GET_ALL');

export const setCurrentLanguage = createAction('LANGUAGES/SET_CURRENT');

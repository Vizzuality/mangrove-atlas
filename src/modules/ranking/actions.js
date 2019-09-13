import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('RANKING/FETCH_REQUESTED');
export const fetchSucceeded = createAction('RANKING/FETCH_SUCCEDED');
export const fetchFailed = createAction('RANKING/FETCH_FAILED');
export const fetchRankingData = createAction('RANKING/FETCH_ALL');

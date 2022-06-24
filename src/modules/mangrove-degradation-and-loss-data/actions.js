import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('MANGROVE_RESTORATION_DEGRADATION_AND_LOSS_DATA/FETCH_REQUESTED');
export const fetchSucceeded = createAction('MANGROVE_RESTORATION_DEGRADATION_AND_LOSS_DATA/FETCH_SUCCEDED');
export const fetchFailed = createAction('MANGROVE_RESTORATION_DEGRADATION_AND_LOSS_DATA/FETCH_FAILED');
export const fetchMangroveDegradationAndLossData = createAction('MANGROVE_DEGRADATION_AND_LOSS_DATA/FETCH_ALL');

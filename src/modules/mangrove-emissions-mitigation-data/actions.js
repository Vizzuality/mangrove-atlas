import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('MANGROVE_EMISSIONS_MITIGATION_DATA/FETCH_REQUESTED');
export const fetchSucceeded = createAction('MANGROVE_EMISSIONS_MITIGATION_DATA/FETCH_SUCCEDED');
export const fetchFailed = createAction('MANGROVE_EMISSIONS_MITIGATION_DATA/FETCH_FAILED');
export const fetchMangroveEmissionsMitigationData = createAction('MANGROVE_EMISSIONS_MITIGATION_DATA/FETCH_ALL');

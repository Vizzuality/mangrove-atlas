import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('MANGROVE_ECOSYSTEM_SERVICES_DATA/FETCH_REQUESTED');
export const fetchSucceeded = createAction('MANGROVE_ECOSYSTEM_SERVICES_DATA/FETCH_SUCCEDED');
export const fetchFailed = createAction('MANGROVE_ECOSYSTEM_SERVICES_DATA/FETCH_FAILED');
export const fetchMangroveEcosystemServicesData = createAction('MANGROVE_ECOSYSTEM_SERVICES_DATA/FETCH_ALL');

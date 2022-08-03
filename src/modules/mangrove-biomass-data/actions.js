import { createAction } from 'vizzuality-redux-tools';

export const fetchRequested = createAction('MANGROVE_BIOMASS_DATA/FETCH_REQUESTED');
export const fetchSucceeded = createAction('MANGROVE_BIOMASS_DATA/FETCH_SUCCEDED');
export const fetchFailed = createAction('MANGROVE_BIOMASS_DATA/FETCH_FAILED');
export const fetchMangroveBiomassData = createAction('MANGROVE_BIOMASS_DATA/FETCH_ALL');

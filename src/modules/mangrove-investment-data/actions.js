import { createAction } from "vizzuality-redux-tools";

export const fetchRequested = createAction(
  "MANGROVE_INVESTMENT_POTENTIAL_DATA/FETCH_REQUESTED"
);
export const fetchSucceeded = createAction(
  "MANGROVE_INVESTMENT_POTENTIAL_DATA/FETCH_SUCCEDED"
);
export const fetchFailed = createAction(
  "MANGROVE_INVESTMENT_POTENTIAL_DATA/FETCH_FAILED"
);
export const fetchInvestmentPotentialData = createAction(
  "MANGROVE_INVESTMENT_POTENTIAL_DATA/FETCH_ALL"
);

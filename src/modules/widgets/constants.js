export const alertsStartDate = { label: '', value: '2020-01-01' };
export const alertsEndDate = { label: '', value: '2022-12-31'};

// ! This ID comes from Mangrove Atlas API. If you heard of a data migration or similar there
// ! check this value is still valid or weird things will happen (like widgets not loading).
// 4688
export const WORLWIDE_LOCATION_ID = process.env.REACT_APP_WORLWIDE_LOCATION_ID ? +process.env.REACT_APP_WORLWIDE_LOCATION_ID : null ;

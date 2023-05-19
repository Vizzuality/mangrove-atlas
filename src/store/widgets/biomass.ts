import { atom } from 'recoil';

export const BiomassYearSettings = atom({
  key: 'biomass-year-setting',
  default: 2020, // TO - DO: change to null, set it after fetching
});

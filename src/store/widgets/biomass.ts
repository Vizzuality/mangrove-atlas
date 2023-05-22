import { atom } from 'recoil';

export const BiomassYearSettings = atom<number>({
  key: 'biomass-year-setting',
  default: null, // TO - DO: change to null, set it after fetching
});

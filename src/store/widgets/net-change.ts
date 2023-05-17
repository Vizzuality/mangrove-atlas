import { atom } from 'recoil';

export const netChangeStartYear = atom({
  key: 'net-change-start-year',
  default: null,
});

export const netChangeEndYear = atom({
  key: 'net-change-end-year',
  default: null,
});

import { atom } from 'recoil';

export const habitatChangeStartYear = atom({
  key: 'habitat-change-start-year',
  default: null,
});

export const habitatChangeEndYear = atom({
  key: 'habitat-change-end-year',
  default: null,
});

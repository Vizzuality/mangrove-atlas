import { atom } from 'recoil';

export const habitatChangeStartYear = atom<number>({
  key: 'habitat-change-start-year',
  default: null,
});

export const habitatChangeEndYear = atom<number>({
  key: 'habitat-change-end-year',
  default: null,
});

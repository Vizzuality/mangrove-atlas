import { atom } from 'recoil';

export const netChangeStartYear = atom<number>({
  key: 'net-change-start-year',
  default: null,
});

export const netChangeEndYear = atom<number>({
  key: 'net-change-end-year',
  default: null,
});

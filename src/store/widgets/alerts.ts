import { atom } from 'recoil';

export const alertsStartDate = atom({
  key: 'alerts-start-date',
  default: null,
});
export const alertsEndDate = atom({
  key: 'alerts-end-date',
  default: null,
});

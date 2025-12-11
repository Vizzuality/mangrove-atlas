import { atom } from 'recoil';

import type { DateOption } from 'types/widget';

export const alertsStartDate = atom<DateOption | undefined>({
  key: 'alerts-start-date',
  default: undefined,
});
export const alertsEndDate = atom<DateOption | undefined>({
  key: 'alerts-end-date',
  default: undefined,
});

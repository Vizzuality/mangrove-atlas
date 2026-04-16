import { atom } from 'jotai';

import type { DateOption } from 'types/widget';

export const alertsStartDate = atom<DateOption | undefined>(undefined);
export const alertsEndDate = atom<DateOption | undefined>(undefined);

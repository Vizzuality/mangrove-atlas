import { atom } from 'recoil';

import { FloodProtectionPeriodId } from 'containers/datasets/flood-protection/types';

export const floodPeriodAtom = atom<FloodProtectionPeriodId>({
  key: 'flood-protection-period',
  default: 'annual',
});

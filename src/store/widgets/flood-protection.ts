import { atom } from 'recoil';

import { FloodProtectionPeriodId } from 'containers/datasets/flood-protection/types';

export const floodAreaPeriodAtom = atom<FloodProtectionPeriodId>({
  key: 'flood-area-protection-period',
  default: 'annual',
});

export const floodPopulationPeriodAtom = atom<FloodProtectionPeriodId>({
  key: 'flood-population-protection-period',
  default: 'annual',
});

export const floodStockPeriodAtom = atom<FloodProtectionPeriodId>({
  key: 'flood-stock-protection-period',
  default: 'annual',
});

import { atom } from 'jotai';

import { FloodProtectionPeriodId } from '@/containers/datasets/flood-protection/types';

export const floodAreaPeriodAtom = atom<FloodProtectionPeriodId>('annual');

export const floodPopulationPeriodAtom = atom<FloodProtectionPeriodId>('annual');

export const floodStockPeriodAtom = atom<FloodProtectionPeriodId>('annual');

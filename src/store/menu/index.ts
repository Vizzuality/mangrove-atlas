import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { syncEffect } from 'recoil-sync';

// Sidebar
export const activeCategoryAtom = atom<string>({
  key: 'category',
  default: 'distribution_and_change',
  effects: [syncEffect({ refine: string() })],
});

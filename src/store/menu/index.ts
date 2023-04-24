import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { syncEffect } from 'recoil-sync';

export const menuCategoryAtom = atom<string>({
  key: 'category',
  default: 'distribution_and_change',
  effects: [syncEffect({ refine: string() })],
});

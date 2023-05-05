import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const activeCategoryAtom = atom<string>({
  key: 'category',
  default: 'distribution_and_change',
  effects: [
    urlSyncEffect({
      refine: string(),
    }),
  ],
});

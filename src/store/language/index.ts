import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const languageAtom = atom({
  key: 'lan',
  default: 'en',
  effects: [
    urlSyncEffect({
      refine: string(),
    }),
  ],
});

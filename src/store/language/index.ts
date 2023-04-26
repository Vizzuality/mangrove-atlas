import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const languageAtom = atom({
  key: 'language',
  default: 'en',
  effects: [
    urlSyncEffect({
      refine: string(),
    }),
  ],
});

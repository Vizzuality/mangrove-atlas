import { atom } from 'recoil';

export const activeGuideAtom = atom<boolean>({
  key: 'active-guide',
  default: false,
});

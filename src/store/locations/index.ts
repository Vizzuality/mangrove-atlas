import { atom } from 'recoil';

export const locationsModalAtom = atom<boolean>({
  key: 'locations-modal',
  default: false,
});

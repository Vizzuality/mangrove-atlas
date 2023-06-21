import { atom } from 'recoil';

export const printModeState = atom({
  key: 'print-mode',
  default: false,
});

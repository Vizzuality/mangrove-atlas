import { atom } from 'recoil';

export const uploadFileAtom = atom<boolean>({
  key: 'upload-file-error',
  default: false,
});

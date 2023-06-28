import { atom } from 'recoil';

export const analysisAtom = atom<{
  enabled: boolean;
}>({
  key: 'analysis',
  default: {
    // ? this property determines if the analysis has been triggered or not
    enabled: false,
  },
});

export const analysisAlertAtom = atom<boolean>({
  key: 'analysis-alert',
  default: false,
});

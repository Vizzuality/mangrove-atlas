import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export const analysisAtom = atomWithReset<{
  enabled: boolean;
}>({
  // ? this property determines if the analysis has been triggered or not
  enabled: false,
});

export const analysisAlertAtom = atom<boolean>(false);

export const skipAnalysisAlertAtom = atomWithReset<boolean>(false);

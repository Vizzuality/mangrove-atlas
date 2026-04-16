import { atom } from 'jotai';

export const locationsModalAtom = atom<boolean>(false);

export const locationTypeAtom = atom(null as string | null);
export const locationIdAtom = atom(null as string | null);

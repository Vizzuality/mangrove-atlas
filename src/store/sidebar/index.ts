import { atom } from 'jotai';
import { parseAsString, useQueryState } from 'nuqs';

export function useSyncActiveCategory() {
  return useQueryState('category', parseAsString.withDefault('distribution_and_change'));
}

export const mapViewAtom = atom<boolean>(true);

export const locationToolAtom = atom<'worldwide' | 'upload' | 'search' | 'area'>('worldwide');

import { atom } from 'jotai';
import { parseAsString, useQueryState } from 'nuqs';

export function useSyncActiveCategory() {
  return useQueryState('category', parseAsString.withDefault('distribution_and_change'));
}

// Mobile only: false = widget list is the landing view (matches desktop, which
// always shows widgets); true = map-only. Tapping the "Map" nav toggle flips it.
// Defaults to false so mobile users land on the data, not a bare map.
export const mapViewAtom = atom<boolean>(false);

export const locationToolAtom = atom<'worldwide' | 'upload' | 'search' | 'area'>('worldwide');

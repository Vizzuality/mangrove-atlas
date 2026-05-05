import { atom } from 'jotai';
import { parseAsString, useQueryState } from 'nuqs';

export const mapSettingsAtom = atom<boolean>(false);

export function useSyncBasemapContextual() {
  return useQueryState('basemaps-contextual', parseAsString);
}

export const fullScreenAtom = atom<boolean>(false);

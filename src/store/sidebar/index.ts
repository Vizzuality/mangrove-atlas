import { atom } from 'jotai';
import { parseAsString, useQueryState } from 'nuqs';

import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

export function useSyncActiveCategory() {
  return useQueryState('category', parseAsString.withDefault('distribution_and_change'));
}

export const customCategoryAtom = atom<
  Partial<(WidgetSlugType | ContextualBasemapsId | 'custom-area')[]>
>([]);

export const mapViewAtom = atom<boolean>(true);

export const locationToolAtom = atom<'worldwide' | 'upload' | 'search' | 'area'>('worldwide');

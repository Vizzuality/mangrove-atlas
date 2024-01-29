import { useRouter } from 'next/router';

import { atom } from 'recoil';

import type { Category } from 'types/category';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

export const useSetActiveCategory = () => {
  const { replace, pathname, query } = useRouter();
  return async (newValue: Category) => {
    await replace({
      pathname,
      query: {
        ...query,
        category: `"${newValue}"`,
      },
    });
  };
};

export const customCategoryAtom = atom<
  Partial<(WidgetSlugType | ContextualBasemapsId | 'custom-area')[]>
>({
  key: 'custom',
  default: [],
});

export const mapViewAtom = atom<boolean>({
  key: 'map-view',
  default: true,
});

export const locationToolAtom = atom<'worldwide' | 'upload' | 'search' | 'area'>({
  key: 'location-tool',
  default: 'worldwide',
});

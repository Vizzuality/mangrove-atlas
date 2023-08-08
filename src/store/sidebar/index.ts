import { useRouter } from 'next/router';

import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const activeCategoryAtom = atom<string>({
  key: 'category',
  default: 'distribution_and_change',
  effects: [urlSyncEffect({ refine: string() })],
});

export const useSetActiveCategory = () => {
  const { replace, pathname, query } = useRouter();
  return async (newValue: string) => {
    await replace({
      pathname,
      query: {
        ...query,
        category: `"${newValue}"`,
      },
    });
  };
};

export const mapViewAtom = atom<boolean>({
  key: 'map-view',
  default: true,
});

export const placeSectionAtom = atom<'worldwide' | 'search' | 'area'>({
  key: 'place-section',
  default: 'worldwide',
});

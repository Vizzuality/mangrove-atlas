import { useRouter } from 'next/router';

import { atom, useSetRecoilState } from 'recoil';

export const activeCategoryAtom = atom<string>({
  key: 'category',
  default: 'distribution_and_change',
});

export const useSetActiveCategory = () => {
  const { replace, pathname, query } = useRouter();
  const setActiveCategory = useSetRecoilState(activeCategoryAtom);
  return async (newValue: string) => {
    setActiveCategory(newValue);
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

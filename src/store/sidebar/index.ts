import { useRouter } from 'next/router';

import { stringLiterals } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import type { Category } from 'types/category';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

const layerChecker = stringLiterals({
  distributionAndChange: 'distribution_and_change',
  // 'restoration_and_conservation',
  // 'climate_and_policy',
  // 'ecosystem_services',
  // 'contextual_layers',
  allDatasets: 'all_datasets',
});

export const activeCategoryAtom = atom({
  key: 'category',
  default: 'distribution_and_change',
  effects: [urlSyncEffect({ refine: layerChecker, history: 'replace' })],
});

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

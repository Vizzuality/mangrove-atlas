import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { StacAPI, StacIndexAPI } from 'services/stac';

import { EXTRA_CATALOGS } from './constants';
import type { ItemsResponse, StacIndexCatalog, StacNode } from './types';
import { resolveHref } from './utils';

const ITEMS_PAGE_SIZE = 12;

const fetchCatalogs = () =>
  StacIndexAPI.get<StacIndexCatalog[]>('/catalogs').then((res) => [
    // Pinned first: catalogs we care about that aren't registered on STAC Index.
    ...EXTRA_CATALOGS,
    ...res.data.filter((catalog) => !catalog.isPrivate && catalog.access === 'public'),
  ]);

export function useCatalogs() {
  return useQuery({
    queryKey: ['stac-index-catalogs'],
    queryFn: fetchCatalogs,
  });
}

export function useCatalog(slug?: string) {
  return useQuery({
    queryKey: ['stac-index-catalogs'],
    queryFn: fetchCatalogs,
    select: (catalogs) => catalogs.find((catalog) => catalog.slug === slug),
    enabled: !!slug,
  });
}

export function useStacNode(url?: string | null) {
  return useQuery({
    queryKey: ['stac-node', url],
    queryFn: () => {
      if (!url) throw new Error('Missing STAC node URL');
      return StacAPI.get<StacNode>(url).then((res) => res.data);
    },
    enabled: !!url,
  });
}

export function useStacItems(itemsUrl?: string | null) {
  return useInfiniteQuery({
    queryKey: ['stac-items', itemsUrl],
    queryFn: ({ pageParam }) => {
      if (!itemsUrl) throw new Error('Missing STAC items URL');
      return (
        pageParam
          ? StacAPI.get<ItemsResponse>(pageParam)
          : StacAPI.get<ItemsResponse>(itemsUrl, { params: { limit: ITEMS_PAGE_SIZE } })
      ).then((res) => res.data);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      const next = lastPage.links?.find((link) => link.rel === 'next')?.href;
      return next && itemsUrl ? resolveHref(next, itemsUrl) : undefined;
    },
    enabled: !!itemsUrl,
  });
}

import type { StacIndexCatalog } from './types';

/**
 * Catalogs surfaced in /catalog that are not registered on STAC Index.
 * Negative ids avoid clashing with STAC Index numeric ids; slugs must be
 * unique against STAC Index slugs since they share the /catalog/[slug] route.
 */
export const EXTRA_CATALOGS: StacIndexCatalog[] = [
  {
    id: -1,
    url: 'https://storage.googleapis.com/gmw-mvp-datalake-project-proproot/stac/catalog.json',
    slug: 'gmw',
    title: 'Global Mangrove Watch STAC',
    summary:
      'Global Mangrove Watch — SpatioTemporal Assets Catalogue. Mangrove extent and deforestation alerts from the GMW data lake.',
    access: 'public',
    created: '',
    updated: '',
    isPrivate: false,
    isApi: false,
    accessInfo: null,
  },
];

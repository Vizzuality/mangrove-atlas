import type { Geometry } from 'geojson';

export type StacIndexCatalog = {
  id: number;
  url: string;
  slug: string;
  title: string;
  summary: string;
  access: 'public' | 'protected' | 'private';
  created: string;
  updated: string;
  isPrivate: boolean;
  isApi: boolean;
  accessInfo: string | null;
};

export type StacLink = {
  rel: string;
  href: string;
  type?: string;
  title?: string;
};

export type StacAsset = {
  href: string;
  type?: string;
  title?: string;
  description?: string;
  roles?: string[];
};

export type StacExtent = {
  spatial?: { bbox: number[][] };
  temporal?: { interval: (string | null)[][] };
};

export type StacCatalog = {
  type: 'Catalog';
  stac_version: string;
  id: string;
  title?: string;
  description: string;
  links: StacLink[];
};

export type StacCollection = {
  type: 'Collection';
  stac_version: string;
  id: string;
  title?: string;
  description: string;
  license?: string;
  keywords?: string[];
  extent?: StacExtent;
  assets?: Record<string, StacAsset>;
  links: StacLink[];
};

export type StacItem = {
  type: 'Feature';
  stac_version: string;
  id: string;
  collection?: string;
  bbox?: number[];
  geometry: Geometry | null;
  properties: { datetime: string | null } & Record<string, unknown>;
  assets: Record<string, StacAsset>;
  links: StacLink[];
};

export type StacNode = StacCatalog | StacCollection | StacItem;

export type ItemsResponse = {
  type: 'FeatureCollection';
  features: StacItem[];
  links?: StacLink[];
  numberMatched?: number;
};

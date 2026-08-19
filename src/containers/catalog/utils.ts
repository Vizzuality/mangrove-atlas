import type { StacAsset, StacExtent, StacItem, StacLink, StacNode } from './types';

const DATE_FORMAT = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
const DATETIME_FORMAT = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

export function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : DATE_FORMAT.format(date);
}

export function formatDatetime(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : `${DATETIME_FORMAT.format(date)} UTC`;
}

export function formatTemporalExtent(extent?: StacExtent) {
  const [start, end] = extent?.temporal?.interval?.[0] ?? [];
  if (!start && !end) return null;
  return `${formatDate(start) ?? '…'} — ${formatDate(end) ?? 'present'}`;
}

export function resolveHref(href: string, base: string) {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

export function getChildLinks(node: StacNode) {
  return node.links?.filter((link) => link.rel === 'child') ?? [];
}

export function getItemLinks(node: StacNode) {
  return node.links?.filter((link) => link.rel === 'item') ?? [];
}

export function getItemsHref(node: StacNode, baseUrl: string) {
  const href = node.links?.find((link) => link.rel === 'items')?.href;
  return href ? resolveHref(href, baseUrl) : null;
}

export function getSelfHref(item: StacItem, baseUrl: string) {
  const href = item.links?.find((link) => link.rel === 'self')?.href;
  return href ? resolveHref(href, baseUrl) : null;
}

export function linkLabel(link: StacLink) {
  if (link.title) return link.title;
  const tail = link.href.split('/').filter(Boolean).pop() ?? link.href;
  return tail.replace(/\.json$/, '');
}

export function getLinkHref(node: StacNode, rel: string, baseUrl: string) {
  const href = node.links?.find((link) => link.rel === rel)?.href;
  return href ? resolveHref(href, baseUrl) : null;
}

/**
 * Human label for assets a map client can tile directly, so they can be
 * surfaced separately from plain downloads.
 */
export function tileAssetKind(asset: StacAsset) {
  if (/\{z\}/.test(asset.href) && /\{x\}/.test(asset.href)) return 'XYZ tiles';
  const type = asset.type?.toLowerCase() ?? '';
  if (type.includes('profile=cloud-optimized')) return 'Cloud-optimized GeoTIFF';
  if (type.includes('vnd.mapbox-vector-tile')) return 'Vector tiles';
  if (type.includes('tilejson') || /tilejson/i.test(asset.href)) return 'TileJSON';
  if (asset.roles?.includes('tiles')) return 'Tiles';
  return null;
}

/** Friendly format label for the asset badge; covers cloud-native data formats too. */
export function assetKindLabel(asset: StacAsset) {
  const type = asset.type?.toLowerCase() ?? '';
  const href = asset.href.toLowerCase();
  if (type.includes('vnd.apache.parquet') || href.endsWith('.parquet')) return 'GeoParquet';
  if (type.includes('vnd.pmtiles') || href.endsWith('.pmtiles')) return 'PMTiles';
  if (type.includes('geo+json') || href.endsWith('.geojson')) return 'GeoJSON';
  if (type.includes('flatgeobuf') || href.endsWith('.fgb')) return 'FlatGeobuf';
  return tileAssetKind(asset);
}

/** A single-file asset can be downloaded; a {z}/{x}/{y} URL template cannot. */
export function isDownloadableAsset(asset: StacAsset) {
  return !/\{z\}/.test(asset.href);
}

/**
 * Catalog hrefs come from third-party STAC JSON, so only http(s) URLs may be
 * rendered as links or image sources (blocks javascript:/data: schemes).
 */
export function safeHref(href?: string | null) {
  if (!href) return null;
  try {
    const { protocol } = new URL(href, 'https://placeholder.invalid');
    return protocol === 'http:' || protocol === 'https:' ? href : null;
  } catch {
    return null;
  }
}

/** External web viewers that can open an asset straight from its URL. */
export function assetViewerUrl(asset: StacAsset) {
  if (!safeHref(asset.href)) return null;
  const kind = assetKindLabel(asset);
  if (kind === 'GeoParquet') {
    return `https://geoparquet.info/?url=${encodeURIComponent(asset.href)}`;
  }
  if (kind === 'PMTiles') {
    return `https://pmtiles.io/?url=${encodeURIComponent(asset.href)}`;
  }
  return null;
}

const THUMBNAIL_KEYS = ['thumbnail', 'rendered_preview', 'preview'];

export function getItemThumbnail(item: StacItem) {
  for (const key of THUMBNAIL_KEYS) {
    const asset = item.assets?.[key];
    if (asset?.href && (!asset.type || asset.type.startsWith('image/'))) {
      const href = safeHref(asset.href);
      if (href) return href;
    }
  }
  return null;
}

export function prettifyPropertyKey(key: string) {
  const name = key.includes(':') ? key.split(':').slice(1).join(' ') : key;
  const spaced = name.replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

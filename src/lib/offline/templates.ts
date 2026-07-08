import { env } from '../../../env.mjs';

type StyleLayer = {
  source?: string;
  layout?: { visibility?: 'visible' | 'none' };
  paint?: Record<string, unknown>;
};

export type StyleReader = {
  getStyle?: () => { sources?: Record<string, unknown>; layers?: StyleLayer[] } | undefined;
};

// A source counts as visible if at least one layer draws from it with
// visibility !== 'none' and a non-zero *-opacity. Widgets keep per-year sources
// mounted but paint the inactive years at opacity 0, so opacity is what tells the
// on-screen layer apart from the dozens of dormant ones.
function visibleSourceIds(layers: StyleLayer[]): Set<string> {
  const visible = new Set<string>();
  layers.forEach((l) => {
    if (!l.source) return;
    if (l.layout?.visibility === 'none') return;
    const opacity = ['raster-opacity', 'fill-opacity', 'line-opacity', 'circle-opacity']
      .map((k) => l.paint?.[k])
      // only treat a *numeric* 0 as hidden; expressions/undefined mean "drawn"
      .filter((v) => typeof v === 'number');
    if (opacity.length && opacity.every((v) => v === 0)) return;
    visible.add(l.source);
  });
  return visible;
}

const originOf = (raw?: string) => {
  try {
    return raw ? new URL(raw).origin : null;
  } catch {
    return null;
  }
};
const offlineBaseOrigin = originOf(env.NEXT_PUBLIC_OFFLINE_BASEMAP_URL);
const alertsTilerOrigin = originOf(env.NEXT_PUBLIC_ALERTS_TILER_URL);

/**
 * Raster tile templates from the live map style that are TOS-safe to cache:
 * our GCS tilesets + the configured offline basemap. Mapbox-hosted sources are
 * excluded. Shared by the viewport prefetch (B) and region download (C).
 */
export function collectCacheableTemplates(map: StyleReader | undefined): string[] {
  const templates = new Set<string>();
  try {
    const style = map?.getStyle?.();
    const sources = style?.sources ?? {};
    const visible = visibleSourceIds(style?.layers ?? []);
    Object.entries(sources).forEach(([sourceId, src]) => {
      // Skip sources no visible layer draws from — they're dormant per-year /
      // toggled-off tilesets that shouldn't inflate the download.
      if (!visible.has(sourceId)) return;
      const tiles = (src as { tiles?: string[] })?.tiles;
      if (!Array.isArray(tiles)) return;
      tiles.forEach((tpl) => {
        try {
          const probe = new URL(tpl.replace(/\{[^}]+\}/g, '0'));
          if (
            /storage\.googleapis\.com$/.test(probe.host) ||
            (offlineBaseOrigin && probe.origin === offlineBaseOrigin) ||
            (alertsTilerOrigin && probe.origin === alertsTilerOrigin)
          ) {
            templates.add(tpl);
          }
        } catch {
          /* non-absolute template — skip */
        }
      });
    });
  } catch {
    /* style not ready */
  }

  if (env.NEXT_PUBLIC_OFFLINE_BASEMAP_URL) templates.add(env.NEXT_PUBLIC_OFFLINE_BASEMAP_URL);
  return [...templates];
}

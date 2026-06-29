import { env } from '../../../env.mjs';

export type StyleReader = {
  getStyle?: () => { sources?: Record<string, unknown> } | undefined;
};

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
    const sources = map?.getStyle?.()?.sources ?? {};
    Object.values(sources).forEach((src) => {
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

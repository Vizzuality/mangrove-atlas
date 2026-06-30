import { useEffect } from 'react';

import { useMap } from 'react-map-gl';

import { collectCacheableTemplates, type StyleReader } from './templates';
import { expandTemplate, tilesForBBox, OVERZOOM_MAX, type BBox } from './tiles';

const DEBOUNCE_MS = 1500;
const PREFETCH_CAP = 160; // tiles per layer across the zoom window — bounds bandwidth
const ZOOM_PAD = 1; // warm one zoom level beyond the current view

/**
 * B — opportunistic prefetch for *accidental* offline. While online, after the
 * map settles, quietly fetches the tiles immediately around the current view
 * (this zoom ±1) for cacheable layers. The SW caches them, so a small zoom/pan
 * after losing connection still renders instead of going blank.
 *
 * Deliberately conservative: debounced, capped, online-only, and skipped at high
 * zoom where the tile count around a view explodes.
 */
export function useViewportPrefetch(mapId = 'default') {
  const maps = useMap();
  const map = (maps as Record<string, { getMap?: () => unknown } | undefined>)[mapId];

  useEffect(() => {
    const rawMap = (map?.getMap?.() ?? map) as
      | (StyleReader & {
          on?: (ev: string, cb: () => void) => void;
          off?: (ev: string, cb: () => void) => void;
          getZoom?: () => number;
          getBounds?: () => { toArray: () => number[][] };
        })
      | undefined;
    if (!rawMap?.on || !rawMap.getBounds) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) return;
      const templates = collectCacheableTemplates(rawMap);
      if (!templates.length) return;

      const z = Math.round(rawMap.getZoom?.() ?? 0);
      const b = rawMap.getBounds?.()?.toArray?.(); // [[w,s],[e,n]]
      if (!b) return;
      const bbox: BBox = [b[0][0], b[0][1], b[1][0], b[1][1]];

      // Warm the whole low pyramid (z0..current) for the view so zooming OUT
      // offline stays filled; the cap drops the highest levels first if needed.
      // Zooming IN past OVERZOOM_MAX is covered by Mapbox overzoom of cached tiles.
      const zMax = Math.min(z + ZOOM_PAD, OVERZOOM_MAX);
      const coords = tilesForBBox(bbox, 0, zMax, PREFETCH_CAP);
      templates.forEach((tpl) => {
        coords.forEach((t) => {
          // Fire-and-forget — the SW intercepts and caches. Failures are ignored.
          fetch(expandTemplate(tpl, t), { mode: 'cors' }).catch(() => {});
        });
      });
    };

    const onIdle = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, DEBOUNCE_MS);
    };

    rawMap.on('idle', onIdle);
    return () => {
      if (timer) clearTimeout(timer);
      rawMap.off?.('idle', onIdle);
    };
  }, [map]);
}

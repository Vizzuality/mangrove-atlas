import { useCallback, useEffect } from 'react';

import { useMap } from 'react-map-gl';

import { downloadProgressAtom, regionsAtom } from '@/store/offline';

import { useAtom, useSetAtom } from 'jotai';

import { deleteRegion, listRegions, putRegion, type OfflineRegion } from './regions';
import { onSWMessage, sendToSW } from './sw-messages';
import { collectCacheableTemplates, type StyleReader } from './templates';
import { expandTemplate, tilesForBBox, OVERZOOM_MAX, type BBox, type Tile } from './tiles';

// Max tiles enumerated for a region download (across zooms 0..12). z12 dominates,
// so 5k was hit by even a few-degree view; 20k covers ~14°×14° before warning.
export const MAX_REGION_TILES = 20000;

const newId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto && crypto.randomUUID()) ||
  `region-${String(performance.now()).replace('.', '')}`;

export type DownloadOptions = {
  name: string;
  bbox: BBox;
  minZoom: number;
  maxZoom: number;
};

export function useOfflineDownload(mapId = 'default') {
  const maps = useMap();
  const map = (maps as Record<string, { getMap?: () => unknown } | undefined>)[mapId];
  const [regions, setRegions] = useAtom(regionsAtom);
  const setProgress = useSetAtom(downloadProgressAtom);

  const refreshRegions = useCallback(() => {
    listRegions()
      .then(setRegions)
      .catch(() => setRegions([]));
  }, [setRegions]);

  // Hydrate the regions list once and reflect SW progress messages into the atom.
  useEffect(() => {
    refreshRegions();
    const off = onSWMessage((data) => {
      const msg = data as {
        type?: string;
        regionId?: string;
        done?: number;
        failed?: number;
        total?: number;
      };
      if (msg.type === 'CACHE_PROGRESS') {
        setProgress((p) => ({
          ...p,
          status: 'running',
          regionId: msg.regionId ?? p.regionId,
          done: msg.done ?? p.done,
          failed: msg.failed ?? p.failed,
          total: msg.total ?? p.total,
        }));
      } else if (msg.type === 'CACHE_DONE') {
        setProgress((p) => ({
          ...p,
          status: 'done',
          done: msg.done ?? p.done,
          failed: msg.failed ?? p.failed,
        }));
      }
    });
    return off;
  }, [refreshRegions, setProgress]);

  const estimateTiles = useCallback(
    (bbox: BBox, minZoom: number, maxZoom: number) => {
      const rawMap = (map?.getMap?.() ?? map) as StyleReader | undefined;
      const templates = collectCacheableTemplates(rawMap);
      const lo = Math.max(0, Math.min(minZoom, maxZoom));
      const hi = Math.min(Math.max(minZoom, maxZoom), OVERZOOM_MAX);
      const perLayer = tilesForBBox(bbox, lo, hi, MAX_REGION_TILES).length;
      return {
        templates: templates.length,
        tiles: perLayer * Math.max(templates.length, 1),
        // cap reached → the area/zoom is too big to fully cache (only a prefix saves).
        capped: perLayer >= MAX_REGION_TILES,
      };
    },
    [map]
  );

  const download = useCallback(
    async ({ name, bbox, minZoom, maxZoom }: DownloadOptions) => {
      const rawMap = (map?.getMap?.() ?? map) as StyleReader | undefined;
      const templates = collectCacheableTemplates(rawMap);
      // Never request above the native pyramid depth — Mapbox overzooms cached
      // z<=OVERZOOM_MAX tiles to fill every higher zoom level offline.
      const lo = Math.max(0, Math.min(minZoom, maxZoom));
      const hi = Math.min(Math.max(minZoom, maxZoom), OVERZOOM_MAX);
      const coords: Tile[] = tilesForBBox(bbox, lo, hi, MAX_REGION_TILES);
      const urls = templates.flatMap((tpl) => coords.map((t) => expandTemplate(tpl, t)));

      const regionId = newId();
      setProgress({ regionId, status: 'running', done: 0, failed: 0, total: urls.length });

      // Persist already-loaded widget JSON for this location, then cache tiles.
      sendToSW({ type: 'PERSIST_DATA_CACHE' });
      sendToSW({ type: 'CACHE_URLS', urls, regionId, total: urls.length });

      const region: OfflineRegion = {
        id: regionId,
        name,
        bbox,
        minZoom: lo,
        maxZoom: hi,
        layerIds: templates,
        tileCount: coords.length,
        urls,
        createdAt: Date.now(),
      };
      await putRegion(region).catch(() => {});
      refreshRegions();
      return region;
    },
    [map, refreshRegions, setProgress]
  );

  const removeRegion = useCallback(
    async (id: string) => {
      const region = regions.find((r) => r.id === id);
      if (region) sendToSW({ type: 'DELETE_REGION_URLS', urls: region.urls });
      await deleteRegion(id).catch(() => {});
      refreshRegions();
    },
    [regions, refreshRegions]
  );

  return { regions, download, removeRegion, refreshRegions, estimateTiles };
}

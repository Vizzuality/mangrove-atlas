import { useCallback, useMemo, useState } from 'react';

import { useMap } from 'react-map-gl';

import cn from '@/lib/classnames';
import { useOfflineDownload } from '@/lib/offline/download';
import type { BBox } from '@/lib/offline/tiles';

import { drawingToolAtom } from '@/store/drawing-tool';
import { tmpCameraAtom } from '@/store/map';
import { downloadProgressAtom, offlineModeAtom } from '@/store/offline';

import turfBbox from '@turf/bbox';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MIN_Z = 0;
const MAX_Z = 12; // native pyramid depth; higher zooms scale from these (overzoom)

type Props = { mapId: string };

const OfflineDownload = ({ mapId }: Props) => {
  const { [mapId]: map } = useMap();
  const { regions, download, removeRegion, estimateTiles } = useOfflineDownload(mapId);
  const progress = useAtomValue(downloadProgressAtom);
  const [offlineMode, setOfflineMode] = useAtom(offlineModeAtom);
  const setTmpCamera = useSetAtom(tmpCameraAtom);
  const { customGeojson, uploadedGeojson } = useAtomValue(drawingToolAtom);

  const drawn = customGeojson || uploadedGeojson;
  const [source, setSource] = useState<'view' | 'drawn'>('view');
  const [minZoom, setMinZoom] = useState(0);
  const [maxZoom, setMaxZoom] = useState(MAX_Z);
  const [name, setName] = useState('');

  const getBBox = useCallback((): BBox | null => {
    if (source === 'drawn' && drawn) {
      const [w, s, e, n] = turfBbox(drawn as GeoJSON.FeatureCollection);
      return [w, s, e, n];
    }
    const b = map?.getMap?.()?.getBounds?.()?.toArray?.(); // [[w,s],[e,n]]
    if (!b) return null;
    return [b[0][0], b[0][1], b[1][0], b[1][1]];
  }, [source, drawn, map]);

  const estimate = useMemo(() => {
    const bbox = getBBox();
    if (!bbox) return null;
    return estimateTiles(bbox, minZoom, maxZoom);
    // re-run when inputs change
  }, [getBBox, estimateTiles, minZoom, maxZoom]);

  const isRunning = progress.status === 'running';

  const handleDownload = useCallback(() => {
    const bbox = getBBox();
    if (!bbox) return;
    void download({
      name: name.trim() || `Offline area (${regions.length + 1})`,
      bbox,
      minZoom: Math.min(minZoom, maxZoom),
      maxZoom: Math.max(minZoom, maxZoom),
    });
    setName('');
  }, [getBBox, download, name, regions.length, minZoom, maxZoom]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Offline maps"
          className={cn(
            'group shadow-control inline-flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white hover:bg-gray-100',
            offlineMode && 'bg-brand-800'
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className={cn(
              'h-5 w-5 fill-none stroke-current',
              offlineMode ? 'text-white' : 'text-black/85'
            )}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
            <path d="M5 21h14" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" side="left" className="notranslate w-80">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Offline maps</h3>
          <Button
            type="button"
            variant={offlineMode ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setOfflineMode((v) => !v)}
          >
            {offlineMode ? 'Working offline' : 'Work offline'}
          </Button>
        </div>

        <fieldset className="space-y-1">
          <legend className="text-xs font-medium text-black/60">Area to download</legend>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="radio"
              name="offline-source"
              checked={source === 'view'}
              onChange={() => setSource('view')}
            />
            Current map view
          </label>
          <label className={cn('flex items-center gap-2 text-xs', !drawn && 'opacity-40')}>
            <input
              type="radio"
              name="offline-source"
              checked={source === 'drawn'}
              disabled={!drawn}
              onChange={() => setSource('drawn')}
            />
            Drawn / uploaded area
          </label>
        </fieldset>

        <div className="flex items-center gap-3 text-xs">
          <label className="flex flex-1 flex-col gap-1">
            Min zoom
            <input
              type="number"
              min={MIN_Z}
              max={MAX_Z}
              value={minZoom}
              onChange={(e) => setMinZoom(Number(e.target.value))}
              className="rounded border border-black/15 px-2 py-1"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1">
            Max zoom
            <input
              type="number"
              min={MIN_Z}
              max={MAX_Z}
              value={maxZoom}
              onChange={(e) => setMaxZoom(Number(e.target.value))}
              className="rounded border border-black/15 px-2 py-1"
            />
          </label>
        </div>

        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-black/15 px-2 py-1 text-xs"
        />

        {estimate && (
          <p className="text-xs text-black/60">
            ~{estimate.tiles.toLocaleString()} tiles across {estimate.templates || 1} layer(s).
            Higher zooms scale from these automatically.
          </p>
        )}

        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-full"
          disabled={isRunning || !estimate}
          onClick={handleDownload}
        >
          {isRunning ? `Downloading… ${progress.done}/${progress.total}` : 'Download area'}
        </Button>

        {isRunning && (
          <div className="h-1.5 w-full overflow-hidden rounded bg-black/10">
            <div
              className="bg-brand-800 h-full transition-all"
              style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
        )}
        {progress.status === 'done' && progress.failed > 0 && (
          <p className="text-xs text-amber-600">
            {progress.failed} tile(s) failed (likely uncached layers).
          </p>
        )}

        {regions.length > 0 && (
          <div className="space-y-1 border-t border-black/10 pt-2">
            <p className="text-xs font-medium text-black/60">Downloaded areas</p>
            <ul className="space-y-1">
              {regions.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    className="truncate text-left hover:underline"
                    title={`Zooms ${r.minZoom}–${r.maxZoom}`}
                    onClick={() => setTmpCamera({ bbox: r.bbox })}
                  >
                    {r.name}
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${r.name}`}
                    className="text-black/40 hover:text-red-600"
                    onClick={() => void removeRegion(r.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default OfflineDownload;

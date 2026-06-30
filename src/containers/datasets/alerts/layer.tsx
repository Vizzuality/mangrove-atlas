import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import { useSyncActiveLayers } from '@/store/layers';
import { isOfflineAtom } from '@/store/offline';

import { useAtomValue } from 'jotai';

import type { LayerProps } from 'types/layers';

import { env } from '../../../../env.mjs';

import { useLayers, useSource } from './hooks';

const MangrovesAlertsLayer = ({ beforeId, id, onAdd, onRemove }: LayerProps) => {
  const [activeLayers] = useSyncActiveLayers();
  const activeLayer = activeLayers?.find((l) => l.id === id);
  const isOffline = useAtomValue(isOfflineAtom);

  const source = useSource();
  const LAYERS = useLayers({
    id,
    opacity: parseFloat(activeLayer.opacity),
    visibility: activeLayer.visibility,
  });

  useEffect(() => {
    const ids = LAYERS.map((l) => l.id);
    onAdd(ids);
    return () => onRemove(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAdd, onRemove]);

  // OFFLINE: self-hosted raster {z}/{x}/{y} from GCS (cacheable, TOS-safe) instead
  // of the Mapbox vector tileset. Raster = no per-point interactivity, accepted offline.
  if (isOffline && env.NEXT_PUBLIC_ALERTS_TILER_URL) {
    const tiles = env.NEXT_PUBLIC_ALERTS_TILER_URL.replace(
      /\{year\}/g,
      String(new Date().getFullYear())
    );
    return (
      <Source
        id="alerts-raster"
        type="raster"
        tiles={[tiles]}
        tileSize={256}
        minzoom={0}
        maxzoom={12}
      >
        <Layer
          id={`${id}-raster`}
          type="raster"
          source="alerts-raster"
          paint={{ 'raster-opacity': parseFloat(activeLayer.opacity) }}
          layout={{ visibility: activeLayer.visibility }}
          beforeId={beforeId}
        />
      </Source>
    );
  }

  if (!source || !LAYERS) return null;

  return (
    <Source key={source.id} {...source}>
      {LAYERS.map((layer) => (
        <Layer key={layer.id} {...layer} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default MangrovesAlertsLayer;

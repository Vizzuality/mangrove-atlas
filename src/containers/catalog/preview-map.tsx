'use client';

import { useMemo, useState } from 'react';

import Map, { Layer, Source } from 'react-map-gl';

import type { Geometry } from 'geojson';

import BASEMAPS from '@/containers/datasets/contextual-layers/basemaps';

import type { StacAsset } from './types';
import { tileAssetKind } from './utils';

const BASEMAP_STYLE = BASEMAPS.find((basemap) => basemap.id === 'light')?.url;

/** Only XYZ image templates can be previewed without a tiling service. */
export function isPreviewableTileAsset(asset: StacAsset) {
  return (
    tileAssetKind(asset) === 'XYZ tiles' &&
    (!asset.type || asset.type.startsWith('image/')) &&
    !asset.href.includes('{-y}')
  );
}

type PreviewMapProps = {
  bbox?: number[];
  geometry?: Geometry | null;
  tileAssets?: Record<string, StacAsset>;
};

export default function PreviewMap({ bbox, geometry, tileAssets = {} }: PreviewMapProps) {
  const previewable = useMemo(
    () => Object.entries(tileAssets).filter(([, asset]) => isPreviewableTileAsset(asset)),
    [tileAssets]
  );
  const [activeAssetKey, setActiveAssetKey] = useState<string | null>(previewable[0]?.[0] ?? null);

  const bounds = useMemo(() => {
    if (!bbox?.length) return undefined;
    // 2D bbox is [w, s, e, n]; 3D is [w, s, zmin, e, n, zmax].
    const [west, south, east, north] =
      bbox.length === 6 ? [bbox[0], bbox[1], bbox[3], bbox[4]] : bbox;
    return [
      [Math.max(west, -179.9), Math.max(south, -85)],
      [Math.min(east, 179.9), Math.min(north, 85)],
    ] as [[number, number], [number, number]];
  }, [bbox]);

  // Collections only carry a bbox — draw it as the footprint so the extent is visible.
  const footprint = useMemo<Geometry | null>(() => {
    if (geometry) return geometry;
    if (!bounds) return null;
    const [[west, south], [east, north]] = bounds;
    return {
      type: 'Polygon',
      coordinates: [
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south],
        ],
      ],
    };
  }, [geometry, bounds]);

  if (!bounds && !geometry) return null;

  const activeAsset = activeAssetKey ? tileAssets[activeAssetKey] : null;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold tracking-wide text-black/85 uppercase">Map preview</h2>
        {previewable.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {previewable.map(([key, asset]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveAssetKey(activeAssetKey === key ? null : key)}
                aria-pressed={activeAssetKey === key}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  activeAssetKey === key
                    ? 'bg-brand-800 border-brand-800 text-white'
                    : 'text-brand-800 border-brand-800/40 hover:bg-brand-800/5'
                }`}
              >
                {asset.title ?? key}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="h-72 w-full overflow-hidden rounded-xl border border-black/10 shadow-sm">
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle={BASEMAP_STYLE}
          initialViewState={{ bounds, fitBoundsOptions: { padding: 24 } }}
          attributionControl={false}
          reuseMaps
          style={{ width: '100%', height: '100%' }}
        >
          {activeAsset && (
            <Source
              key={activeAsset.href}
              id="catalog-preview-tiles"
              type="raster"
              tiles={[activeAsset.href]}
              tileSize={256}
            >
              <Layer
                id="catalog-preview-tiles-layer"
                type="raster"
                source="catalog-preview-tiles"
              />
            </Source>
          )}
          {footprint && (
            <Source id="catalog-preview-footprint" type="geojson" data={footprint}>
              <Layer
                id="catalog-preview-footprint-fill"
                type="fill"
                source="catalog-preview-footprint"
                paint={{ 'fill-color': '#00857f', 'fill-opacity': 0.08 }}
              />
              <Layer
                id="catalog-preview-footprint-line"
                type="line"
                source="catalog-preview-footprint"
                paint={{ 'line-color': '#00857f', 'line-width': 1.5 }}
              />
            </Source>
          )}
        </Map>
      </div>
    </section>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import type { MapRef } from 'react-map-gl';
import { Map } from 'react-map-gl';

import { useSyncBasemap, useSyncURLBounds } from '@/store/map';

import { useQueryClient } from '@tanstack/react-query';
import type { LngLatBoundsLike } from 'mapbox-gl';

import BASEMAPS from '@/containers/datasets/contextual-layers/basemaps';
import { LAYERS } from '@/containers/layers/constants';
import { MAP_DEFAULT_PROPS } from '@/containers/map';
import LayerManager from '@/containers/map/layer-manager';

import { env } from 'env.mjs';

/**
 * The map that accompanies a widget whose layer is switched on: the same camera
 * as the report's main map, showing only this widget's layer, with that layer's
 * legend beneath it.
 *
 * Each card is its own WebGL context, so the report caps how many it mounts
 * (see `MAX_LAYER_CARDS` in ./index).
 */
const PrintLayerCard = ({ slug, layerIds }: { slug: string; layerIds: string[] }) => {
  const [basemap] = useSyncBasemap();
  const [URLBounds] = useSyncURLBounds();
  const queryClient = useQueryClient();

  const selectedBasemap = useMemo(() => BASEMAPS.find((b) => b.id === basemap)?.url, [basemap]);

  // Same camera resolution as the main map: URL bounds first (what the user was
  // actually looking at), then the prefetched location bounds.
  const bounds = useMemo(
    () =>
      ((URLBounds as number[][] | null) ??
        queryClient.getQueryData<number[][]>(['location-bounds']) ??
        null) as LngLatBoundsLike | null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const initialViewState = useMemo(
    () =>
      bounds
        ? { ...MAP_DEFAULT_PROPS.initialViewState, bounds, fitBoundsOptions: { padding: 0 } }
        : MAP_DEFAULT_PROPS.initialViewState,
    [bounds]
  );

  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * The card starts at its own min-height and then stretches to the height of
   * the widget beside it. Mapbox fitted the bounds to the first size, so without
   * this the canvas keeps it — cropped along one edge, off-centre. Refitting
   * re-centres on the location and lets the spare axis show more map.
   */
  const fitToCard = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.resize();
    if (bounds) map.fitBounds(bounds, { padding: 0, animate: false });
  }, [bounds]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(fitToCard);
    observer.observe(element);
    return () => observer.disconnect();
  }, [fitToCard]);

  const title = useMemo(
    () => LAYERS.find((l) => layerIds.includes(l.id))?.name ?? 'Map layer',
    [layerIds]
  );

  return (
    // `self-stretch` against the grid's `items-start`: the map matches the
    // height of the widget it belongs to, and fills the card edge to edge — no
    // padding, no visible heading, just the layer.
    <div
      ref={containerRef}
      className="print-report-map relative min-h-[60mm] break-inside-avoid self-stretch overflow-hidden rounded-[20px] border border-black/10 bg-white"
    >
      {/* Named for screen readers only; on the page the map speaks for itself. */}
      <h2 className="sr-only">{title}</h2>
      <Map
        ref={mapRef}
        id={`print-report-${slug}`}
        onLoad={fitToCard}
        mapStyle={selectedBasemap}
        initialViewState={initialViewState}
        minZoom={MAP_DEFAULT_PROPS.minZoom}
        maxZoom={MAP_DEFAULT_PROPS.maxZoom}
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        interactive={false}
        preserveDrawingBuffer
        // react-map-gl v7 calls this unconditionally; without it a map error
        // throws `props.onError is not a function` and takes the page with it.
        onError={(e) => console.error('Layer map error:', e.error?.message)}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <LayerManager layerIds={layerIds} registerInteractions={false} />
      </Map>
    </div>
  );
};

export default PrintLayerCard;

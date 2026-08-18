'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { useMap } from 'react-map-gl';

import { useIsFetching } from '@tanstack/react-query';

/**
 * Recharts' default `animationDuration` is 1.5s and only some of our chart
 * configs opt out of it, so we let the animations land before declaring the
 * page printable — a chart caught mid-animation prints half-drawn.
 */
const CHART_SETTLE_MS = 1600;

/**
 * Last-resort escape hatch: if the map never reports itself idle (offline,
 * blocked tiles, WebGL unavailable) the user would otherwise be stuck with a
 * permanently disabled print button.
 */
const READY_TIMEOUT_MS = 15000;

/**
 * True once the report is safe to send to the printer: no queries in flight,
 * the map has finished rendering its tiles, webfonts are resolved and the
 * charts have settled.
 */
export default function usePrintReady(mapId = 'print-report') {
  const fetchingCount = useIsFetching();
  const maps = useMap();
  const map = maps[mapId];

  // `idle` fires once the style, sources and visible tiles are all rendered.
  const subscribeToMap = useCallback(
    (onChange: () => void) => {
      if (!map) return () => undefined;
      const mapInstance = map.getMap();
      mapInstance.on('idle', onChange);
      return () => {
        mapInstance.off('idle', onChange);
      };
    },
    [map]
  );

  const getMapIdle = useCallback(() => {
    if (!map) return false;
    const mapInstance = map.getMap();
    return mapInstance.loaded() && mapInstance.areTilesLoaded();
  }, [map]);

  const mapIdle = useSyncExternalStore(subscribeToMap, getMapIdle, () => false);

  const [fontsReady, setFontsReady] = useState(false);
  const [settled, setSettled] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fonts =
      typeof document !== 'undefined' && 'fonts' in document ? document.fonts.ready : null;

    void Promise.resolve(fonts).then(() => {
      if (!cancelled) setFontsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setTimedOut(true), READY_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  const dependenciesReady = fetchingCount === 0 && mapIdle && fontsReady;

  useEffect(() => {
    if (!dependenciesReady) return;

    let timeout: ReturnType<typeof setTimeout>;
    // Wait a frame so the layout triggered by the last data arrival is flushed
    // before we start counting the animation settle window.
    const frame = requestAnimationFrame(() => {
      timeout = setTimeout(() => setSettled(true), CHART_SETTLE_MS);
    });

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [dependenciesReady]);

  // `settled` is deliberately never reset: it gates the first render pass, and
  // `dependenciesReady` already drops the button back to "preparing" if a late
  // widget query starts fetching.
  return (dependenciesReady && settled) || timedOut;
}

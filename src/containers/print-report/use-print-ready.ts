'use client';

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';

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
export default function usePrintReady(mainMapId = 'print-report') {
  const fetchingCount = useIsFetching();
  const maps = useMap();

  // The report's own map plus one per layer card — all of them must have drawn.
  const mapInstances = useMemo(
    () =>
      Object.entries(maps)
        .filter(([key, value]) => key !== 'current' && !!value)
        .map(([, value]) => value.getMap()),
    [maps]
  );

  const hasMainMap = !!maps[mainMapId];

  // `idle` fires once the style, sources and visible tiles are all rendered.
  const subscribeToMaps = useCallback(
    (onChange: () => void) => {
      mapInstances.forEach((mapInstance) => mapInstance.on('idle', onChange));
      return () => {
        mapInstances.forEach((mapInstance) => mapInstance.off('idle', onChange));
      };
    },
    [mapInstances]
  );

  const getMapsIdle = useCallback(() => {
    if (!hasMainMap || !mapInstances.length) return false;
    return mapInstances.every(
      (mapInstance) => mapInstance.loaded() && mapInstance.areTilesLoaded()
    );
  }, [hasMainMap, mapInstances]);

  const mapIdle = useSyncExternalStore(subscribeToMaps, getMapsIdle, () => false);

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

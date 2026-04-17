import { FC, useCallback, useEffect, useState } from 'react';

import ReactMapGL, { ViewState, ViewStateChangeEvent, useMap } from 'react-map-gl';

import cx from 'classnames';
import { useDebouncedCallback } from 'use-debounce';

import { DEFAULT_VIEW_STATE } from './constants';
import type { CustomMapProps } from './types';

export const CustomMap: FC<CustomMapProps> = ({
  id = 'default',
  children,
  className,
  viewState,
  constrainedAxis,
  initialViewState,
  bounds,
  onMapViewStateChange,
  dragPan = true,
  dragRotate = true,
  scrollZoom = true,
  doubleClickZoom = true,
  onLoad,
  ...mapboxProps
}) => {
  const { [id]: mapRef } = useMap();

  // Enable mapbox-gl's testMode under browser automation (Playwright et al.)
  // so the map initializes without WebGL/tokens in headless Chromium.
  // See https://docs.mapbox.com/mapbox-gl-js/guides/security-and-testing/
  // `navigator.webdriver` is the W3C-standard flag automation tools set.
  const testMode = typeof navigator !== 'undefined' && navigator.webdriver === true;

  const [localViewState, setLocalViewState] = useState<Partial<ViewState>>(
    initialViewState || { ...DEFAULT_VIEW_STATE, ...viewState }
  );
  const [isFlying, setFlying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const debouncedViewStateChange = useDebouncedCallback((_viewState: ViewState) => {
    onMapViewStateChange?.(_viewState);
  }, 250);

  const handleFitBounds = useCallback(() => {
    const { bbox, options } = bounds || { bbox: [0, 0, 0, 0] as any, options: undefined };
    setFlying(true);

    try {
      mapRef?.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        options
      );
    } catch (e) {
      setFlying(false);
      console.error(e);
    }
  }, [bounds, mapRef]);

  const handleMapMove = useCallback(
    ({ viewState: _viewState }: ViewStateChangeEvent) => {
      const newViewState = {
        ..._viewState,
        latitude:
          constrainedAxis === 'y'
            ? (localViewState.latitude ?? _viewState.latitude)
            : _viewState.latitude,
        longitude:
          constrainedAxis === 'x'
            ? (localViewState.longitude ?? _viewState.longitude)
            : _viewState.longitude,
      };

      setLocalViewState(newViewState);
      debouncedViewStateChange(newViewState);
    },
    [constrainedAxis, localViewState.latitude, localViewState.longitude, debouncedViewStateChange]
  );

  const handleMapLoad = useCallback<NonNullable<CustomMapProps['onLoad']>>(
    (e) => {
      setLoaded(true);
      onLoad?.(e);
    },
    [onLoad]
  );

  useEffect(() => {
    if (mapRef && bounds) handleFitBounds();
  }, [mapRef, bounds, handleFitBounds]);

  useEffect(() => {
    setLocalViewState((prev) => ({ ...prev, ...viewState }));
  }, [viewState]);

  useEffect(() => {
    if (!bounds) return;
    const duration = bounds.options?.duration ?? 0;

    if (!isFlying) return;
    const t = window.setTimeout(() => setFlying(false), duration);

    return () => window.clearTimeout(t);
  }, [bounds, isFlying]);

  return (
    <div className={cx(className, 'relative z-0 h-screen w-full print:h-[90vh]')}>
      <ReactMapGL
        id={id}
        initialViewState={initialViewState}
        dragPan={!isFlying && dragPan}
        dragRotate={!isFlying && dragRotate}
        scrollZoom={!isFlying && scrollZoom}
        doubleClickZoom={!isFlying && doubleClickZoom}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMove={handleMapMove}
        onLoad={handleMapLoad}
        testMode={testMode}
        {...mapboxProps}
        {...localViewState}
      >
        {!!mapRef && loaded && typeof children === 'function' && children(mapRef.getMap())}
      </ReactMapGL>
    </div>
  );
};

export default CustomMap;

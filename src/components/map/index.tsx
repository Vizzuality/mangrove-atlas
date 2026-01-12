import { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
  dragPan,
  dragRotate,
  scrollZoom,
  doubleClickZoom,
  onLoad,
  ...mapboxProps
}) => {
  const { [id]: mapRef } = useMap();

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

  // ✅ sanitize null -> undefined to satisfy react-map-gl types
  const { terrain, fog, ...restMapProps } = mapboxProps as any;

  const safeTerrain = useMemo(() => (terrain == null ? undefined : terrain), [terrain]);
  const safeFog = useMemo(() => (fog == null ? undefined : fog), [fog]);

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
        terrain={safeTerrain}
        fog={safeFog}
        {...restMapProps}
        {...localViewState}
      >
        {!!mapRef && loaded && typeof children === 'function' && children(mapRef.getMap())}
      </ReactMapGL>
    </div>
  );
};

export default CustomMap;

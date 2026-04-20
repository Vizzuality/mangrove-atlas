import { FC, useCallback, useMemo, useState } from 'react';

import ReactMapGL, { ViewStateChangeEvent, useMap } from 'react-map-gl';

import cx from 'classnames';
import type { LngLatBoundsLike } from 'mapbox-gl';

import { DEFAULT_VIEW_STATE } from './constants';
import type { CustomMapProps } from './types';

export const CustomMap: FC<CustomMapProps> = ({
  id = 'default',
  children,
  className,
  constrainedAxis,
  initialViewState,
  defaultBbox,
  onMapMove,
  onLoad,
  dragPan = true,
  dragRotate = true,
  scrollZoom = true,
  doubleClickZoom = true,
  ...mapboxProps
}) => {
  const { [id]: mapRef } = useMap();

  const testMode = typeof navigator !== 'undefined' && navigator.webdriver === true;

  const computedInitialViewState = useMemo(
    () => ({
      ...DEFAULT_VIEW_STATE,
      ...initialViewState,
      ...(defaultBbox ? { bounds: defaultBbox as LngLatBoundsLike } : {}),
    }),
    // initialViewState and defaultBbox only matter on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [localViewState, setLocalViewState] = useState(computedInitialViewState);
  const [loaded, setLoaded] = useState(false);

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
      onMapMove?.();
    },
    [constrainedAxis, localViewState.latitude, localViewState.longitude, onMapMove]
  );

  const handleMapLoad = useCallback<NonNullable<CustomMapProps['onLoad']>>(
    (e) => {
      setLoaded(true);
      onLoad?.(e);
    },
    [onLoad]
  );

  return (
    <div className={cx(className, 'relative z-0 h-screen w-full print:h-[90vh]')}>
      <ReactMapGL
        id={id}
        initialViewState={computedInitialViewState}
        dragPan={dragPan}
        dragRotate={dragRotate}
        scrollZoom={scrollZoom}
        doubleClickZoom={doubleClickZoom}
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

import { useCallback, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import {
  basemapAtom,
  URLboundsAtom,
  locationBoundsAtom,
  interactiveLayerIdsAtom,
  mapCursorAtom,
} from 'store/map';
import { basemapContextualAtom } from 'store/map-settings';
import { activeWidgetsAtom } from 'store/widgets';

import { useQueryClient } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import { isEmpty } from 'lodash-es';
import type { LngLatBoundsLike, MapboxGeoJSONFeature } from 'mapbox-gl';
import { MapboxProps } from 'react-map-gl/dist/esm/mapbox/mapbox';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useOnClickOutside } from 'usehooks-ts';

import { useScreenWidth } from 'hooks/media';

import BASEMAPS from 'containers/datasets/contextual-layers/basemaps';
import type { DataResponse as LocationResponse } from 'containers/datasets/locations/hooks';
import DeleteDrawingButton from 'containers/map/delete-drawing-button';
import Legend from 'containers/map/legend';
import RestorationPopup from 'containers/map/restoration-popup';

import Collapsible from 'components/collapsible';
import Map from 'components/map';
import Controls from 'components/map/controls';
import FullScreenControl from 'components/map/controls/fullscreen';
import PitchReset from 'components/map/controls/pitch-reset';
import ZoomControl from 'components/map/controls/zoom';
import type { DrawControlProps } from 'components/map/drawing-tool';
import DrawControl from 'components/map/drawing-tool';
import { CustomMapProps } from 'components/map/types';
import { Media } from 'components/media-query';
import Popup from 'components/popup';
import { breakpoints } from 'styles/styles.config';
import type { RestorationPopUp } from 'types/map';

import LayerManager from './layer-manager';

export const DEFAULT_PROPS = {
  initialViewState: {
    longitude: 0,
    latitude: 20,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  },
  minZoom: 1,
  maxZoom: 20,
};

const MapContainer = ({ mapId }: { mapId: string }) => {
  const mapRef = useRef(null);
  const basemap = useRecoilValue(basemapAtom);
  const interactiveLayerIds = useRecoilValue(interactiveLayerIdsAtom);

  const [
    {
      enabled: isDrawingToolEnabled,
      showWidget: isDrawingToolVisible,
      uploadedGeojson,
      customGeojson,
    },
    setDrawingToolState,
  ] = useRecoilState(drawingToolAtom);
  const [locationBounds, setLocationBounds] = useRecoilState(locationBoundsAtom);
  const [URLBounds, setURLBounds] = useRecoilState(URLboundsAtom);
  const [cursor, setCursor] = useRecoilState(mapCursorAtom);

  const [activeWidgets, setActiveWidgets] = useRecoilState(activeWidgetsAtom);
  const [, setAnalysisState] = useRecoilState(analysisAtom);

  const [restorationPopUp, setRestorationPopUp] = useState<{
    popup: number[];
    popupInfo: RestorationPopUp;
    popUpPosition: { x: number; y: number };
  }>({
    popup: [],
    popupInfo: null,
    popUpPosition: {
      x: null,
      y: null,
    },
  });

  const handleClickOutside = () => {
    removePopup();
  };

  useOnClickOutside(mapRef, handleClickOutside);

  const selectedBasemap = useMemo(() => BASEMAPS.find((b) => b.id === basemap).url, [basemap]);

  const { minZoom, maxZoom } = DEFAULT_PROPS;

  const screenWidth = useScreenWidth();

  const { [mapId]: map } = useMap();

  const {
    query: { params },
    push,
    asPath,
  } = useRouter();
  const locationId = params?.[1];
  const queryClient = useQueryClient();
  const queryParams = asPath.split('?')[1];

  const handleViewState = useCallback(() => {
    if (map) {
      setURLBounds(map.getBounds().toArray());
      setLocationBounds(null);
    }
  }, [map, setURLBounds, setLocationBounds]);

  const initialViewState: MapboxProps['initialViewState'] = useMemo(
    () => ({
      ...DEFAULT_PROPS.initialViewState,
      ...(URLBounds && { bounds: URLBounds as LngLatBoundsLike }),
      ...(!URLBounds &&
        locationId && {
          bounds: queryClient.getQueryData<typeof locationBounds>(['location-bounds']) || null,
        }),
    }),
    [URLBounds, locationId, queryClient]
  );

  const bounds = useMemo<CustomMapProps['bounds']>(() => {
    if (!locationBounds) return null;

    return {
      bbox: locationBounds,
      options: {
        padding: {
          top: 50,
          right: 20,
          bottom: 50,
          left: screenWidth >= breakpoints.lg ? 620 + 20 : 20,
        },
      },
    } satisfies CustomMapProps['bounds'];
  }, [locationBounds, screenWidth]);

  const handleCustomPolygon = useCallback(
    (customPolygon) => {
      const bbox = turfBbox(customPolygon);

      if (bbox) {
        setLocationBounds(bbox as typeof locationBounds);
      }
    },
    [setLocationBounds]
  );

  const handleUserDrawing = useCallback(
    (evt: Parameters<DrawControlProps['onCreate']>[0]) => {
      const customGeojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: evt.features,
      };
      setDrawingToolState((prevDrawingToolState) => ({
        ...prevDrawingToolState,
        customGeojson,
      }));

      setAnalysisState((prevAnalysisState) => ({
        ...prevAnalysisState,
        enabled: true,
      }));

      const bbox = turfBbox(customGeojson);

      if (bbox) {
        setLocationBounds(bbox as typeof locationBounds);
      }

      push(`/custom-area${queryParams ? `?${queryParams}` : ''}`, null);
    },
    [setDrawingToolState, setAnalysisState, push, setLocationBounds, queryParams]
  );

  const handleDrawingUpdate = useCallback(
    (evt: Parameters<DrawControlProps['onUpdate']>[0]) => {
      setDrawingToolState((prevDrawingToolState) => ({
        ...prevDrawingToolState,
        customGeojson: { type: 'FeatureCollection', features: evt.features },
      }));
    },
    [setDrawingToolState]
  );

  const removePopup = () => {
    setRestorationPopUp({
      popup: [],
      popupInfo: null,
      popUpPosition: {
        x: null,
        y: null,
      },
    });
  };

  const handleClickLocation = useCallback(
    (locationFeature: MapboxGeoJSONFeature) => {
      const locations = queryClient.getQueryData<LocationResponse>(['locations']);
      const {
        properties: { location_idn },
      } = locationFeature;

      const location = locations.data?.find((l) => l.location_id === location_idn);

      if (location) {
        const bbox = turfBbox(location.bounds);

        if (bbox) {
          setLocationBounds(bbox as typeof locationBounds);
        }

        push(`/country/${location.iso}/${queryParams ? `?${queryParams}` : ''}`, null);
      }
    },
    [queryClient, setLocationBounds, push, queryParams]
  );

  const onClickHandler = (e: Parameters<CustomMapProps['onClick']>[0]) => {
    const locationFeature = e?.features.find(
      ({ layer }) => layer.id === 'country-boundaries-layer'
    );

    const restorationFeature = e?.features.find(
      ({ layer }) => layer.id === 'mangrove_restoration-layer'
    );

    if (locationFeature && !restorationFeature) {
      handleClickLocation(locationFeature);
    }

    if (restorationFeature) {
      setRestorationPopUp({
        ...restorationPopUp,
        popup: [e?.lngLat.lat, e?.lngLat.lng],
        popupInfo: restorationFeature.properties as RestorationPopUp,
        popUpPosition: {
          x: e.point.x,
          y: e.point.y,
        },
      });
    }
    if (!restorationFeature) {
      removePopup();
    }
  };

  const handleMouseMove = useCallback(
    (evt: Parameters<CustomMapProps['onMouseMove']>[0]) => {
      if (!isDrawingToolVisible) {
        setCursor(evt.features?.length ? 'pointer' : 'grab');
      }
    },
    [setCursor, isDrawingToolVisible]
  );

  return (
    <div
      className="print:page-break-after print:page-break-inside-avoid absolute top-0 left-0 z-0 h-screen w-screen print:relative print:h-[90vh] print:w-screen"
      ref={mapRef}
    >
      <Map
        id={mapId}
        mapStyle={selectedBasemap}
        minZoom={minZoom}
        maxZoom={maxZoom}
        initialViewState={initialViewState}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMapViewStateChange={handleViewState}
        bounds={bounds}
        interactiveLayerIds={isDrawingToolEnabled ? [] : interactiveLayerIds}
        onClick={onClickHandler}
        onMouseMove={handleMouseMove}
        cursor={cursor}
        preserveDrawingBuffer
      >
        {() => (
          <>
            <LayerManager />
            {(isDrawingToolEnabled || uploadedGeojson) && (
              <DrawControl
                onCreate={handleUserDrawing}
                onUpdate={handleDrawingUpdate}
                customPolygon={uploadedGeojson}
                onSetCustomPolygon={handleCustomPolygon}
              />
            )}
            <Controls
              className={cn({
                'absolute top-36 right-6 print:hidden': true,
                'right-10 top-18': screenWidth >= breakpoints.md,
              })}
            >
              <FullScreenControl />
              <ZoomControl mapId={mapId} />
              <PitchReset mapId={mapId} />
            </Controls>
            {!!restorationPopUp?.popup?.length && !isEmpty(restorationPopUp?.popupInfo) ? (
              <Popup
                popUpPosition={restorationPopUp.popUpPosition}
                longitude={restorationPopUp.popup[1]}
                latitude={restorationPopUp.popup[0]}
                onClose={removePopup}
              >
                <RestorationPopup restorationPopUpInfo={restorationPopUp} />
              </Popup>
            ) : null}
          </>
        )}
      </Map>
      <Media lessThan="md">
        <div className="absolute top-20 left-0 z-[80] print:hidden">
          <Collapsible layers={activeWidgets} setActiveWidgets={setActiveWidgets} />
        </div>
      </Media>
      <Media greaterThanOrEqual="md">
        <div className="absolute bottom-10 right-10 space-y-1 print:hidden">
          {(customGeojson || uploadedGeojson) && <DeleteDrawingButton />}
          <Legend layers={activeWidgets} setActiveWidgets={setActiveWidgets} />
        </div>
      </Media>
    </div>
  );
};

export default MapContainer;
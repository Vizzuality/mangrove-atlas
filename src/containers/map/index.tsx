import { useCallback, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';
import { orderByAttribute } from 'lib/utils';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { activeLayersAtom } from 'store/layers';
import {
  basemapAtom,
  URLboundsAtom,
  locationBoundsAtom,
  interactiveLayerIdsAtom,
  mapCursorAtom,
} from 'store/map';

import { useQueryClient } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import { isEmpty } from 'lodash-es';
import type { LngLatBoundsLike, MapboxGeoJSONFeature } from 'mapbox-gl';
import { MapboxProps } from 'react-map-gl/dist/esm/mapbox/mapbox';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useOnClickOutside } from 'usehooks-ts';

import { useScreenWidth } from 'hooks/media';

import BASEMAPS from 'containers/datasets/contextual-layers/basemaps';
import type { IUCNEcoregionPopUpInfo } from 'containers/datasets/iucn-ecoregion/types';
import Helper from 'containers/guide/helper';
import { LAYERS_ORDER } from 'containers/layers/constants';
import DeleteDrawingButton from 'containers/map/delete-drawing-button';
import IucnEcoregionPopup from 'containers/map/iucn-ecoregion-popup';
import Legend from 'containers/map/legend';
import RestorationPopup from 'containers/map/restoration-popup';

import Collapsible from 'components/collapsible';
import Map from 'components/map';
import Controls from 'components/map/controls';
import BasemapSettingsControl from 'components/map/controls/basemap-settings';
import FullScreenControl from 'components/map/controls/fullscreen';
import PitchReset from 'components/map/controls/pitch-reset';
import ShareControl from 'components/map/controls/share';
import ZoomControl from 'components/map/controls/zoom';
import type { DrawControlProps } from 'components/map/drawing-tool';
import DrawControl from 'components/map/drawing-tool';
import { CustomMapProps } from 'components/map/types';
import { Media } from 'components/media-query';
import Popup from 'components/popup';
import { breakpoints } from 'styles/styles.config';
import type { RestorationPopUp, PopUpKey, LocationPopUp } from 'types/map';
import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

import LayerManager from './layer-manager';
import LocationPopup from './location-pop-up';

type NationalDashboardLayer = `mangrove_national_dashboard${string}`;
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
  const [loaded, setLoaded] = useState(false);

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

  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const [, setAnalysisState] = useRecoilState(analysisAtom);

  const nationalDashboardLayers = activeLayers.filter((l) =>
    l?.id?.includes('mangrove_national_dashboard')
  );
  const ordered = orderByAttribute(LAYERS_ORDER, activeLayers);

  const activeOrdered = [...nationalDashboardLayers, ...ordered] as (WidgetSlugType &
    ContextualBasemapsId &
    'custom-area' &
    NationalDashboardLayer)[];

  const [locationPopUp, setLocationPopUp] = useState<{
    info: LocationPopUp;
    feature: MapboxGeoJSONFeature;
  }>({
    info: null,
    feature: null,
  });

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

  const [iucnEcoregionPopUp, setIucnEcoregionPopUp] = useState<{
    popup: number[];
    popupInfo: IUCNEcoregionPopUpInfo;
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

  const removePopup = (key?: PopUpKey) => {
    if (!key || key === 'restoration')
      setRestorationPopUp({
        popup: [],
        popupInfo: null,
        popUpPosition: {
          x: null,
          y: null,
        },
      });
    if (!key || key === 'ecoregion')
      setIucnEcoregionPopUp({
        popup: [],
        popupInfo: null,
        popUpPosition: {
          x: null,
          y: null,
        },
      });
  };

  const onClickHandler = (e: Parameters<CustomMapProps['onClick']>[0]) => {
    const locationFeature = e?.features.find(
      ({ layer }) => layer.id === 'country-boundaries-layer'
    );

    const restorationFeature = e?.features.find(
      ({ layer }) => layer.id === 'mangrove_restoration-layer'
    );

    const iucnEcoregionFeature = e?.features.find(
      ({ layer }) => layer.id === 'mangrove-iucn-ecoregion-layer'
    );

    if (locationFeature) {
      setLocationPopUp({
        ...locationPopUp,
        info: locationFeature.properties as LocationPopUp,
        feature: locationFeature,
      });
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
      removePopup('restoration');
    }

    if (iucnEcoregionFeature)
      setIucnEcoregionPopUp({
        popup: [e?.lngLat.lat, e?.lngLat.lng],
        popupInfo: iucnEcoregionFeature.properties as IUCNEcoregionPopUpInfo,
        popUpPosition: {
          x: e.point.x,
          y: e.point.y,
        },
      });
    if (!iucnEcoregionFeature) removePopup('ecoregion');
  };

  let hoveredStateId = null;
  const handleMouseMove = useCallback(
    (evt: Parameters<CustomMapProps['onMouseMove']>[0]) => {
      if (!isDrawingToolVisible) {
        setCursor(evt.features?.length ? 'pointer' : 'grab');
      }

      const restorationData = evt?.features.find(
        ({ layer }) => layer.id === 'mangrove_restoration-layer'
      );

      // *ON MOUSE ENTER
      if (restorationData && map) {
        if (hoveredStateId !== null) {
          map?.setFeatureState(
            {
              sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
              source: 'jsx-source-0',
              id: hoveredStateId,
            },
            { hover: false }
          );
        }

        hoveredStateId = restorationData?.id;
        map?.setFeatureState(
          {
            sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
            source: 'jsx-source-0',
            id: hoveredStateId,
          },
          { hover: true }
        );
      }

      // *ON MOUSE LEAVE
      if (!restorationData && loaded) {
        map?.setFeatureState(
          {
            sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
            source: 'jsx-source-0',
            id: hoveredStateId,
          },
          { hover: false }
        );
        hoveredStateId = null;
      }
    },
    [setCursor, isDrawingToolVisible, map]
  );

  const handleMapLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className="print:page-break-after print:page-break-inside-avoid absolute top-0 left-0 z-0 h-screen w-screen print:relative print:h-[90vh] print:w-screen"
      ref={mapRef}
    >
      <Map
        id={mapId}
        reuseMaps
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
        onLoad={handleMapLoad}
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
                'absolute bottom-6 right-6 items-center print:hidden': true,
                'right-6 bottom-11': screenWidth >= breakpoints.md,
              })}
            >
              <Helper
                className={{
                  button: 'top-1 left-8 z-[20]',
                  tooltip: 'w-fit-content',
                }}
                tooltipPosition={{ top: -4, left: 250 }}
                message="use these buttons to go full-screen, share link, configure basemap, zoom in/out or reset the bearing"
              >
                <div className="flex flex-col space-y-2 pt-1">
                  <FullScreenControl />
                  <ShareControl />
                  <BasemapSettingsControl />
                  <div className="border-box flex flex-col rounded-full border shadow-control">
                    <ZoomControl mapId={mapId} />
                    <PitchReset mapId={mapId} />
                  </div>
                </div>
              </Helper>
            </Controls>

            <Popup
              popUpPosition={iucnEcoregionPopUp.popUpPosition || restorationPopUp.popUpPosition}
              popUpWidth={iucnEcoregionPopUp.popUpPosition ? 500 : 400}
              longitude={iucnEcoregionPopUp.popup[1] || restorationPopUp.popup[1]}
              latitude={iucnEcoregionPopUp.popup[0] || restorationPopUp.popup[0]}
              onClose={() => removePopup('ecoregion')} // removePopup('restoration')
            >
              {!isEmpty(locationPopUp?.info) ? (
                <LocationPopup locationPopUpInfo={locationPopUp} />
              ) : null}
              {!!restorationPopUp?.popup?.length && !isEmpty(restorationPopUp?.popupInfo) ? (
                <RestorationPopup restorationPopUpInfo={restorationPopUp} />
              ) : null}

              {/* {activeLayers.map((l) => {
                const PopUp = MAP_POP_UPS[l.id] as ElementType;
                return PopUp && <PopUp key={l.id} />;
              })} */}

              {!!iucnEcoregionPopUp.popup?.length && !isEmpty(iucnEcoregionPopUp?.popupInfo) ? (
                <IucnEcoregionPopup info={iucnEcoregionPopUp.popupInfo} />
              ) : null}
            </Popup>
          </>
        )}
      </Map>
      <Media lessThan="md">
        <div className="absolute top-20 left-0 z-[80]">
          <Collapsible layers={activeOrdered} setActiveLayers={setActiveLayers} />
        </div>
      </Media>
      <Media greaterThanOrEqual="md">
        <div className="absolute bottom-11 right-20 space-y-1 print:hidden">
          {(customGeojson || uploadedGeojson) && <DeleteDrawingButton />}
          <Legend />
        </div>
      </Media>
    </div>
  );
};

export default MapContainer;

import { useCallback, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { activeGuideAtom } from 'store/guide';
import {
  basemapAtom,
  URLboundsAtom,
  locationBoundsAtom,
  interactiveLayerIdsAtom,
  mapCursorAtom,
} from 'store/map';
import { printModeState } from 'store/print-mode';

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
import DeleteDrawingButton from 'containers/map/delete-drawing-button';
import IucnEcoregionPopup from 'containers/map/iucn-ecoregion-popup';
import Legend from 'containers/map/legend';
import MobileLegend from 'containers/map/mobile/legend';
import RestorationPopup from 'containers/map/restoration-popup';

import Map from 'components/map';
import Controls from 'components/map/controls';
import BasemapSettingsControl from 'components/map/controls/basemap-settings';
import FullScreenControl from 'components/map/controls/fullscreen';
import PitchReset from 'components/map/controls/pitch-reset';
import ShareControl from 'components/map/controls/share';
import ZoomControl from 'components/map/controls/zoom';
import DrawControl from 'components/map/drawing-tool';
import { CustomMapProps } from 'components/map/types';
import { Media } from 'components/media-query';
import Popup from 'components/popup';
import { breakpoints } from 'styles/styles.config';
import type { RestorationPopUp, PopUpKey, LocationPopUp } from 'types/map';

import LayerManager from './layer-manager';
import LocationPopup from './location-pop-up';

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
  const [{ enabled: isDrawingToolEnabled, customGeojson }, setDrawingToolState] =
    useRecoilState(drawingToolAtom);
  const { enabled: isUploadToolEnabled, uploadedGeojson } = useRecoilValue(drawingUploadToolAtom);
  const [locationBounds, setLocationBounds] = useRecoilState(locationBoundsAtom);
  const [URLBounds, setURLBounds] = useRecoilState(URLboundsAtom);
  const [cursor, setCursor] = useRecoilState(mapCursorAtom);
  const isPrintingMode = useRecoilValue(printModeState);

  const [, setAnalysisState] = useRecoilState(analysisAtom);
  const guideIsActive = useRecoilValue(activeGuideAtom);

  const [locationPopUp, setLocationPopUp] = useState<{
    position: { x: number; y: number };
    info: LocationPopUp;
    feature: MapboxGeoJSONFeature;
    popup: number[];
  }>({
    position: {
      x: null,
      y: null,
    },
    popup: [null, null],
    info: null,
    feature: null,
  });

  const [restorationPopUp, setRestorationPopUp] = useState<{
    popupInfo: RestorationPopUp;
  }>({
    popupInfo: null,
  });

  const [iucnEcoregionPopUp, setIucnEcoregionPopUp] = useState<{
    popupInfo: IUCNEcoregionPopUpInfo;
  }>({
    popupInfo: null,
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
    (evt: { features: GeoJSON.Feature[]; action: 'onCreate' }) => {
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
    (evt: { features: GeoJSON.Feature[]; action: 'onUpdate' }) => {
      setDrawingToolState((prevDrawingToolState) => ({
        ...prevDrawingToolState,
        customGeojson: { type: 'FeatureCollection', features: evt.features },
      }));
    },
    [setDrawingToolState]
  );

  const removePopup = (key?: PopUpKey) => {
    if (!key || key === 'restoration') setRestorationPopUp({ popupInfo: null });
    if (!key || key === 'ecoregion') setIucnEcoregionPopUp({ popupInfo: null });
    if (!key || key === 'location') setLocationPopUp({ ...locationPopUp, info: null });
  };

  const onClickHandler = (e: Parameters<CustomMapProps['onClick']>[0]) => {
    const locationFeature = e?.features.find(
      ({ layer }) => layer.id === 'country-boundaries-layer'
    );

    const protectedAreaFeature = e?.features.find(
      ({ layer }) => layer.id === 'mangrove_protected_areas'
    );

    const restorationFeature = e?.features.find(
      ({ layer }) => layer.id === 'mangrove_restoration-layer'
    );

    const iucnEcoregionFeature = e?.features.find(
      ({ layer }) => layer.id === 'mangrove_iucn_ecoregion-layer'
    );

    if (locationFeature) {
      setLocationPopUp({
        ...locationPopUp,
        info: {
          location: locationFeature.properties,
          ...(protectedAreaFeature && {
            protectedArea: {
              ...(protectedAreaFeature?.properties as LocationPopUp['protectedArea']),
              id: locationId,
            },
          }),
        } as LocationPopUp,
        feature: locationFeature,
        popup: [e?.lngLat.lat, e?.lngLat.lng],
        position: {
          x: e.point.x,
          y: e.point.y,
        },
      });
    }

    if (!locationFeature) removePopup('location');

    if (restorationFeature) {
      setRestorationPopUp({
        ...restorationPopUp,
        popupInfo: restorationFeature.properties as RestorationPopUp,
      });
    }
    if (!restorationFeature) {
      removePopup('restoration');
    }

    if (iucnEcoregionFeature)
      setIucnEcoregionPopUp({
        popupInfo: iucnEcoregionFeature.properties as IUCNEcoregionPopUpInfo,
      });
    if (!iucnEcoregionFeature) removePopup('ecoregion');
  };

  let hoveredStateId = null;
  const handleMouseMove = useCallback(
    (evt: Parameters<CustomMapProps['onMouseMove']>[0]) => {
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
    [setCursor, map]
  );

  const handleMapLoad = useCallback(() => {
    setLoaded(true);
  }, []);
  const pitch = map?.getPitch();
  return (
    <div
      className="print:page-break-after print:page-break-inside-avoid absolute top-0 left-0 z-0 h-screen w-screen print:relative print:top-4 print:w-[90vw]"
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
        interactiveLayerIds={isDrawingToolEnabled || guideIsActive ? [] : interactiveLayerIds}
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
            <Controls className="absolute bottom-9 right-6 hidden items-center print:hidden md:block">
              <Helper
                className={{
                  button: 'top-1 left-8 z-[20]',
                  tooltip: 'w-fit-content',
                }}
                tooltipPosition={{ top: 90, left: 250 }}
                message="use these buttons to go full-screen, share link, configure basemap, zoom in/out or reset the bearing"
              >
                <div className="flex flex-col space-y-2 pt-1">
                  {(customGeojson || uploadedGeojson) && <DeleteDrawingButton />}
                  <FullScreenControl />
                  {/* Disable the sharing tool in any of the painting states */}
                  {!isDrawingToolEnabled &&
                    !isUploadToolEnabled &&
                    !customGeojson &&
                    !uploadedGeojson && <ShareControl />}
                  <BasemapSettingsControl />
                  <div className="border-box flex flex-col overflow-hidden rounded-4xl bg-white shadow-control">
                    <ZoomControl mapId={mapId} />
                    {pitch !== 0 && <PitchReset mapId={mapId} />}
                  </div>
                </div>
              </Helper>
            </Controls>

            {locationPopUp.info && !guideIsActive && (
              <Popup
                popUpPosition={locationPopUp?.position}
                popUpWidth={500}
                longitude={locationPopUp?.popup[1]}
                latitude={locationPopUp?.popup[0]}
                onClose={() => removePopup('location')}
              >
                {!isEmpty(locationPopUp?.info) ? (
                  <LocationPopup
                    locationPopUpInfo={locationPopUp}
                    className={cn({
                      '!w-[360px] rounded-3xl pt-6':
                        isEmpty(iucnEcoregionPopUp?.popupInfo) &&
                        isEmpty(restorationPopUp?.popupInfo),
                    })}
                    onClose={() => removePopup('location')}
                    nonExpansible={
                      isEmpty(iucnEcoregionPopUp?.popupInfo) && isEmpty(restorationPopUp?.popupInfo)
                    }
                    onClose={() => removePopup('location')}
                  />
                ) : null}
                {!isEmpty(restorationPopUp?.popupInfo) ? (
                  <RestorationPopup
                    restorationPopUpInfo={restorationPopUp}
                    className="rounded-3xl"
                  />
                ) : null}

                {!isEmpty(iucnEcoregionPopUp?.popupInfo) ? (
                  <IucnEcoregionPopup info={iucnEcoregionPopUp.popupInfo} />
                ) : null}
              </Popup>
            )}
          </>
        )}
      </Map>
      {!isPrintingMode && (
        <>
          <Media lessThan="md">
            <div className="absolute top-20">
              <MobileLegend />
            </div>
          </Media>
          <Media greaterThanOrEqual="md">
            <div className="absolute bottom-9 right-18 z-50 mr-0.5">
              <Legend />
            </div>
          </Media>
        </>
      )}
    </div>
  );
};

export default MapContainer;

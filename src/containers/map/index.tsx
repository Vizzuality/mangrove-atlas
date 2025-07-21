import { useCallback, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { activeGuideAtom } from 'store/guide';
import {
  basemapAtom,
  interactiveLayerIdsAtom,
  locationBoundsAtom,
  mapCursorAtom,
  URLboundsAtom,
} from 'store/map';
import { printModeState } from 'store/print-mode';

import { useQueryClient } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import { isEmpty } from 'lodash-es';
import type { LngLatBoundsLike, MapboxGeoJSONFeature } from 'mapbox-gl';
import { MapboxProps } from 'react-map-gl/dist/esm/mapbox/mapbox';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useOnClickOutside } from 'usehooks-ts';

import { useScreenWidth } from 'hooks/media';

import BASEMAPS from 'containers/datasets/contextual-layers/basemaps';
// POPUPS
import IucnEcoregionPopup from 'containers/datasets/iucn-ecoregion/map-popup';
import type { IUCNEcoregionPopUpInfo } from 'containers/datasets/iucn-ecoregion/types';
import LocationPopup from 'containers/datasets/locations/map-popup';
import RestorationSitesPopup from 'containers/datasets/restoration-sites/map-popup';
import RestorationPopup from 'containers/datasets/restoration/map-popup';
import Helper from 'containers/help/helper';
import DeleteDrawingButton from 'containers/map/delete-drawing-button';
import Legend from 'containers/map/legend';
import MobileLegend from 'containers/map/legend/mobile';

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
import Popup from 'components/ui/popup';
import { breakpoints } from 'styles/styles.config';
import type { LocationPopUp, PopUpKey, RestorationPopUp, RestorationSitesPopUp } from 'types/map';

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

  const [restorationPopUp, setRestorationPopUpInfo] = useState<{
    info: RestorationPopUp;
  }>({
    info: null,
  });

  const [restorationSitesPopUp, setRestorationSitesPopUp] = useState<{
    info: RestorationSitesPopUp;
  }>({
    info: null,
  });

  const [iucnEcoregionPopUp, setIucnEcoregionPopUp] = useState<{
    info: IUCNEcoregionPopUpInfo;
  }>({
    info: null,
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

      void push(`/custom-area${queryParams ? `?${queryParams}` : ''}`, null);
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
    if (!key || key === 'restoration') setRestorationPopUpInfo({ info: null });
    if (!key || key === 'ecoregion') setIucnEcoregionPopUp({ info: null });
    if (!key || key === 'location') setLocationPopUp({ ...locationPopUp, info: null });
    if (!key || key.includes('mangrove_rest_sites')) setRestorationSitesPopUp({ info: null });
  };

  const onClickHandler = (e: Parameters<CustomMapProps['onClick']>[0]) => {
    const locationFeature = e?.features.find(
      ({ layer }) => layer.id === 'country-boundaries-layer'
    );

    const protectedAreaFeature = e?.features.filter(
      ({ layer }) => layer.id === 'mangrove_protected_areas'
    );

    const restorationFeature = e?.features.find(({ layer }) => {
      return layer.id === 'mangrove_restoration-layer';
    });
    const restorationSitesFeature = e?.features.find(({ layer }) =>
      layer.id.includes('mangrove_rest_sites')
    );

    const iucnEcoregionFeature = e?.features.find(
      ({ layer }) => layer.id === 'mangrove_iucn_ecoregion-layer'
    );

    if (locationFeature) {
      const protectedAreas = protectedAreaFeature.map((feature) => ({
        ...feature.properties,
        id: locationId,
      }));

      setLocationPopUp({
        info: {
          location: locationFeature.properties,
          protectedArea: protectedAreas, // Now an array of ProtectedArea objects
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

    // Restoration Potential
    if (restorationFeature) {
      setRestorationPopUpInfo({
        ...restorationPopUp,
        info: restorationFeature.properties as RestorationPopUp,
      });
    }
    if (!restorationFeature) {
      removePopup('restoration');
    }

    // Restoration Sites
    if (restorationSitesFeature) {
      setRestorationSitesPopUp({
        ...restorationSitesPopUp,
        info: restorationSitesFeature.properties as RestorationSitesPopUp,
      });
    }
    if (!restorationSitesFeature) {
      removePopup('mangrove_rest_sites');
    }

    // IUCN Ecoregions
    if (iucnEcoregionFeature)
      setIucnEcoregionPopUp({
        info: iucnEcoregionFeature.properties as IUCNEcoregionPopUpInfo,
      });
    if (!iucnEcoregionFeature) removePopup('ecoregion');
  };

  let hoveredStateId = null;

  const handleMouseMove = useCallback(
    (evt: Parameters<CustomMapProps['onMouseMove']>[0]) => {
      const restorationData = evt?.features.find(({ layer }) => {
        return layer.id === 'mangrove_restoration-layer';
      });
      const interactiveLayers = evt?.features.find(
        ({ layer }) =>
          layer.id === 'country-boundaries-layer' ||
          layer.id === 'mangrove_protected_areas' ||
          layer.id === 'mangrove_iucn_ecoregion-layer' ||
          layer.id === 'mangrove_restoration-layer'
      );

      // *ON MOUSE ENTER
      if (restorationData && map) {
        if (hoveredStateId !== null) {
          map?.setFeatureState(
            {
              sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
              source: 'mangrove_restoration',
              id: hoveredStateId,
            },
            { hover: false }
          );
        }

        hoveredStateId = restorationData?.id;
        map?.setFeatureState(
          {
            sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
            source: 'mangrove_restoration',
            id: hoveredStateId,
          },
          { hover: true }
        );
      }

      // *ON MOUSE LEAVE

      if (!restorationData && loaded && hoveredStateId) {
        map?.setFeatureState(
          {
            sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
            source: 'mangrove_restoration',
            id: hoveredStateId,
          },
          { hover: false }
        );
        hoveredStateId = null;
      }
      if (isDrawingToolEnabled && !customGeojson) {
        setCursor('cell');
      } else if (interactiveLayers || restorationData) {
        setCursor('pointer');
      } else setCursor('grab');
    },
    [cursor, map, isDrawingToolEnabled, customGeojson]
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
            <Controls className="absolute bottom-9 right-5 hidden items-center print:hidden md:block">
              <div className="flex flex-col space-y-2 pt-1">
                {(customGeojson || uploadedGeojson) && <DeleteDrawingButton />}
                <Helper
                  className={{
                    button: 'top-1 left-8 z-[20]',
                    tooltip: 'w-80',
                  }}
                  tooltipPosition={{ top: 0, left: 330 }}
                  message="Use this icon to show the map in full screen. Widgets and other menu items will be hidden until the icon is clicked again. "
                >
                  <FullScreenControl />
                </Helper>
                <Helper
                  className={{
                    button: 'top-1 left-8 z-[20]',
                    tooltip: 'w-80',
                  }}
                  tooltipPosition={{ top: 0, left: 330 }}
                  message="Use this function to generate a link to a user-customized map on GMW or to embed a customized map into another website."
                >
                  <ShareControl
                    disabled={
                      isDrawingToolEnabled ||
                      isUploadToolEnabled ||
                      !!customGeojson ||
                      !!uploadedGeojson
                    }
                  />
                </Helper>
                <Helper
                  className={{
                    button: 'top-1 left-8 z-[20]',
                    tooltip: 'w-80',
                  }}
                  tooltipPosition={{ top: 0, left: 330 }}
                  message="Select this icon to choose from a variety of basemaps, enable visualization of the high-resolution mangrove extent, or to select high resolution imagery from Planet."
                >
                  <BasemapSettingsControl />
                </Helper>
                <Helper
                  className={{
                    button: 'top-1 left-8 z-[20]',
                    tooltip: 'w-80',
                  }}
                  tooltipPosition={{ top: 0, left: 330 }}
                  message="Use the + icon to zoom into the map and the – button to zoom out of the map"
                >
                  <div className="border-box flex flex-col overflow-hidden rounded-4xl shadow-control">
                    <ZoomControl mapId={mapId} />
                    {pitch !== 0 && <PitchReset mapId={mapId} />}
                  </div>
                </Helper>
              </div>
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
                      'rounded-3xl pt-6':
                        isEmpty(iucnEcoregionPopUp?.info) && isEmpty(restorationPopUp?.info),
                    })}
                    nonExpansible={
                      isEmpty(iucnEcoregionPopUp?.info) && isEmpty(restorationPopUp?.info)
                    }
                    onClose={() => removePopup('location')}
                  />
                ) : null}
                {!isEmpty(restorationPopUp?.info) ? (
                  <RestorationPopup {...restorationPopUp} />
                ) : null}

                {!isEmpty(restorationSitesPopUp?.info) ? (
                  <RestorationSitesPopup {...restorationSitesPopUp} />
                ) : null}

                {!isEmpty(iucnEcoregionPopUp?.info) ? (
                  <IucnEcoregionPopup info={iucnEcoregionPopUp.info} />
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

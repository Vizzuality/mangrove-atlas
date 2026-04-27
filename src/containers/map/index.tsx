'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Map, Marker, useMap, type MapProps } from 'react-map-gl';

import Image from 'next/image';

import { flyMapTo, registerMapRef } from '@/lib/map-fly';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { activeGuideAtom } from '@/store/guide';
import {
  interactiveLayerIdsAtom,
  mapCursorAtom,
  coordinatesAtom,
  mapDraggableTooltipDimensionsAtom,
  mapDraggableTooltipPositionAtom,
  tmpCameraAtom,
  useSyncBasemap,
  useSyncURLBounds,
} from '@/store/map';

import { useQueryClient } from '@tanstack/react-query';
import turfBbox from '@turf/bbox';
import { useAtom, useAtomValue } from 'jotai';
import type { GeoJSONFeature, LngLatBoundsLike } from 'mapbox-gl';
import { useOnClickOutside } from 'usehooks-ts';

import { useLocationNavigation } from 'hooks/location-navigation';
import { useSyncLocation } from 'hooks/use-sync-location';

import BASEMAPS from '@/containers/datasets/contextual-layers/basemaps';
// POPUPS
import type { IUCNEcoregionPopUpInfo } from '@/containers/datasets/iucn-ecoregion/types';
import { LABELS } from '@/containers/datasets/restoration-sites/constants';
import Helper from '@/containers/help/helper';
import DeleteDrawingButton from '@/containers/map/delete-drawing-button';
import Legend from '@/containers/map/legend';
import MobileLegend from '@/containers/map/legend/mobile';

import Controls from '@/components/map/controls';
import BasemapSettingsControl from '@/components/map/controls/basemap-settings';
import FullScreenControl from '@/components/map/controls/fullscreen';
import PitchReset from '@/components/map/controls/pitch-reset';
import ShareControl from '@/components/map/controls/share';
import ZoomControl from '@/components/map/controls/zoom';
import DrawControl from '@/components/map/drawing-tool';
import { Media } from '@/components/media-query';
import type { LocationPopUp, PopUpKey, RestorationPopUp, RestorationSitesPopUp } from 'types/map';

import LayerManager from './layer-manager';
import MapPopup from './pop-up';

export const MAP_DEFAULT_PROPS = {
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

const MapContainer = ({ mapId, hideControls }: { mapId: string; hideControls?: boolean }) => {
  const [position, setPosition] = useAtom(mapDraggableTooltipPositionAtom);
  const mapPopUpDimensions = useAtomValue(mapDraggableTooltipDimensionsAtom);

  const [coordinates, setCoordinates] = useAtom(coordinatesAtom);
  const mapRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const [basemap] = useSyncBasemap();
  const interactiveLayerIds = useAtomValue(interactiveLayerIdsAtom);

  const [{ enabled: isDrawingToolEnabled, customGeojson }, setDrawingToolState] =
    useAtom(drawingToolAtom);
  const { enabled: isUploadToolEnabled, uploadedGeojson } = useAtomValue(drawingUploadToolAtom);
  const [URLBounds, setURLBounds] = useSyncURLBounds();
  const [cursor, setCursor] = useAtom(mapCursorAtom);
  const [tmpCamera, setTmpCamera] = useAtom(tmpCameraAtom);
  const { navigate } = useLocationNavigation();

  const [, setAnalysisState] = useAtom(analysisAtom);
  const guideIsActive = useAtomValue(activeGuideAtom);
  const [locationPopUp, setLocationPopUp] = useState<{
    position: { x: number | null; y: number | null };
    info: LocationPopUp | null;
    feature: GeoJSONFeature | null;
    popup: number[] | [null, null];
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
    info: RestorationPopUp | null;
  }>({
    info: null,
  });

  const [restorationSitesPopUp, setRestorationSitesPopUp] = useState<{
    info: RestorationSitesPopUp | null;
  }>({
    info: null,
  });

  const [iucnEcoregionPopUp, setIucnEcoregionPopUp] = useState<{
    info: IUCNEcoregionPopUpInfo | null;
  }>({
    info: null,
  });

  const handleClickOutside = () => {
    removePopup();
  };

  useOnClickOutside(mapRef, handleClickOutside);

  const selectedBasemap = useMemo(() => BASEMAPS.find((b) => b.id === basemap)?.url, [basemap]);

  const { minZoom, maxZoom } = MAP_DEFAULT_PROPS;

  const { [mapId]: map } = useMap();

  const { id: locationId } = useSyncLocation();
  const queryClient = useQueryClient();

  // Register map ref for imperative flyMapTo calls (no effect-based fitBounds)
  useEffect(() => {
    registerMapRef(map ?? null);
    return () => registerMapRef(null);
  }, [map]);

  // tmpCamera consumer: single place that programmatically moves the map.
  // Initial position comes from Map's `initialViewState`/`defaultBbox`, so no
  // init-time fly is needed — tmpCamera only fires on explicit nav writes.
  // One-shot — atom is cleared once the map settles (see handleMapMove).
  useEffect(() => {
    if (!map || !tmpCamera) return;
    if ('worldwide' in tmpCamera) {
      map.flyTo({ center: [0, 20], zoom: 2 });
    } else {
      flyMapTo(tmpCamera.bbox);
    }
  }, [map, tmpCamera]);

  const handleMoveEnd = useCallback(() => {
    if (map) setURLBounds(map.getBounds().toArray());
    setTmpCamera(null);
  }, [map, setURLBounds, setTmpCamera]);

  const clickedStateIdRef = useRef<string | number | null>(null);

  const hoveredStateIdRef = useRef<string | number | undefined | null>(null);

  // Initial camera — captured once on mount. Prefer URL bounds (shareable);
  // otherwise fall back to the location's prefetched bounds so a click-nav +
  // reload still frames the right place.
  const initialViewState = useMemo(
    () => {
      const bounds =
        (URLBounds as number[][] | null) ??
        (locationId ? (queryClient.getQueryData<number[][]>(['location-bounds']) ?? null) : null);
      if (bounds) {
        return {
          ...MAP_DEFAULT_PROPS.initialViewState,
          bounds: bounds as LngLatBoundsLike,
          fitBoundsOptions: { padding: { top: 50, bottom: 50, left: 50, right: 50 } },
        };
      }
      return MAP_DEFAULT_PROPS.initialViewState;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!position && map && loaded && map.getSource('mangrove_restoration')) {
      map.removeFeatureState({
        sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
        source: 'mangrove_restoration',
        id: clickedStateIdRef.current || '',
      });
    }
  }, [position, map, loaded]);

  // Methods
  const handleCustomPolygon = useCallback((customPolygon) => {
    const bbox = turfBbox(customPolygon);
    if (bbox) {
      flyMapTo(bbox as [number, number, number, number]);
    }
  }, []);

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

      const bbox = turfBbox(customGeojson) as [number, number, number, number] | null;
      if (bbox) queryClient.setQueryData(['location-bounds'], bbox);

      navigate({ type: 'custom-area' }, bbox);
    },
    [setDrawingToolState, setAnalysisState, navigate, queryClient]
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

  const removePopup = useCallback(
    (key?: PopUpKey) => {
      const removeAll = !key;

      if (removeAll || key === 'restoration') {
        setRestorationPopUpInfo({ info: null });
      }

      if (removeAll || key === 'ecoregion') {
        setIucnEcoregionPopUp({ info: null });
      }

      if (removeAll || key === 'location') {
        setLocationPopUp({
          info: null,
          feature: null,
          popup: [null, null],
          position: { x: null, y: null },
        });
      }

      if (removeAll || key?.includes('mangrove_rest_sites')) {
        setRestorationSitesPopUp({ info: null });
      }
    },
    [setRestorationPopUpInfo, setIucnEcoregionPopUp, setLocationPopUp, setRestorationSitesPopUp]
  );

  const onClickHandler: NonNullable<MapProps['onClick']> = (
    // @ts-ignore
    e: Parameters<NonNullable<MapProps['onClick']>>[0]
  ) => {
    const locationFeature = e?.features?.find(
      ({ layer }) => layer.id === 'country-boundaries-layer'
    );

    const protectedAreaFeature = e?.features?.filter(
      ({ layer }) => layer.id === 'mangrove_protected_areas'
    );

    const restorationFeature = e?.features?.find(({ layer }) => {
      return layer.id === 'mangrove_restoration-layer';
    });

    const restorationSitesFeature = e?.features?.find(({ layer }) =>
      layer.id.includes('mangrove_rest_sites')
    );

    const iucnEcoregionFeature = e?.features?.find(
      ({ layer }) => layer.id === 'mangrove_iucn_ecoregion-layer'
    );

    const { h, w } = mapPopUpDimensions || { h: 0, w: 0 };
    const x = Math.max(0, Math.min(e.point.x, window.innerWidth - w));
    const y = Math.max(0, Math.min(e.point.y, window.innerHeight - h));

    setPosition({ x, y });
    if (locationFeature) {
      const protectedAreas = protectedAreaFeature?.map((feature) => ({
        ...feature.properties,
        id: locationId,
      }));

      if (map && e?.lngLat) {
        const point = map?.project([e?.lngLat?.lng, e?.lngLat?.lat]);

        point.y += 15;

        setCoordinates(e?.lngLat);
      }

      setLocationPopUp({
        info: {
          location: locationFeature.properties,
          protectedArea: protectedAreas, // Now an array of ProtectedArea objects
        } as LocationPopUp,
        feature: locationFeature,
        popup: [e?.lngLat?.lat, e?.lngLat.lng],
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
      if (map) {
        if (restorationFeature) {
          const newId = restorationFeature.id as string | number;

          if (clickedStateIdRef.current !== null && clickedStateIdRef.current !== newId) {
            map.removeFeatureState(
              {
                source: 'mangrove_restoration',
                sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
                id: clickedStateIdRef.current,
              },
              'clicked'
            );
          }

          map.setFeatureState(
            {
              source: 'mangrove_restoration',
              sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
              id: newId,
            },
            { clicked: true }
          );

          clickedStateIdRef.current = newId;

          setRestorationPopUpInfo({
            ...restorationPopUp,
            info: restorationFeature.properties as RestorationPopUp,
          });
        } else {
          if (clickedStateIdRef.current !== null) {
            map.removeFeatureState(
              {
                source: 'mangrove_restoration',
                sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
                id: clickedStateIdRef.current,
              },
              'clicked'
            );
            clickedStateIdRef.current = null;
          }
          removePopup('restoration');
        }
      }
    }

    if (!restorationFeature) {
      if (map?.getSource('mangrove_restoration')) {
        map.removeFeatureState({
          sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
          source: 'mangrove_restoration',
          id: clickedStateIdRef.current || '',
        });
      }
      removePopup('restoration');
    }
    // Restoration Sites
    if (restorationSitesFeature) {
      const infoParsed = restorationSitesFeature?.properties?.cluster
        ? { point_count: restorationSitesFeature?.properties.point_count }
        : Object.entries(LABELS).reduce((acc, [key, label]) => {
            const value = restorationSitesFeature.properties?.[key];

            if (key === 'landscape_name' || key === 'site_name') {
              acc[label] = [value];
            } else {
              const parsed = value ? JSON.parse(value) : null;
              acc[label] = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
            }

            return acc;
          }, {});

      setRestorationSitesPopUp({
        ...restorationSitesPopUp,
        info: infoParsed as RestorationSitesPopUp,
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

  const handleMouseMove = useCallback(
    (evt: Parameters<NonNullable<MapProps['onMouseMove']>>[0]) => {
      const restorationData = evt?.features?.find(({ layer }) => {
        return layer.id === 'mangrove_restoration-layer';
      });
      const interactiveLayers = evt?.features?.find(
        ({ layer }) =>
          layer.id === 'country-boundaries-layer' ||
          layer.id === 'mangrove_protected_areas' ||
          layer.id === 'mangrove_iucn_ecoregion-layer' ||
          layer.id === 'mangrove_restoration-layer'
      );

      // *ON MOUSE ENTER
      if (restorationData && map) {
        if (clickedStateIdRef.current === restorationData?.id) {
          map?.setFeatureState(
            {
              sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
              source: 'mangrove_restoration',
              id: hoveredStateIdRef.current ?? undefined,
            },
            { hover: true, clicked: true }
          );
        }
        if (
          hoveredStateIdRef.current !== null &&
          clickedStateIdRef.current !== restorationData?.id
        ) {
          map?.removeFeatureState({
            sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
            source: 'mangrove_restoration',
            id: hoveredStateIdRef.current,
          });
        }

        hoveredStateIdRef.current = restorationData?.id;
        map?.setFeatureState(
          {
            sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
            source: 'mangrove_restoration',
            id: hoveredStateIdRef.current,
          },
          { hover: true }
        );
      }

      // *ON MOUSE LEAVE

      if (!restorationData && loaded && hoveredStateIdRef.current) {
        if (map?.getSource('mangrove_restoration')) {
          map.setFeatureState(
            {
              sourceLayer: 'MOW_Global_Mangrove_Restoration_202212',
              source: 'mangrove_restoration',
              id: hoveredStateIdRef.current,
            },
            { hover: false }
          );
        }
        hoveredStateIdRef.current = null;
      }

      if (isDrawingToolEnabled && !customGeojson) {
        setCursor('cell');
      } else if (interactiveLayers || restorationData) {
        setCursor('pointer');
      } else setCursor('grab');
    },
    [cursor, map, loaded, isDrawingToolEnabled, customGeojson, setCursor]
  );

  const handleMapLoad = useCallback(() => {
    setLoaded(true);
  }, []);
  const pitch = map?.getPitch();

  return (
    <>
      {!!locationPopUp.info && !guideIsActive && (
        <MapPopup
          mapId={mapId}
          locationInfo={{
            ...locationPopUp,
            position: {
              x: locationPopUp.position.x ?? 0,
              y: locationPopUp.position.y ?? 0,
            },
          }}
          restorationInfo={restorationPopUp}
          restorationSitesInfo={restorationSitesPopUp}
          iucnEcoregionInfo={iucnEcoregionPopUp}
        />
      )}
      <div
        className={
          hideControls
            ? 'relative z-0 h-full w-full'
            : 'absolute top-0 left-0 z-0 h-screen w-screen'
        }
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
          onMoveEnd={handleMoveEnd}
          interactiveLayerIds={
            isDrawingToolEnabled || guideIsActive
              ? []
              : interactiveLayerIds.filter((id): id is string => !!id)
          }
          onClick={onClickHandler}
          onMouseMove={handleMouseMove}
          onLoad={handleMapLoad}
          cursor={cursor}
          preserveDrawingBuffer
          testMode={typeof navigator !== 'undefined' && navigator.webdriver === true}
        >
          {loaded && (
            <>
              <LayerManager />
              {(isDrawingToolEnabled || uploadedGeojson) && (
                <DrawControl
                  onCreate={handleUserDrawing}
                  onUpdate={handleDrawingUpdate}
                  customPolygon={uploadedGeojson || customGeojson}
                  onSetCustomPolygon={handleCustomPolygon}
                />
              )}
              {!hideControls && (
                <Controls className="absolute right-5 bottom-9 hidden items-center md:block">
                  <div className="flex flex-col space-y-2 pt-1">
                    {(customGeojson || uploadedGeojson) && <DeleteDrawingButton />}
                    <Helper
                      className={{
                        button: 'top-1 left-8 z-20',
                        tooltip: 'w-80',
                      }}
                      tooltipPosition={{ top: 0, left: 330 }}
                      message="Use this icon to show the map in full screen. Widgets and other menu items will be hidden until the icon is clicked again. "
                    >
                      <FullScreenControl />
                    </Helper>
                    <Helper
                      className={{
                        button: 'top-1 left-8 z-20',
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
                        button: 'top-1 left-8 z-20',
                        tooltip: 'w-80',
                      }}
                      tooltipPosition={{ top: 0, left: 330 }}
                      message="Select this icon to choose from a variety of basemaps, enable visualization of the high-resolution mangrove extent, or to select high resolution imagery from Planet."
                    >
                      <BasemapSettingsControl />
                    </Helper>
                    <Helper
                      className={{
                        button: 'top-1 left-8 z-20',
                        tooltip: 'w-80',
                      }}
                      tooltipPosition={{ top: 0, left: 330 }}
                      message="Use the + icon to zoom into the map and the – button to zoom out of the map"
                    >
                      <div className="border-box shadow-control flex flex-col overflow-hidden rounded-3xl">
                        <ZoomControl mapId={mapId} />
                        {pitch !== 0 && <PitchReset mapId={mapId} />}
                      </div>
                    </Helper>
                  </div>
                </Controls>
              )}

              {!!position && !!locationPopUp.info && (
                <Marker
                  latitude={coordinates?.lat || undefined}
                  longitude={coordinates?.lng || undefined}
                  offset={[0, 0]}
                  anchor="bottom"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoordinates(null);
                      setPosition(null);
                    }}
                  >
                    <Image src="/images/MapMarker.png" alt="Map Marker" width={30} height={10} />
                  </button>
                </Marker>
              )}
            </>
          )}
        </Map>

        {!hideControls && (
          <>
            <Media lessThan="md">
              <div className="absolute top-20">
                <MobileLegend />
              </div>
            </Media>
            <Media greaterThanOrEqual="md">
              <div className="absolute right-18 bottom-9 z-50 mr-0.5">
                <Legend />
              </div>
            </Media>
          </>
        )}
      </div>
    </>
  );
};

export default MapContainer;

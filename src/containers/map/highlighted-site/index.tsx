import { useEffect, useMemo } from 'react';

import { Source, Layer } from 'react-map-gl';

import { highlightedSiteAtom, interactiveLayerIdsAtom } from '@/store/map';

import type { FeatureCollection } from 'geojson';
import { useAtomValue, useSetAtom } from 'jotai';

// Same magenta as the restoration-sites widget layer, so a highlighted site reads
// as the same kind of thing as the clustered points.
const SITE_COLOR = '#CC61B0';

// The ids carry `mangrove_rest_sites` on purpose: the map's click handler keys the
// restoration-sites popup off `layer.id.includes('mangrove_rest_sites')`, so the
// highlight gets the same popup, built from the same LABELS, with no extra branch.
const FILL_ID = 'mangrove_rest_sites-highlight-fill';
const LINE_ID = 'mangrove_rest_sites-highlight-line';
const POINT_ID = 'mangrove_rest_sites-highlight-point';

const HighlightedSite = () => {
  const highlightedSite = useAtomValue(highlightedSiteAtom);
  const setInteractiveLayerIds = useSetAtom(interactiveLayerIdsAtom);

  const isPoint = highlightedSite?.geometry.type === 'Point';

  const data = useMemo<FeatureCollection | null>(() => {
    if (!highlightedSite) return null;
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: highlightedSite.properties,
          geometry: highlightedSite.geometry,
        },
      ],
    };
  }, [highlightedSite]);

  // Clickable, same as the layer-manager layers register themselves.
  useEffect(() => {
    if (!data) return;

    const ids = isPoint ? [POINT_ID] : [FILL_ID, LINE_ID];
    setInteractiveLayerIds((prev) => [...prev, ...ids]);

    return () => setInteractiveLayerIds((prev) => prev.filter((id) => !ids.includes(id)));
  }, [data, isPoint, setInteractiveLayerIds]);

  if (!data) return null;

  // Rendered outside the layer manager: no id in the layers registry, no opacity
  // or visibility controls. The circle layer is mounted only for a genuine point
  // (a centroid-only site) so a site with a polygon can never draw as a dot.
  return (
    <Source id="highlighted-site" type="geojson" data={data}>
      {isPoint ? (
        <Layer
          source="highlighted-site"
          id={POINT_ID}
          type="circle"
          paint={{
            'circle-color': SITE_COLOR,
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF',
          }}
        />
      ) : (
        <>
          <Layer
            source="highlighted-site"
            id={FILL_ID}
            type="fill"
            paint={{ 'fill-color': SITE_COLOR, 'fill-opacity': 0.25 }}
          />
          <Layer
            source="highlighted-site"
            id={LINE_ID}
            type="line"
            paint={{ 'line-color': SITE_COLOR, 'line-width': 2 }}
          />
        </>
      )}
    </Source>
  );
};

export default HighlightedSite;

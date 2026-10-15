import bbox from '@turf/bbox';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

import type { UserSitesResponse } from '@/containers/datasets/locations/user-locations';

export type BBox = [number, number, number, number];

export type MRTTSite = UserSitesResponse[number];

export type LandscapeGroup = {
  landscape_id: number;
  landscape_name: string;
  sites: MRTTSite[];
};

/** Groups the flat `/sites` list by landscape, keeping the API's site order within each. */
export const groupSitesByLandscape = (sites: MRTTSite[] = []): LandscapeGroup[] => {
  const groups = new Map<number, LandscapeGroup>();
  for (const site of sites) {
    const group = groups.get(site.landscape_id);
    if (group) {
      group.sites.push(site);
    } else {
      groups.set(site.landscape_id, {
        landscape_id: site.landscape_id,
        landscape_name: site.landscape_name,
        sites: [site],
      });
    }
  }
  return Array.from(groups.values());
};

/**
 * Wraps a site polygon in the FeatureCollection shape the drawing/upload pipeline
 * consumes (`drawingUploadToolAtom.uploadedGeojson`), so an MRTT site renders and
 * analyses exactly like an uploaded area.
 */
export const siteGeometryToFeatureCollection = (geometry: Geometry): FeatureCollection => {
  const feature: Feature = { type: 'Feature', properties: {}, geometry };
  return { type: 'FeatureCollection', features: [feature] };
};

export const siteGeometryToBBox = (geometry: Geometry): BBox =>
  bbox(siteGeometryToFeatureCollection(geometry)) as BBox;

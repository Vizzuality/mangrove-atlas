import { GeoJSONSourceRaw } from 'react-map-gl';

export type LocationTypes = Readonly<'custom-area' | 'wdpa' | 'country' | 'worldwide'>;

export interface Location {
  name: string;
  location_type: LocationTypes;
  iso: string;
  location_id: string;
  bounds: GeoJSONSourceRaw;
  coast_length_m: number;
  perimeter_m: number;
  area_m2: number;
  id: number;
  created_at: string;
}

/** Fields guaranteed by useLocation's select — safe to destructure without null checks. */
export type LocationInfo = {
  name: string;
  id: string | number;
  iso: string;
  location_id: string;
  location_type: string;
};

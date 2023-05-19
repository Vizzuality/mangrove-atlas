import { GeoJSONSourceRaw } from 'react-map-gl';

export type LocationTypes = Readonly<['custom-area', 'wdpa', 'country']>;
export interface Location {
  name: string;
  location_type: string;
  iso: string;
  location_id: string;
  bounds: GeoJSONSourceRaw;
  coast_length_m: number;
  perimeter_m: number;
  area_m2: number;
  id: number;
  created_at: string;
}

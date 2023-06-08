import { GeoJsonTypes } from 'geojson';

export type UseParamsOptions = {
  startDate?: string;
  endDate?: string;
  location_id: number;
};

export type DataParams = {
  geometry: {
    type: 'FeatureCollection';
    features: Feature<Geometry, { [name: string]: any }>[];
  };
};

export type DataResponse = {
  data: {
    date: { label: string; value: number };
  };
};

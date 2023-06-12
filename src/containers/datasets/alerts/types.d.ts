import { GeoJsonTypes } from 'geojson';

export type UseParamsOptions = {
  startDate?: string;
  endDate?: string;
  location_id: number;
};

export type DataParams = {
  geometry: GeoJsonTypes['Geometry'];
};

export type DataResponse = {
  data: {
    date: { label: string; value: number };
  };
};

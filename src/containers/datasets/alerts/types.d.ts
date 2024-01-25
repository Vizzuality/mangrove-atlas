export type UseParamsOptions = {
  startDate?: string;
  endDate?: string;
  location_id: number;
};

export type DataResponse = {
  data: {
    date: { label: string; value: number };
  };
};

export type CustomAreaGeometry = { geometry: GeoJSON.FeatureCollection };

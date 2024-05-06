export type UseParamsOptions = {
  startDate?: string;
  endDate?: string;
  location_id: number;
};

export type DataResponse = {
  data: {
    date: { label: string; value: number };
  };
  selectedStartDate: string;
  endDateOptions: { label: string; value: number }[];
};

export type CustomAreaGeometry = { geometry: GeoJSON.FeatureCollection };

export interface AlertData {
  alertsTotal: string;
  startDateOptions: { label: string; value: string }[];
  selectedStartDate: { label: string; value: string };
  endDateOptions: { label: string; value: string }[];
  selectedEndDate: { label: string; value: string };
  config: unknown;
  configBrush: {
    customBrush: {
      startIndex: number;
      endIndex: number;
    };
  };
  defaultStartDate: { label: string; value: string };
  defaultEndDate: { label: string; value: string };
  fullData: unknown;
}

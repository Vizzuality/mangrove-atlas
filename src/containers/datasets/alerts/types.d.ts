export type UseParamsOptions = {
  startDate?: string;
  endDate?: string;
  location_id: number;
};

export type DataResponse = {
  data: {
    date: { label: string; value: number };
  };
  selectedStartDate: DateOption['value'];
  endDateOptions: DateOption[];
};

export type CustomAreaGeometry = { geometry: GeoJSON.FeatureCollection };

export interface AlertData {
  alertsTotal: string;
  startDateOptions: DateOption[];
  selectedStartDate: DateOption;
  endDateOptions: DateOption[];
  selectedEndDate: DateOption;
  config: unknown;
  configBrush: {
    customBrush: {
      startIndex: number;
      endIndex: number;
    };
  };
  defaultStartDate: DateOption;
  defaultEndDate: DateOption;
  fullData: unknown;
}

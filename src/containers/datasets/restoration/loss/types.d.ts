export type Unit = {
  degraded_area: string;
  lost_area: string;
  mangrove_area: string;
};

export type Metadata = {
  location_id: string;
  note: string;
  units: Unit;
  year: number[];
  main_loss_driver: string;
};

type IndicatorData = {
  indicator: string;
  label: string;
  value: number;
};

type ChartData = {
  color: string;
  children: ChartData[];
  indicator: string;
  label: string;
};

export type Data = {
  data: IndicatorData;
  location: string;
  location_id: string;
  note: string;
  units: Unit;
  unit: Unit['degraded_area'];
  year: number[];
  main_loss_driver: string;
  chartData: ChartData[];
};

export type DataResponse = {
  data: Data;
  metadata: Metadata;
};

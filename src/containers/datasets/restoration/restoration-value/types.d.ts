export type Metadata = {
  location_id: string;
  note: string;
  unit: string;
};

export type ChartData = {
  indicator: 'SOC' | 'AGB';
  value: number;
};

export type Data = {
  data: ChartData[];
  chartData: ChartData[];
  location: string;
  location_id: string;
  note: string;
  unit: string;
};

export type DataResponse = {
  data: ChartData[];
  metadata: Metadata;
};

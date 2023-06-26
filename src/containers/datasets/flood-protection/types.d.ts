export type Metadata = {
  location_id: string;
  min: string;
  max: string;
  periods: ['annual', '25_year', '100_year'];
  unit: 'usd' | 'people' | 'km2';
};

export type ChartData = {
  indicator: 'area' | 'people' | 'stock';
  value: number;
  period: 'annual' | '25_year' | '100_year';
};

export type Data = {
  data: ChartData[];
  chartData: ChartData[];
  location: string;
} & Metadata &
  Chartdata;

export type DataResponse = {
  data: ChartData[];
  metadata: Metadata;
};

export type FloodProtectionIndicatorId = 'area' | 'population' | 'stock';
export type FloodProtectionPeriodId = 'annual' | '25_years' | '100_years';

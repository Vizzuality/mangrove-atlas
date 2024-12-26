import { BarProps, CartesianAxis, CartesianGrid } from 'recharts';

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

type ChartDataBase = {
  barSize: number;
  fill: string | string[];
  isAnimationActive: boolean;
  value: number;
  period: Period;
  color: string;
  showValue: boolean;
  label: string;
  labelFormatted: string;
  valueFormatted: string;
  unit: string;
};

export type ChartData = ChartDataBase & {
  [key in Period]: number;
};

export interface Config extends BarProps {
  type: 'bar';
  dataKey: 'value';
  width: number;
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  chartBase: {
    dataKey: 'value';
    type: 'bar';
    bar: ChartData[] | [];
  };
  xKey: 'period';
  cartesianGrid: CartesianGrid;
  cartesianAxis: CartesianAxis;
  tooltip: TooltipType;
}

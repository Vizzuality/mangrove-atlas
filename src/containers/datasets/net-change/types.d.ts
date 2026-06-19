import { CartesianGridProps } from 'recharts';

type Data = Readonly<{
  year: number;
  net_change: number;
  gain: number;
  loss: number;
  config: ChartConfig;
  location: string;
  years: number[];
  currentStartYear: number;
  currentEndYear: number;
  netChange: string;
  direction: string;
  unitOptions: string[];
}>;

type Metadata = Readonly<{
  location_id: string;
  note: string;
  total_area: number;
  total_lenght: number;
  units: { [key: string]: string };
  year: number[];
}>;

type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

type ChartData = {
  label: number;
  year: number;
  gain: number;
  loss: number;
};

type chartBaseTypes = {
  bars?: Record<string, Record<string, unknown>>;
  lines?: Record<string, Record<string, unknown>>;
};

type BrushConfig = {
  startIndex: number;
  endIndex: number;
  onBrushEnd: (payload: { startIndex: number; endIndex: number }) => void;
};

type ChartConfig = {
  type: string;
  data: ChartData[];
  cartesianGrid: CartesianGridProps;
  chartBase: chartBaseTypes;
  brush?: BrushConfig;
};

type NetChangeData = {
  direction: string;
  netChange: string;
  isLoading: boolean;
  config: ChartConfig;
};

export type UseParamsOptions = Readonly<{
  startYear: number;
  endYear: number;
  selectedUnit?: string;
}>;

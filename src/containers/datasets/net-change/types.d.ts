import { CartesianGridProps } from 'recharts';

type Data = Readonly<{
  year: number;
  net_change: number;
  gain: number;
  loss: number;
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
  lines: {
    netChange: {
      stroke: string;
      legend: string;
      isAnimationActive: boolean;
    };
  };
};

type ChartConfig = {
  type: string;
  data: ChartData[];
  cartesianGrid: CartesianGridProps;
  chartBase: chartBaseTypes;
};

type NetChangeData = {
  direction: string;
  netChange: string;
  isLoading: boolean;
  config: ChartConfig;
};

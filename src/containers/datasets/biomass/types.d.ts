import type { QueryObserverBaseResult } from '@tanstack/react-query';

type Unit = {
  value: string;
};

type BiomassIndicator = 'total' | '0-50' | '50-100' | '100-150' | '150-250' | '250-1500';

export type Data = { year: number; value: number; indicator: BiomassIndicator };

type ChartData = {
  label: BiomassIndicator;
  value: number;
  showValue: boolean; // legend
  color: string;
};

export type AboveGround = {
  year: number;
  value: number;
};

type Metadata = {
  location_id: string;
  note: null;
  units: Unit;
  year: number[];
  avg_aboveground_biomass: AboveGround[];
  total_aboveground_biomass: [];
};

export type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

type chartBaseTypes = {
  pies: {
    value: string;
  };
};

type ChartConfig = {
  type: string;
  data: ChartData[];
  chartBase: chartBaseTypes;
  tooltip: unknown;
  legend: {
    title: string;
    items: {
      color: string;
      label: string;
      showValue: boolean;
      value: number;
      valueFormatted: string;
    }[];
  };
};

export type BiomassData = {
  isFetching: QueryObserverBaseResult['isFetching'];
  isError: QueryObserverBaseResult['isError'];
  refetch: QueryObserverBaseResult['refetch'];
  mean: string;
  unit: string;
  year: number;
  config: ChartConfig;
  location: string;
  noData: boolean;
};

export type ColorKeysTypes = {
  [key: string]: string;
};

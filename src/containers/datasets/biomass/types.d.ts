type Unit = {
  value: string;
};

type BiomassIndicator = 'total' | '0-50' | '50-100' | '100-150' | '150-250' | '250-1500';

export type Data = { year: number; value: number; indicator: BiomassIndicator };

type ChartData = {
  label: BiomassIndicator;
  value: number;
  showValue: boolean; // legend
  // valueFormatted: string;
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
  legend: unknown;
};

export type BiomassData = {
  isLoading: boolean;
  mean: string;
  unit: string;
  year: number;
  config: ChartConfig;
  location: string;
};

export type ColorKeysTypes = {
  [key: string]: string;
};

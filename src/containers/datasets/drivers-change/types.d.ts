type Unit = {
  value: string;
};

type DriversChangeVariable =
  | 'erosion_pct'
  | 'episodic_disturbances_pct'
  | 'commodities_pct'
  | 'npc_pct'
  | 'settlement_pct';

export type Data = { primary_driver: string; value: number; variable: DriversChangeVariable };

type ChartData = {
  label: string;
  value: number;
  showValue: boolean; // legend
  color: string;
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

export type DriversChangeData = {
  primaryDriver: string;
  isLoading: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  config: ChartConfig;
  location: string;
};

export type ColorKeysTypes = {
  [key: string]: string;
};

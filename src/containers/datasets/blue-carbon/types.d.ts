type Units = {
  value: 'CO2e/ha';
  toc: 't CO₂e';
  soc: 't CO₂e';
  agb: 't CO₂e';
};

type BlueCarbonIndicator = '0-700' | '700-1400' | '1400-2100' | '2100-2800' | '2800-3500';

export type Data = {
  year?: number;
  value: number;
  indicator: BlueCarbonIndicator;
};

type ChartData = {
  label: BiomassIndicator;
  value: number;
  color: string;
};

type Metadata = {
  location_id: string;
  note: null;
  units: Unit;
  year: number[];
  agb: number;
  soc: number;
  toc: number;
  units: Units;
};

export type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

export type BlueCarbon = {
  data?: Data[];
  soc: string;
  toc: string;
  agb: string;
  config: ChartConfig;
  location: string;
  metadata?: Metadata;
};

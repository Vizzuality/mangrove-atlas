type CarbonMarketPotentialIndicator = 'carbon_5' | 'carbon_10' | 'protected' | 'remaining';

export type UnitValue = 'ha' | 'km2' | 'm2';
type UnitLabel = 'ha' | 'km²' | 'm²';

export type Unit = {
  label: UnitLabel;
  value: UnitValue;
};

export type UseParamsOptions = Readonly<{
  location_id?: string;
  label: string;
  units: UnitValue;
}>;

export type Data = {
  percentage: number;
  value: number;
  category: CarbonMarketPotentialIndicator;
  label: string;
  description: string;
};

export type CarbonMarketPotentialData = {
  data: Data[];
  location: string;
  labels: string[];
  units: Unit[];
  config: Config;
  investibleBlueCarbonValue: number;
};

export type ChartLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  endAngle: number;
  outerRadius: number;
  category: string;
  percentage: number;
  index: number;
};

type Metadata = {
  location_id: string;
  note: string;
  units: string;
};

export type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

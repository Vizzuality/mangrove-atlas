type Metadata = {
  location_id: string;
  note: null;
  total_area: number;
  total_lenght: number;
  units: Unit;
  year: number[];
};

export type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

type Unit = {
  habitat_extent_area: string;
  linear_coverage: string;
};

export type Indicator = {
  year: number;
  linear_coverage: number;
  habitat_extent_area: number;
};

type Legend = {
  label: string;
  value: string | number;
  unit: string;
  color: string;
};
type Data = { year: number; value: number; indicator: 'habitat_extent_area' | 'linear_coverage' };

type ChartData = {
  label: string;
  value: number | string;
  color?: string;
  unit?: string;
};

type TooltipData = {
  title?: string;
  items: ChartData[];
};

type chartBaseTypes = {
  pies: {
    value: string;
  };
};

type ChartConfig = {
  type: string;
  data: ChartData[];
  tooltip: TooltipData;
  cartesianGrid: boolean;
  chartBase: chartBaseTypes;
};

type RouterProps = {
  name: string;
  id: string;
  location_id: string;
};

export type RouterData = { data: RouterProps };

export type ExtentData = {
  data: Data[];
  metadata: Metadata;
  area: string;
  nonMangrove: string;
  mangroveCoastCoveragePercentage: string;
  totalLength: string;
  years: number[]; // API improvement, change year to years as is an array
  units: Unit;
  legend: Legend[];
  chartData: ChartData[];
  config: ChartConfig;
  name: string;
  years: number[];
  defaultYear: number;
  unitOptions: string[];
  defaultUnitLinearCoverage: string;
};
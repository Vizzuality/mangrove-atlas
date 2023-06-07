import { ReactElement } from 'react';

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
  settings?: {
    label: string;
    value: string;
    unit: string;
  }[];
};

type TooltipData = {
  title?: string;
  content?: (properties: unknown) => JSX.Element | ReactElement;
  items?: ChartData[];
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

export type ExtentData = {
  metadata: Metadata;
  data: Data[];
  area: string;
  nonMangrove: string;
  mangroveCoastCoveragePercentage: string;
  totalLength: string;
  years: number[]; // API improvement, change year to years as is an array
  units: Unit;
  legend: Legend[];
  chartData: ChartData[];
  config: ChartConfig;
  defaultYear: number;
  unitOptions: string[];
  defaultUnitLinearCoverage: string;
  location: string;
  noData: boolean;
};

import type { WidgetSlugType } from 'types/widget';

export type DataSourceType = {
  year: number;
  value: number;
  layer_link: `globalmangrovewatch.${string}`;
  download_link: string | null;
  layer_info: string;
  source_layer: string;
};

export type ApiSourceType = {
  source: string;
  unit: string;
  years: number[];
  data_source: DataSourceType[];
};

export type NationalDashboardIndicator = {
  indicator: string;
  legal_status: string | null;
  mangrove_breakthrough_committed: boolean | null;
  sources: ApiSourceType[];
};

export type IndicatorSourcesProps = {
  id: WidgetSlugType;
  locationIso: string;
  layerIndex: number;

  source: string;
  years: number[];
  unit: string;

  dataSource: DataSourceType;

  color: string;
  yearSelected: number;
  setYearSelected: (year: number) => void;
};

export type IndicatorSourceProps = {
  source: string;
  color: string;
};

export type IndicatorYearProps = {
  years: number[];
  yearSelected: number;
  setYearSelected: (year: number) => void;
};

export type IndicatorExtentProps = {
  unit: string;
  dataSource: DataSourceType;
};

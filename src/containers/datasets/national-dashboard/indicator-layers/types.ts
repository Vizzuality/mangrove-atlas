import type { WidgetSlugType } from 'types/widget';

type DataSourceType = {
  year: number;
  value: number;
  layer_link: `globalmangrovewatch.${string}`;
  download_link: string | null;
  layer_info: string;
  source_layer: string;
};

export type IndicatorSourcesProps = {
  id: WidgetSlugType;
  locationIso: string;
  layerIndex: number;
  layerKey: string;
  indicator: string;

  source: string;
  years: number[];
  unit: string;

  data_source: DataSourceType[];

  color: string;
  className?: string;
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
  dataSource: DataSourceType | undefined;
};

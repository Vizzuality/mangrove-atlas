import type { WidgetSlugType } from 'types/widget';

type DataSourceTypes = {
  value: number;
  layer_link: `globalmangrovewatch.${string}`;
  download_link: string;
  layer_info: string;
  source_layer: string;
};

export type IndicatorSourcesTypes = {
  id: WidgetSlugType;
  locationIso: string;
  layerIndex: number;
  source: string;
  years: number[];
  unit: string;
  dataSource: DataSourceTypes;
  color: string;
  yearSelected: number;
  setYearSelected: (year: number) => void;
};

export type IndicatorSourceTypes = {
  source: IndicatorSourcesTypes['source'];
  color: IndicatorSourcesTypes['color'];
};

export type IndicatorYearTypes = {
  years: IndicatorSourcesTypes['years'];
  yearSelected: IndicatorSourcesTypes['yearSelected'];
  setYearSelected: IndicatorSourcesTypes['setYearSelected'];
};

export type IndicatorExtentTypes = {
  unit: IndicatorSourcesTypes['unit'];
  dataSource: DataSourceTypes;
};

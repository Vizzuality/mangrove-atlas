export type IndicatorSourceEntry = {
  year: number;
  value: number;
  layer_info: string;
  layer_link: string;
  download_link: string | null;
  source_layer: string;
};

export type IndicatorSource = {
  source: string;
  unit: string;
  years: number[];
  data_source: IndicatorSourceEntry[];
};

export type IndicatorDataItem = {
  indicator: string;
  legal_status: 'forest' | 'mangrove';
  mangrove_breakthrough_committed: boolean | null;
  sources: IndicatorSource[];
};

export type OtherResource = {
  name: string;
  description: string;
  link: string;
};

export type IndicatorMetadata = {
  location_id: string;
  legal_status_options: string[];
  other_resources: OtherResource[];
  note: string | null;
};

export type DataResponse = {
  data: IndicatorDataItem[];
  metadata: IndicatorMetadata;
};

export type LayerSettingsType = {
  source?: string;
  name?: string;
  source_layer?: string;
  layerIndex?: number;
  year?: number;
  [key: string]: string | number;
};

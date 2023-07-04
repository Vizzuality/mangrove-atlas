type DataSource = {
  download_link: string;
  layer_info: string;
  layer_link: string;
  value: number;
  year: number;
};
type Source = {
  data_source: DataSource[];
  source: string;
  unit: string;
  years: number[];
};

type Data = { indicator: string; sources: Source[] };

type Metadata = {
  locations_id: string;
  note: string;
  other_resources: unknown[];
};
export type DataResponse = {
  data: Data;
  metadata: Metadata;
};

type Settings = {
  source: string;
  locationId: number;
  name: string;
  source_layer: string;
  color: string;
};

export type NationalDashboardLayerSettingsTypes = {
  [key: string]: Settings;
};

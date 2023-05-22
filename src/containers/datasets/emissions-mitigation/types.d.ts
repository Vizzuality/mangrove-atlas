export type Data = {
  category: 'Mangrove' | 'Other';
  indicator: string;
  value: number;
  year: number;
};

export type emissionsMitigationData = {
  config: Config;
  location: string;
};

export type Metadata = {
  location_id: string;
  units: { [key: string]: string };
  year: number[];
  note: string;
};

export type DataResponse = {
  data: emissionsMitigationData;
  metadata: Metadata;
};

export type UseParamsOptions = {
  filteredIndicators: string[];
};

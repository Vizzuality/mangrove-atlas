export type Data = {
  indicator: 'finfish' | 'shrimp' | 'crab' | 'bivalve';
  indicator_type: 'absolute' | 'density';
  value: number;
};

export type GroupedData = {
  indicator: 'finfish' | 'shrimp' | 'crab' | 'bivalve';
  absolute?: number | null;
  density?: number | null;
};

export type GroupedDataResponse = {
  location: string;
  indicators: GroupedData[];
};

type Metadata = {
  location_id: number;
  unit: string;
};

export type DataResponse = {
  location: string;
  data: Data[];
  metadata: Metadata;
};

type ApiData = Omit<Data, 'indicator'> & {
  indicator: 'fish' | Data['indicator'];
};

type ApiResponse =
  | (Omit<DataResponse, 'data'> & { data: ApiData[] })
  | (Omit<DataResponse, 'data'> & { indicators: ApiData[] });

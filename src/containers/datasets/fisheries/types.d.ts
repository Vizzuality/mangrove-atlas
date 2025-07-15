export type Data = {
  indicator: 'fish' | 'shrimp' | 'crab' | 'bivalve';
  indicator_type: 'absolute' | 'density';
  value: number;
};

export type DataLocation = {
  location: string;
  data: Data[];
};

export type GroupedData = {
  indicator: 'fish' | 'shrimp' | 'crab' | 'bivalve';
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

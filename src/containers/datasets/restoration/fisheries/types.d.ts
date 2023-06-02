export type Metadata = {
  location_id: string;
  note: string;
  unit: string;
};

export type DataChart = {
  indicator: 'fish' | 'shrimp' | 'crab' | 'bivalve';
  value: number;
};

export type Data = {
  dataChart: DataChart[];
  location: string;
  location_id: string;
  note: string;
  unit: string;
};

export type DataResponse = {
  data: Data;
  metadata: Metadata;
};

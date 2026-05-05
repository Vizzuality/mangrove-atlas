export type Data = {
  category: 'fish' | 'shrimp' | 'crab' | 'bivalve' | 'median' | 'range_max' | 'range_min';
  value: number;
};

export type DataResponse = {
  location: string;
  data: Data[];
  metadata: Metadata;
};

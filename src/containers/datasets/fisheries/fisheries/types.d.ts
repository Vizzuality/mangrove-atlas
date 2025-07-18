export type Data = {
  category: 'fish' | 'shrimp' | 'crab' | 'bivalve';
  value: number;
};

export type DataResponse = {
  location: string;
  data: Data[];
  metadata: Metadata;
};

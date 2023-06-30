export type Data = {
  category: string;
  indicator: string;
  value: number;
  year: number;
};

type Metadata = unknown;

export type DataResponse = {
  data: Data;
  metadata: Metadata;
};

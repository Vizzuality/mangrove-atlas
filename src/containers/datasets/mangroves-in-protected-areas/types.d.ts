export type Data = {
  location: string;
  protected_area: number;
  total_area: number;
  [key: string]: unknown;
};

type Metadata = unknown;

export type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

export type ProtectionType = {
  location: string;
};

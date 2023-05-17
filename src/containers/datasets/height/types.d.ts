type TreeHeightIndicator = '0-5' | '5-10' | '10-15' | '15-20' | '20-65';

export type Data = {
  indicator: TreeHeightIndicator;
  value: number;
  year: number;
};

type AvgHeight = {
  year: number;
  value: number;
};

type Unit = {
  value: string;
};

type Metadata = {
  location_id: string;
  note: null;
  avg_height: AvgHeight[];
  units: { value: 'm' };
  year: number[];
};

export type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

export type ColorKeysTypes = {
  [key: TreeHeightIndicator]: string;
};

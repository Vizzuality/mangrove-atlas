export type Unit = {
  restoration_potential_score: string;
  restorable_area: string;
  mangrove_area: string;
};

export type Metadata = {
  location_id: string;
  note: string;
  units: Unit;
  year: number[];
};

export type Data = {
  mangrove_area_extent: number;
  restorable_area: number;
  restorable_area_perc: number;
  restoration_potential_score: number;
  location: string;
  location_id: string;
  note: string;
  units: Unit;
  year: number[];
};

export type DataResponse = {
  data: Data;
  metadata: Metadata;
};

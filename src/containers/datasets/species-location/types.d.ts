export type Specie = {
  scientific_name: string;
  common_name: string;
  iucn_url: string;
  id: number;
  red_list_cat: 'cr' | 'en' | 'vu' | 'nt' | 'lc' | 'dd';
  location_ids: number[];
};

export type DataResponse = {
  data: Specie[];
};

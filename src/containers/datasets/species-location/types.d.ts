type Categories = Readonly<{
  cr: number;
  en: number;
  vu: number;
  nt: number;
  lc: number;
  dd: number;
}>;

type Category = 'cr' | 'en' | 'vu' | 'nt' | 'lc' | 'dd';
type Specie = Readonly<{
  common_name: null | string;
  created_at: string;
  id: number;
  iucn_url: string;
  red_list_cat: Category;
  scientific_name: string;
  updated_at: string;
}>;

export type Data = {
  total: number;
  threatened: number;
  categories: Categories;
  species?: Specie[];
};

type Metadata = {
  note: string;
  unit: null | string;
};

export type DataResponse = {
  data: Data;
  metadata: Metadata;
};

export type SpeciesData = {
  species: Specie[];
};

type Specie = Readonly<{
  scientific_name: string;
  iucn_url: string;
}>;

export type LegendItem = Readonly<{
  value: number;
  color: string;
  label:
    | 'Critically Endangered'
    | 'Endangered'
    | 'Vulnerable'
    | 'Near Threatened'
    | 'Least Concern'
    | 'Data Deficient';
  species: Specie[];
}>;

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

type Data = { total: number; threatened: number; categories: Categories; species: Specie[] };

type Metadata = {
  note: 'nº of species';
  unit: null | string;
};

export type DataResponse = {
  data: Data;
  metadata: Metadata;
};

export type SpeciesData = {
  threatenedLegend: number | string;
  total: number;
  isLoading: boolean;
  tooltip?: unknown;
  chartData;
};

export type DataResponseSpeciesLocation = {
  data: {
    species: Specie[];
  };
};

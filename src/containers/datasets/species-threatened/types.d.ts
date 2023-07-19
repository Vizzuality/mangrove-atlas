type Specie = Readonly<{
  scientific_name: string;
  iucn_url: string;
}>;

export type Category =
  | 'Critically Endangered'
  | 'Endangered'
  | 'Vulnerable'
  | 'Near Threatened'
  | 'Least Concern'
  | 'Data Deficient';

export type LegendItem = Readonly<{
  value: number;
  color: string;
  label: Category;
  species: Specie[];
}>;

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

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
}>;

export type CategoryIds =
  | 'ce'
  | 'en'
  | 'vu'
  | 'nt'
  | 'lc'
  | 'dd'
  | 'CE'
  | 'EN'
  | 'VU'
  | 'NT'
  | 'LC'
  | 'DD';

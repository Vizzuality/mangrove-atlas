type Specie = Readonly<{
  scientific_name: string;
  iucn_url: string;
}>;

type Label = Readonly<
  | 'Critically Endangered'
  | 'Endangered'
  | 'Vulnerable'
  | 'Near Threatened'
  | 'Least Concern'
  | 'Data Deficient'
>;

export type LegendItem = Readonly<{
  value: number;
  color: string;
  label: Label;
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

export type Colors = Readonly<{ [key: Label]: string }>;

export const COLORS = {
  ce: '#EE4D5A',
  en: '#F97B57',
  vu: '#ECDA9A',
  lc: '#B4DCAA',
  dd: '#ECECEF',
  ne: '#ECECEF',
};

export const LABELS = {
  ce: 'Critically Endangered',
  en: 'Endangered',
  vu: 'Vulnerable',
  lc: 'Least Concern',
  dd: 'Data Deficient',
};

export type IUCNEcoregionPopUpInfoLabels =
  | 'distribution_of_biotic_processes'
  | 'environmental_degradation'
  | 'overall_assessment'
  | 'quantitative_risk_analysis'
  | 'reduction_in_geographic_distribution'
  | 'restricted_geographic_distribution';

export type IUCNEcoregionPopUpInfo = {
  [K in IUCNEcoregionPopUpInfoLabels as `${K}_${number}`]?: CategoryIds;
} & {
  region: string; // Corrected type
  overall_assessment: CategoryIds;
  unit_name: string;
};

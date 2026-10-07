import type { COLORS, LABELS } from './constants';

type Specie = Readonly<{
  scientific_name: string;
  iucn_url: string;
}>;

export type Label = (typeof LABELS)[keyof typeof LABELS];

export type LegendItem = Readonly<{
  value: number;
  color: string;
  label: Label;
}>;

type LowerCategoryId = keyof typeof COLORS;

export type CategoryIds = LowerCategoryId | Uppercase<LowerCategoryId>;

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
  region: string;
  overall_assessment: CategoryIds;
  unit_name: string;
};

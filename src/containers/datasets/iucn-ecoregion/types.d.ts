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

export type IUCNEcoregionPopUpInfo = {
  Region: 'string';
  distribution_of_biotic_processes_1?: CategoryIds;
  distribution_of_biotic_processes_2?: CategoryIds;
  distribution_of_biotic_processes_3?: CategoryIds;
  environmental_degradation_1?: CategoryIds;
  environmental_degradation_2?: CategoryIds;
  environmental_degradation_3?: CategoryIds;
  overall_assessment: CategoryIds;
  quantitative_risk_analysis_1?: CategoryIds;
  reduction_in_geographic_distribution_1?: CategoryIds;
  reduction_in_geographic_distribution_2?: CategoryIds;
  reduction_in_geographic_distribution_3?: CategoryIds;
  restricted_geographic_distribution_1?: CategoryIds;
  restricted_geographic_distribution_2?: CategoryIds;
  restricted_geographic_distribution_3?: CategoryIds;
  unit_name: string;
};

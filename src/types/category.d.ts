export type Category =
  | 'all_datasets'
  | 'distribution_and_change'
  | 'restoration_and_conservation'
  | 'climate_and_policy'
  | 'ecosystem_services'
  | 'contextual_layers';

export enum CategoryEnum {
  DistributionAndChange = 'distribution_and_change',
  RestorationAndConservation = 'restoration_and_conservation',
  ClimateAndPolicy = 'climate_and_policy',
  EcosystemServices = 'ecosystem_services',
  ContextualLayers = 'contextual_layers',
  AllDatasets = 'all_datasets',
}

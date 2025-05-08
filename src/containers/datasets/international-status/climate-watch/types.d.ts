export type Data = {
  base_years: string; // TO - DO change to number in API
  ipcc_wetlands_suplement: string;
  ndc: boolean;
  ndc_adaptation: boolean;
  ndc_blurb: string;
  ndc_mitigation: boolean;
  ndc_reduction_target: number;
  ndc_target: number;
  ndc_target_url: string;
  ndc_updated: boolean;
  pledge_summary: string;
  pledge_type: string;
  target_years: string; // TO - DO change to number in API
  isLoading: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  frel: number;
  year_frel: string;
  fow: number;
};
type Location = {
  document_slug: 'revised_first_ndc' | 'second_ndc' | 'first_ndc';
  group_index: number;
  label_id: number;
  value: 'Yes' | 'No';
};

export type Indicator = {
  description: string;
  locations: { [key: string]: Location[] };

  name: string;
  slug: string;
  source: string;
};

export type DataResponse = {
  categories: {
    [key: number]: {
      name: string;
      slug: string;
      type: string;
      sources: string[];
    };
  };
  indicators: Indicator[];
};

type NDCSContentOverview = {
  slug: string;
  name: string;
  value: string;
  document_slug: string;
};

export type DataResponseContentOverview = {
  sectors: string[];
  values: NDCSContentOverview[];
};

export type DataResponseDocuments = {
  data: {
    [key: string]: {
      description: string;
      id: number;
      is_ndc: boolean;
      long_name: string;
      ordering: number;
      slug: string;
      submission_date: string;
      url: string;
    };
  };
};

type IndicatorsParams = {
  indicators: [
    // 'M_TarA4',
    // 'adaptation',
    // 'pledge_content',
    // 'M_TarA1',
    // 'M_TarA2',
    // 'M_TarA5',
    // 'M_TarB1',
    // 'mitigation_contribution_type',
    // 'M_TarYr'

    'ndce statement',
    'ghg_target',
    'mitigation_contribution_type',
    'adaptation',
    'pledge_base_year',
    'time_target_year',
    'submission_type',
  ];
};

export type UseClimateWatchNDCSCountriesDocsParamsOptions = {
  documentSlug?: string;
};

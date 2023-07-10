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

type Indicator = {
  category_ids: number[];
  grouping_indicator: boolean;
  id: number;
  labels: {
    [key: number]: value;
  };

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
    'M_TarA4',
    'adaptation',
    'pledge_content',
    'M_TarA1',
    'M_TarA2',
    'M_TarA5',
    'M_TarB1',
    'mitigation_contribution_type',
    'M_TarYr'
  ];
};

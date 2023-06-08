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
};

type Metadata = {
  location_id: string;
  note: null;
};

export type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

export type InternationalStatusTypes = {
  base_years?: string; // TO - DO change to number in API
  ipcc_wetlands_suplement: string;
  ndc?: boolean;
  ndc_adaptation: boolean;
  ndc_blurb: string;
  ndc_mitigation: boolean;
  ndc_reduction_target: number;
  ndc_target: number;
  ndc_target_url: string;
  ndc_updated: boolean;
  pledge_summary?: string;
  pledge_type: string;
  target_years: string;
  pledge_type: string;
  frel: string;
  year_frel: string;
  fow: number;
  reductionTargetSentence: string;
  targetYearsSentence: string;
  ndcTargetSentence: string;
  hasNDCTarget: boolean;
  hasNDCReductionTarget: boolean;
  location: string;
  isLoading: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  noData: boolean;
};

export type DataSites = {
  id: number;
  landscape_id: number;
  landscape_name: string;
  site_area: string;
  site_centroid: string;
  site_name: string;
  organizations: string;
};

export type Data = {
  data: DataSites[];
  location: string;
};

export type DataResponse = {
  data: Data[];
};

export type DataFilters = {
  data: Filters;
};

type Filter = {
  cause_of_decline: string[];
  community_activities: string[];
  ecological_aim: string[];
  intervention_type: string[];
  organization: string[];
  socioeconomic_aim: string[];
};

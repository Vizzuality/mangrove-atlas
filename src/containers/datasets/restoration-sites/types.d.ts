export type DataDitesProperties = {
  id: number;
  landscape_id: number;
  landscape_name: string;
  site_area: string;
  site_centroid: string;
  site_name: string;
  organizations: string;
  causes_of_decline?: string;
  ecological_aims?: string;
  socioeconomic_aims?: string;
  community_activities?: string;
  intervention_types?: string;
};

export type Data = {
  data: DataDitesProperties[];
  location: string;
};

export type DataResponse = {
  data: DataDitesProperties[];
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

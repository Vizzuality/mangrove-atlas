export type DataDitesProperties = {
  id: number;
  landscape_id: number;
  landscape_name: string;
  site_area: string;
  site_centroid: string;
  site_name: string;
  organizations: string;
};
interface RestorationSite {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: DataDitesProperties;
}

export type Data = {
  data: RestorationSite[];
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

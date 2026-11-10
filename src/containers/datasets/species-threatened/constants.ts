import { COLORS as IUCN_COLORS } from '@/containers/datasets/iucn-ecoregion/constants';

type ThreatenedSpecies = 'ex' | 'ew' | 're' | 'cr' | 'en' | 'vu' | 'lr' | 'nt' | 'lc' | 'dd';

type Colors = Partial<Record<ThreatenedSpecies, string>>;

const Types: Record<string, ThreatenedSpecies> = {
  EX: 'ex',
  EW: 'ew',
  RE: 're',
  CR: 'cr',
  EN: 'en',
  VU: 'vu',
  LR: 'lr',
  NT: 'nt',
  LC: 'lc',
  DD: 'dd',
};

export const RED_LIST_CATEGORIES = {
  [Types.EX]: 'EX',
  [Types.EW]: 'EW',
  [Types.RE]: 'RE',
  [Types.CR]: 'Critically Endangered',
  [Types.EN]: 'Endangered',
  [Types.VU]: 'Vulnerable',
  [Types.LR]: 'LR',
  [Types.NT]: 'Near Threatened',
  [Types.LC]: 'Least Concern',
  [Types.DD]: 'Data Deficient',
};

// Official IUCN Red List category colors, shared with the IUCN Red List of Ecosystems widget.
// EX, EW and RE are species-only, so they are not in the ecoregion palette.
// LR (Lower Risk) is not in the official table.
// Source: IUCN Red List Threat Categories – Colour Chart
// https://nc.iucnredlist.org/redlist/resources/files/1759737820-IUCN_Red_List_Category_Colour_Chart.pdf
export const COLORS: Colors = {
  ex: '#000000',
  ew: '#542344',
  re: '#9B4F96',
  cr: IUCN_COLORS.cr,
  en: IUCN_COLORS.en,
  vu: IUCN_COLORS.vu,
  nt: IUCN_COLORS.nt,
  lc: IUCN_COLORS.lc,
  dd: IUCN_COLORS.dd,
};

// TO - DO - double check with data the categories with no label

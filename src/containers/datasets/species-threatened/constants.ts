import { IUCN_COLORS } from '@/lib/iucn-colors';

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

// Same palette as the IUCN Red List of Ecosystems widget
export const COLORS: Colors = {
  ex: IUCN_COLORS.ex,
  ew: IUCN_COLORS.ew,
  cr: IUCN_COLORS.cr,
  en: IUCN_COLORS.en,
  vu: IUCN_COLORS.vu,
  nt: IUCN_COLORS.nt,
  lc: IUCN_COLORS.lc,
  dd: IUCN_COLORS.dd,
};

// TO - DO - double check with data the categories with no label

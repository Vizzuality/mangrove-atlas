export type ThreatenedSpecies = 'ex' | 'ew' | 're' | 'cr' | 'en' | 'vu' | 'lr' | 'nt' | 'lc' | 'dd';

export type Colors = Partial<Record<ThreatenedSpecies, string>>;

export const Types: Record<string, ThreatenedSpecies> = {
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

export const COLORS: Colors = {
  ex: '#000000',
  ew: '#542243',
  cr: '#EE4D5A',
  en: '#F97B57',
  vu: '#F3AD6A',
  nt: '#ECDA9A',
  lc: '#B4DCAA',
  dd: '#ECECEF',
};

// TO - DO - double check with data the categories with no label

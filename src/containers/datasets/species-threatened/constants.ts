type ThreatenedSpecies = 'ex' | 'ew' | 're' | 'cr' | 'en' | 'vu' | 'lr' | 'nt' | 'lc' | 'dd';

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

// TO - DO - double check with data the categories with no label

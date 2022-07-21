const Types = {
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
  [Types.CR]: 'CR - Critically Endangered',
  [Types.EN]: 'EN - Endangered',
  [Types.VU]: 'VU - Vulnerable',
  [Types.LR]: 'LR',
  [Types.NT]: 'NT - Near Threatened',
  [Types.LC]: 'LC - Least Concern',
  [Types.DD]: 'DD - Data Deficient',
};

export const COLORS = { 
  ex: '#000000',
  ew: '#542243',
  cr: '#D51E08',
  en: '#FC7F3F',
  vu: '#FAE811',
  nt: '#CCE227',
  lc: '#61C55A',
  dd: '#D1D1C8'
};

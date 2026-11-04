// IUCN Red List category palette, shared by the Red List of Ecosystems (ecoregions)
// and the species Red List widgets so both use the same colors.

// Fill colors
export const IUCN_COLORS = {
  ex: '#000000', // Extinct (species)
  ew: '#542243', // Extinct in the Wild (species)
  co: '#000000', // Collapsed (ecosystems)
  cr: '#D81E05',
  en: '#FC7F3F',
  vu: '#F9E814',
  nt: '#CCE226',
  lc: '#60C659',
  dd: '#D1D1C6',
  ne: '#FFFFFF',
} as const;

// Pie slice outline: white fills (e.g. Not Evaluated) get a grey inner outline so they
// don't vanish on the white card; the rest keep the default white separator so the gap
// between slices matches the other widgets' pies.
export const getIucnSliceStroke = (color?: string) =>
  color?.toUpperCase() === '#FFFFFF' ? { stroke: 'rgba(0, 0, 0, 0.15)', strokeWidth: 1 } : {};

// Text colors on top of each fill
export const IUCN_FONT_COLORS: Record<keyof typeof IUCN_COLORS, string> = {
  ex: '#FFFFFF',
  ew: '#FFFFFF',
  co: '#FFFFFF',
  cr: '#FFFFFF',
  en: '#000000',
  vu: '#000000',
  nt: '#000000',
  lc: '#FFFFFF',
  dd: '#FFFFFF',
  ne: '#000000',
};

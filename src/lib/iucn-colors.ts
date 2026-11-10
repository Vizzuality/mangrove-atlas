/**
 * Official IUCN Red List category colours — single source of truth for every widget that
 * shows Red List categories (species Red List, IUCN Red List of Ecosystems). Consume these
 * instead of hardcoding hex values.
 *
 * Source: IUCN Red List Threat Categories – Colour Chart
 * https://nc.iucnredlist.org/redlist/resources/files/1759737820-IUCN_Red_List_Category_Colour_Chart.pdf
 *
 * Not in the official chart:
 * - Collapsed (CO, ecosystems only): use `IUCN_COLORS.ex`.
 * - Lower Risk (LR): IUCN says to show LR/cd as NT and LR/lc as LC.
 */
export const IUCN_COLORS = {
  ex: '#000000', // Extinct
  ew: '#542344', // Extinct in the Wild
  re: '#9B4F96', // Regionally Extinct
  cr: '#D81E05', // Critically Endangered
  en: '#FC7F3F', // Endangered
  vu: '#F9E814', // Vulnerable
  nt: '#CCE226', // Near Threatened
  lc: '#60C659', // Least Concern
  dd: '#D1D1C6', // Data Deficient
  ne: '#FFFFFF', // Not Evaluated
  na: '#C1B5A5', // Not Applicable
} as const;

// Pie slice outline: white fills (e.g. Not Evaluated) get a grey inner outline so they
// don't vanish on the white card; the rest keep the default white separator so the gap
// between slices matches the other widgets' pies.
export const getIucnSliceStroke = (color?: string) =>
  color?.toUpperCase() === '#FFFFFF' ? { stroke: 'rgba(0, 0, 0, 0.15)', strokeWidth: 1 } : {};
